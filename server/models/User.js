const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a name'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Please provide an email'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        'Please provide a valid email',
      ],
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: 6,
      select: false,
    },
    phone: {
      type: String,
      trim: true,
      default: '',
    },
    role: {
      type: String,
      enum: ['customer', 'worker', 'admin'],
      default: 'customer',
    },
    avatar: {
      type: String,
      default: '',
    },
    // Worker Specific Details
    category: {
      type: String,
      enum: [
        'plumbing',
        'electrical',
        'cleaning',
        'painting',
        'carpentry',
        'appliance-repair',
        'ac-service',
        'gardening',
        'general',
      ],
      default: 'general',
    },
    skills: {
      type: [String],
      default: [],
    },
    experience: {
      type: Number,
      default: 1, // in years
    },
    bio: {
      type: String,
      default: 'Experienced service professional dedicated to quality work.',
    },
    hourlyRate: {
      type: Number,
      default: 350, // in INR
    },
    availability: {
      type: Boolean,
      default: true,
    },
    avgRating: {
      type: Number,
      default: 5.0,
      min: 1,
      max: 5,
    },
    totalReviews: {
      type: Number,
      default: 0,
    },
    totalJobsCompleted: {
      type: Number,
      default: 0,
    },
    totalEarnings: {
      type: Number,
      default: 0,
    },
    totalCommissionPaid: {
      type: Number,
      default: 0,
    },
    location: {
      type: String,
      default: 'City Center',
    },
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password method
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
