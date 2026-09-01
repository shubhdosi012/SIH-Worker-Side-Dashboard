const express = require('express');
const router = express.Router();
const Review = require('../models/Review');
const Booking = require('../models/Booking');
const { protect } = require('../middleware/auth');

// @route   POST /api/reviews
// @desc    Customer: Submit a review for a completed booking
// @access  Private (Customer only)
router.post('/', protect, async (req, res) => {
  try {
    const { bookingId, rating, comment } = req.body;

    if (!bookingId || !rating || !comment) {
      return res.status(400).json({
        success: false,
        message: 'Please provide booking ID, rating (1-5), and review comments.',
      });
    }

    const booking = await Booking.findById(bookingId).populate('service', 'name');
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found.',
      });
    }

    if (booking.customer.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'You can only review services booked by your account.',
      });
    }

    if (booking.status !== 'completed') {
      return res.status(400).json({
        success: false,
        message: 'Reviews can only be submitted for completed service appointments.',
      });
    }

    const existingReview = await Review.findOne({ booking: bookingId });
    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: 'You have already submitted a review for this booking.',
      });
    }

    const review = await Review.create({
      booking: booking._id,
      customer: req.user.id,
      worker: booking.worker,
      rating: Number(rating),
      comment,
      serviceName: booking.service ? booking.service.name : 'Service',
    });

    booking.hasReview = true;
    await booking.save();

    const populatedReview = await Review.findById(review._id).populate(
      'customer',
      'name location'
    );

    res.status(201).json({
      success: true,
      message: 'Review submitted successfully. Thank you for supporting our worker cooperative!',
      review: populatedReview,
    });
  } catch (error) {
    console.error('Submit review error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to submit review.',
    });
  }
});

// @route   GET /api/reviews/worker/:workerId
// @desc    Get all reviews for a worker
// @access  Public
router.get('/worker/:workerId', async (req, res) => {
  try {
    const reviews = await Review.find({ worker: req.params.workerId })
      .populate('customer', 'name location')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: reviews.length,
      reviews,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve worker reviews.',
    });
  }
});

// @route   GET /api/reviews/recent
// @desc    Get recent reviews across the platform (for homepage testimonials)
// @access  Public
router.get('/recent', async (req, res) => {
  try {
    const limit = Math.min(parseInt(req.query.limit) || 6, 20);
    const reviews = await Review.find({})
      .populate('customer', 'name location')
      .populate('worker', 'name category')
      .sort({ createdAt: -1 })
      .limit(limit);

    res.json({
      success: true,
      count: reviews.length,
      reviews,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve recent reviews.',
    });
  }
});

module.exports = router;
