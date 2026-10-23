const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();

const { connectDB } = require('./config/db');
const User = require('./models/User');
const seedData = require('./seed');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Mount API Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/services', require('./routes/services'));
app.use('/api/bookings', require('./routes/bookings'));
app.use('/api/reviews', require('./routes/reviews'));
app.use('/api/admin', require('./routes/admin'));

// Health check route
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    platform: 'SevaSangam Cooperative Gig Services API',
    timestamp: new Date().toISOString(),
  });
});

// Global 404 Handler
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: `API Route Not Found: ${req.method} ${req.originalUrl}`,
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err);
  res.status(500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

// Guard against PORT=0 being exported in the shell environment (0 is a valid but
// useless listen port — Express would bind a random ephemeral port).
const PORT = Number(process.env.PORT) > 0 ? Number(process.env.PORT) : 5000;

const startServer = async () => {
  try {
    await connectDB();

    // Auto-seed if users collection is empty
    const userCount = await User.countDocuments();
    if (userCount === 0) {
      console.log('⚡ Database empty. Auto-seeding initial cooperative data...');
      await seedData();
    }

    app.listen(PORT, () => {
      console.log(`🚀 SevaSangam Backend Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Fatal error starting server:', error);
    process.exit(1);
  }
};

startServer();
