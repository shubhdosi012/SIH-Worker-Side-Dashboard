const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
  {
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    worker: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    service: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Service',
      required: true,
    },
    date: {
      type: String,
      required: [true, 'Booking date is required'],
    },
    timeSlot: {
      type: String,
      required: [true, 'Time slot is required'],
    },
    address: {
      street: { type: String, required: true },
      city: { type: String, default: 'Indore' },
      landmark: { type: String, default: '' },
      pincode: { type: String, default: '452001' },
    },
    notes: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'in-progress', 'completed', 'cancelled', 'rejected'],
      default: 'pending',
    },
    // Financial Cooperative Breakdown
    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    commissionRate: {
      type: Number,
      default: 10, // 10%
    },
    commissionAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    workerEarning: {
      type: Number,
      required: true,
      min: 0,
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid_cash', 'settled'],
      default: 'pending',
    },
    paymentMethod: {
      type: String,
      default: 'Cash / Direct UPI upon completion',
    },
    cancelledBy: {
      type: String,
      enum: ['customer', 'worker', 'admin', null],
      default: null,
    },
    cancelReason: {
      type: String,
      default: '',
    },
    completedAt: {
      type: Date,
    },
    hasReview: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Booking', bookingSchema);
