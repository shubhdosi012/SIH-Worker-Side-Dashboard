const express = require('express');
const router = express.Router();
const Service = require('../models/Service');
const User = require('../models/User');
const { protect, authorize } = require('../middleware/auth');

// @route   GET /api/services
// @desc    Get all active services with optional category & search filters
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { category, search, popular } = req.query;
    const query = { isActive: true };

    if (category && category !== 'all') {
      query.category = category;
    }

    if (popular === 'true') {
      query.isPopular = true;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const services = await Service.find(query).sort({ isPopular: -1, createdAt: -1 });

    res.json({
      success: true,
      count: services.length,
      services,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve services.',
    });
  }
});

// @route   GET /api/services/:id
// @desc    Get service detail and available workers for that category
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found.',
      });
    }

    // Find workers matching this category
    const workers = await User.find({
      role: 'worker',
      category: service.category,
    }).sort({ avgRating: -1, totalJobsCompleted: -1 });

    res.json({
      success: true,
      service,
      workers,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve service details.',
    });
  }
});

// @route   POST /api/services
// @desc    Admin: Create new service
// @access  Private (Admin only)
router.post('/', protect, authorize('admin'), async (req, res) => {
  try {
    const { name, description, category, basePrice, duration, icon, features, isPopular } = req.body;

    const service = await Service.create({
      name,
      description,
      category,
      basePrice,
      duration: duration || '1-2 hours',
      icon: icon || 'Wrench',
      features: features || ['Verified Professional', 'Fair Cooperative Pricing', 'Quality Guarantee'],
      isPopular: isPopular || false,
    });

    res.status(201).json({
      success: true,
      message: 'Service created successfully.',
      service,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to create service.',
    });
  }
});

// @route   PUT /api/services/:id
// @desc    Admin: Update service
// @access  Private (Admin only)
router.put('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const service = await Service.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found.',
      });
    }

    res.json({
      success: true,
      message: 'Service updated successfully.',
      service,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to update service.',
    });
  }
});

// @route   DELETE /api/services/:id
// @desc    Admin: Soft delete / toggle active service
// @access  Private (Admin only)
router.delete('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const service = await Service.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );

    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found.',
      });
    }

    res.json({
      success: true,
      message: 'Service deactivated successfully.',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to deactivate service.',
    });
  }
});

module.exports = router;
