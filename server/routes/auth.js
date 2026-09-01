const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { protect } = require('../middleware/auth');

// Helper to generate JWT
const generateToken = (id) => {
  return jwt.sign(
    { id },
    process.env.JWT_SECRET || 'sevasangam_cooperative_secret_jwt_key_2026_secure',
    { expiresIn: '30d' }
  );
};

// @route   POST /api/auth/register
// @desc    Register a new customer or worker
// @access  Public
router.post('/register', async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      phone,
      role,
      category,
      skills,
      experience,
      bio,
      hourlyRate,
      location,
    } = req.body;

    // Check if user already exists
    const userExists = await User.findOne({ email: email.toLowerCase() });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: 'A user with this email address already exists.',
      });
    }

    const userData = {
      name,
      email: email.toLowerCase(),
      password,
      phone: phone || '',
      role: role || 'customer',
      location: location || 'City Center',
    };

    // If registering as a worker, populate worker-specific details
    if (role === 'worker') {
      userData.category = category || 'general';
      userData.skills = Array.isArray(skills)
        ? skills
        : typeof skills === 'string' && skills.trim()
        ? skills.split(',').map((s) => s.trim())
        : [];
      userData.experience = Number(experience) || 1;
      userData.bio = bio || 'Skilled service professional.';
      userData.hourlyRate = Number(hourlyRate) || 350;
      userData.availability = true;
    }

    const user = await User.create(userData);

    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        category: user.category,
        skills: user.skills,
        experience: user.experience,
        bio: user.bio,
        hourlyRate: user.hourlyRate,
        availability: user.availability,
        avgRating: user.avgRating,
        totalReviews: user.totalReviews,
        location: user.location,
      },
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error during registration.',
    });
  }
});

// @route   POST /api/auth/login
// @desc    Authenticate user & get JWT token
// @access  Public
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both email and password.',
      });
    }

    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials. User not found.',
      });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials. Password incorrect.',
      });
    }

    const token = generateToken(user._id);

    res.json({
      success: true,
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        category: user.category,
        skills: user.skills,
        experience: user.experience,
        bio: user.bio,
        hourlyRate: user.hourlyRate,
        availability: user.availability,
        avgRating: user.avgRating,
        totalReviews: user.totalReviews,
        totalEarnings: user.totalEarnings,
        totalJobsCompleted: user.totalJobsCompleted,
        location: user.location,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during login.',
    });
  }
});

// @route   GET /api/auth/me
// @desc    Get currently authenticated user details
// @access  Private
router.get('/me', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.json({
      success: true,
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching profile.',
    });
  }
});

// @route   PUT /api/auth/profile
// @desc    Update current user profile / availability / worker bio
// @access  Private
router.put('/profile', protect, async (req, res) => {
  try {
    const fieldsToUpdate = {};
    const allowedFields = [
      'name',
      'phone',
      'location',
      'bio',
      'hourlyRate',
      'availability',
      'skills',
      'experience',
      'category',
    ];

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        fieldsToUpdate[field] = req.body[field];
      }
    });

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { $set: fieldsToUpdate },
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      message: 'Profile updated successfully.',
      user: updatedUser,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error updating profile.',
    });
  }
});

// @route   GET /api/auth/workers
// @desc    Get list of workers (filterable by category, search)
// @access  Public
router.get('/workers', async (req, res) => {
  try {
    const { category, search, available } = req.query;
    const query = { role: 'worker' };

    if (category && category !== 'all') {
      query.category = category;
    }

    if (available === 'true') {
      query.availability = true;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { bio: { $regex: search, $options: 'i' } },
        { skills: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } },
      ];
    }

    const workers = await User.find(query).sort({ avgRating: -1, totalJobsCompleted: -1 });

    res.json({
      success: true,
      count: workers.length,
      workers,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching workers.',
    });
  }
});

// @route   GET /api/auth/workers/:id
// @desc    Get single worker profile with public info
// @access  Public
router.get('/workers/:id', async (req, res) => {
  try {
    const worker = await User.findOne({ _id: req.params.id, role: 'worker' });
    if (!worker) {
      return res.status(404).json({
        success: false,
        message: 'Worker not found.',
      });
    }
    res.json({
      success: true,
      worker,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching worker profile.',
    });
  }
});

module.exports = router;
