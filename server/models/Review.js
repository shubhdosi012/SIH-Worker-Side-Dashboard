const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    booking: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Booking',
      required: true,
      unique: true,
    },
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
    rating: {
      type: Number,
      required: [true, 'Rating is required'],
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      required: [true, 'Review comment is required'],
      trim: true,
    },
    serviceName: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

// Static method to recalculate worker's average rating
reviewSchema.statics.calculateWorkerRating = async function (workerId) {
  const stats = await this.aggregate([
    { $match: { worker: new mongoose.Types.ObjectId(workerId) } },
    {
      $group: {
        _id: '$worker',
        avgRating: { $avg: '$rating' },
        totalReviews: { $sum: 1 },
      },
    },
  ]);

  const User = mongoose.model('User');
  if (stats.length > 0) {
    await User.findByIdAndUpdate(workerId, {
      avgRating: Math.round(stats[0].avgRating * 10) / 10,
      totalReviews: stats[0].totalReviews,
    });
  } else {
    await User.findByIdAndUpdate(workerId, {
      avgRating: 5.0,
      totalReviews: 0,
    });
  }
};

reviewSchema.post('save', async function () {
  await this.constructor.calculateWorkerRating(this.worker);
});

reviewSchema.post('findOneAndDelete', async function (doc) {
  if (doc) {
    await doc.constructor.calculateWorkerRating(doc.worker);
  }
});

module.exports = mongoose.model('Review', reviewSchema);
