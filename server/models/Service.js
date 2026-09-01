const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide service name'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Please provide service description'],
    },
    category: {
      type: String,
      required: true,
      enum: [
        'plumbing',
        'electrical',
        'cleaning',
        'painting',
        'carpentry',
        'appliance-repair',
        'ac-service',
        'gardening',
      ],
    },
    basePrice: {
      type: Number,
      required: [true, 'Please provide base price in INR'],
      min: 50,
    },
    duration: {
      type: String,
      default: '1-2 hours',
    },
    icon: {
      type: String,
      default: 'Wrench',
    },
    features: {
      type: [String],
      default: ['Verified Professional', 'Fair Cooperative Pricing', 'Quality Guarantee'],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isPopular: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Service', serviceSchema);
