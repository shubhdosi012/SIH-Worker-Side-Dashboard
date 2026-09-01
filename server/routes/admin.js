const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Booking = require('../models/Booking');
const Service = require('../models/Service');
const Setting = require('../models/Setting');
const { protect, authorize } = require('../middleware/auth');

// All routes here require admin privileges
router.use(protect);
router.use(authorize('admin'));

// @route   GET /api/admin/dashboard
// @desc    Get aggregated cooperative metrics and platform statistics
// @access  Private (Admin only)
router.get('/dashboard', async (req, res) => {
  try {
    const totalWorkers = await User.countDocuments({ role: 'worker' });
    const totalCustomers = await User.countDocuments({ role: 'customer' });
    const totalServices = await Service.countDocuments({ isActive: true });

    const totalBookings = await Booking.countDocuments();
    const completedBookings = await Booking.countDocuments({ status: 'completed' });
    const pendingBookings = await Booking.countDocuments({ status: 'pending' });
    const activeBookings = await Booking.countDocuments({ status: { $in: ['accepted', 'in-progress'] } });
    const cancelledBookings = await Booking.countDocuments({ status: { $in: ['cancelled', 'rejected'] } });

    // Financial aggregation
    const financialStats = await Booking.aggregate([
      { $match: { status: 'completed' } },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$totalAmount' },
          totalCommission: { $sum: '$commissionAmount' },
          totalWorkerEarnings: { $sum: '$workerEarning' },
          avgTicketSize: { $avg: '$totalAmount' },
        },
      },
    ]);

    const financials = financialStats[0] || {
      totalRevenue: 0,
      totalCommission: 0,
      totalWorkerEarnings: 0,
      avgTicketSize: 0,
    };

    // Category breakdown
    const categoryStats = await Booking.aggregate([
      { $match: { status: 'completed' } },
      {
        $lookup: {
          from: 'services',
          localField: 'service',
          foreignField: '_id',
          as: 'serviceDetails',
        },
      },
      { $unwind: '$serviceDetails' },
      {
        $group: {
          _id: '$serviceDetails.category',
          count: { $sum: 1 },
          revenue: { $sum: '$totalAmount' },
          workerEarnings: { $sum: '$workerEarning' },
        },
      },
      { $sort: { revenue: -1 } },
    ]);

    // Current commission rate
    const commissionSetting = await Setting.findOne({ key: 'commission_rate' });
    const commissionRate = commissionSetting ? commissionSetting.value : 10;

    // Recent bookings
    const recentBookings = await Booking.find()
      .populate('customer', 'name email')
      .populate('worker', 'name category')
      .populate('service', 'name')
      .sort({ createdAt: -1 })
      .limit(6);

    res.json({
      success: true,
      stats: {
        totalWorkers,
        totalCustomers,
        totalServices,
        totalBookings,
        completedBookings,
        pendingBookings,
        activeBookings,
        cancelledBookings,
        totalRevenue: financials.totalRevenue,
        totalCommission: financials.totalCommission,
        totalWorkerEarnings: financials.totalWorkerEarnings,
        avgTicketSize: Math.round(financials.avgTicketSize || 0),
        commissionRate,
      },
      categoryStats,
      recentBookings,
    });
  } catch (error) {
    console.error('Admin dashboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate admin metrics.',
    });
  }
});

// @route   GET /api/admin/workers
// @desc    Get all workers with their earnings and performance
// @access  Private (Admin only)
router.get('/workers', async (req, res) => {
  try {
    const workers = await User.find({ role: 'worker' })
      .select('-password')
      .sort({ totalEarnings: -1, avgRating: -1 });

    res.json({
      success: true,
      count: workers.length,
      workers,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve workers list.',
    });
  }
});

// @route   GET /api/admin/bookings
// @desc    Get master list of bookings with optional status filter
// @access  Private (Admin only)
router.get('/bookings', async (req, res) => {
  try {
    const { status, category } = req.query;
    let query = {};

    if (status && status !== 'all') {
      query.status = status;
    }

    const bookings = await Booking.find(query)
      .populate('customer', 'name email phone location')
      .populate('worker', 'name email phone category')
      .populate('service', 'name category basePrice')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: bookings.length,
      bookings,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve bookings list.',
    });
  }
});

// @route   GET /api/admin/commission
// @desc    Get current cooperative commission configuration
// @access  Private (Admin only)
router.get('/commission', async (req, res) => {
  try {
    const setting = await Setting.findOne({ key: 'commission_rate' });
    res.json({
      success: true,
      commissionRate: setting ? setting.value : 10,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve commission rate.',
    });
  }
});

// @route   PUT /api/admin/commission
// @desc    Update cooperative commission percentage
// @access  Private (Admin only)
router.put('/commission', async (req, res) => {
  try {
    const { rate } = req.body;
    const numRate = Number(rate);

    if (isNaN(numRate) || numRate < 0 || numRate > 50) {
      return res.status(400).json({
        success: false,
        message: 'Commission rate must be a valid number between 0% and 50%.',
      });
    }

    let setting = await Setting.findOne({ key: 'commission_rate' });
    if (!setting) {
      setting = new Setting({
        key: 'commission_rate',
        value: numRate,
        description: 'Platform cooperative administrative fee percentage',
      });
    } else {
      setting.value = numRate;
    }

    await setting.save();

    res.json({
      success: true,
      message: `Cooperative commission rate updated to ${numRate}%.`,
      commissionRate: numRate,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update commission rate.',
    });
  }
});

// @route   GET /api/admin/earnings
// @desc    Detailed transparent earnings audit ledger
// @access  Private (Admin only)
router.get('/earnings', async (req, res) => {
  try {
    const completedBookings = await Booking.find({ status: 'completed' })
      .populate('worker', 'name category email phone')
      .populate('customer', 'name email')
      .populate('service', 'name category')
      .sort({ completedAt: -1 });

    const totalRevenue = completedBookings.reduce((sum, b) => sum + b.totalAmount, 0);
    const totalCommission = completedBookings.reduce((sum, b) => sum + b.commissionAmount, 0);
    const totalWorkerPayouts = completedBookings.reduce((sum, b) => sum + b.workerEarning, 0);

    res.json({
      success: true,
      summary: {
        totalRevenue,
        totalCommission,
        totalWorkerPayouts,
        cooperativeRetainedPercent: totalRevenue > 0 ? ((totalCommission / totalRevenue) * 100).toFixed(1) : 0,
        workerDistributedPercent: totalRevenue > 0 ? ((totalWorkerPayouts / totalRevenue) * 100).toFixed(1) : 0,
      },
      ledger: completedBookings,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve earnings ledger.',
    });
  }
});

module.exports = router;
