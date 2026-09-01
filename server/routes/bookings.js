const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const Service = require('../models/Service');
const User = require('../models/User');
const Setting = require('../models/Setting');
const { protect } = require('../middleware/auth');

// Helper to get dynamic commission percentage
const getCommissionRate = async () => {
  try {
    const setting = await Setting.findOne({ key: 'commission_rate' });
    if (setting && typeof setting.value === 'number') {
      return setting.value;
    }
  } catch (err) {
    console.error('Error reading commission rate setting:', err);
  }
  return Number(process.env.DEFAULT_COMMISSION_PERCENT) || 10;
};

// @route   POST /api/bookings
// @desc    Customer: Create a new service booking with transparent financial breakdown
// @access  Private (Customer only)
router.post('/', protect, async (req, res) => {
  try {
    const { serviceId, workerId, date, timeSlot, address, notes, customPrice } = req.body;

    if (!serviceId || !workerId || !date || !timeSlot || !address || !address.street) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required booking details (service, worker, date, time slot, and address).',
      });
    }

    const service = await Service.findById(serviceId);
    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Selected service does not exist.',
      });
    }

    const worker = await User.findOne({ _id: workerId, role: 'worker' });
    if (!worker) {
      return res.status(404).json({
        success: false,
        message: 'Selected worker does not exist or is invalid.',
      });
    }

    // Determine booking price
    const totalAmount = Number(customPrice) || Number(service.basePrice) || 350;
    const commissionRate = await getCommissionRate();
    const commissionAmount = Math.round((totalAmount * commissionRate) / 100);
    const workerEarning = totalAmount - commissionAmount;

    const booking = await Booking.create({
      customer: req.user.id,
      worker: worker._id,
      service: service._id,
      date,
      timeSlot,
      address,
      notes: notes || '',
      totalAmount,
      commissionRate,
      commissionAmount,
      workerEarning,
      status: 'pending',
    });

    const populatedBooking = await Booking.findById(booking._id)
      .populate('customer', 'name email phone location')
      .populate('worker', 'name email phone category hourlyRate avgRating')
      .populate('service', 'name category basePrice icon');

    res.status(201).json({
      success: true,
      message: 'Booking request placed successfully!',
      booking: populatedBooking,
    });
  } catch (error) {
    console.error('Booking creation error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to create booking.',
    });
  }
});

// @route   GET /api/bookings/my
// @desc    Get bookings for logged in user (customer or worker)
// @access  Private
router.get('/my', protect, async (req, res) => {
  try {
    let query = {};
    if (req.user.role === 'customer') {
      query.customer = req.user.id;
    } else if (req.user.role === 'worker') {
      query.worker = req.user.id;
    } else if (req.user.role === 'admin') {
      // Admin sees all
    }

    const bookings = await Booking.find(query)
      .populate('customer', 'name email phone location')
      .populate('worker', 'name email phone category avgRating hourlyRate')
      .populate('service', 'name category basePrice icon')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: bookings.length,
      bookings,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve bookings.',
    });
  }
});

// @route   GET /api/bookings/:id
// @desc    Get single booking by ID
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('customer', 'name email phone location')
      .populate('worker', 'name email phone category avgRating hourlyRate bio')
      .populate('service', 'name category basePrice icon features');

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found.',
      });
    }

    // Ensure only involved parties or admin can view
    const isCustomer = booking.customer._id.toString() === req.user.id;
    const isWorker = booking.worker._id.toString() === req.user.id;
    const isAdmin = req.user.role === 'admin';

    if (!isCustomer && !isWorker && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized to view this booking.',
      });
    }

    res.json({
      success: true,
      booking,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve booking details.',
    });
  }
});

// @route   PUT /api/bookings/:id/status
// @desc    Update booking status (accept, in-progress, completed, cancelled, rejected)
// @access  Private
router.put('/:id/status', protect, async (req, res) => {
  try {
    const { status, cancelReason } = req.body;
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found.',
      });
    }

    const isCustomer = booking.customer.toString() === req.user.id;
    const isWorker = booking.worker.toString() === req.user.id;
    const isAdmin = req.user.role === 'admin';

    if (!isCustomer && !isWorker && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to modify this booking.',
      });
    }

    const previousStatus = booking.status;

    // Customer cancellation rules
    if (status === 'cancelled') {
      if (!isCustomer && !isAdmin && !isWorker) {
        return res.status(403).json({
          success: false,
          message: 'Not authorized to cancel this booking.',
        });
      }
      booking.status = 'cancelled';
      booking.cancelledBy = req.user.role;
      booking.cancelReason = cancelReason || 'Cancelled by user';
    } else if (['accepted', 'in-progress', 'rejected', 'completed'].includes(status)) {
      // Only worker or admin can update these workflow states
      if (!isWorker && !isAdmin) {
        return res.status(403).json({
          success: false,
          message: 'Only the assigned worker or admin can transition to this status.',
        });
      }
      booking.status = status;

      if (status === 'completed' && previousStatus !== 'completed') {
        booking.completedAt = new Date();
        booking.paymentStatus = 'settled';

        // Update worker earnings and stats
        await User.findByIdAndUpdate(booking.worker, {
          $inc: {
            totalEarnings: booking.workerEarning,
            totalCommissionPaid: booking.commissionAmount,
            totalJobsCompleted: 1,
          },
        });
      }
    } else {
      return res.status(400).json({
        success: false,
        message: 'Invalid status transition.',
      });
    }

    await booking.save();

    const updatedBooking = await Booking.findById(booking._id)
      .populate('customer', 'name email phone location')
      .populate('worker', 'name email phone category avgRating')
      .populate('service', 'name category basePrice icon');

    res.json({
      success: true,
      message: `Booking status updated to ${status}.`,
      booking: updatedBooking,
    });
  } catch (error) {
    console.error('Update booking status error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to update booking status.',
    });
  }
});

module.exports = router;
