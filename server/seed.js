const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const { connectDB, closeDB } = require('./config/db');
const User = require('./models/User');
const Service = require('./models/Service');
const Booking = require('./models/Booking');
const Review = require('./models/Review');
const Setting = require('./models/Setting');

const seedData = async () => {
  try {
    console.log('🌱 Starting SevaSangam Database Seeding...');
    await connectDB();

    // Clear existing collections
    await User.deleteMany({});
    await Service.deleteMany({});
    await Booking.deleteMany({});
    await Review.deleteMany({});
    await Setting.deleteMany({});
    console.log('🧹 Cleaned existing database collections.');

    // 1. Create Default Platform Settings
    await Setting.create({
      key: 'commission_rate',
      value: 10,
      description: 'Platform cooperative administrative fee percentage (10%)',
    });

    // 2. Create Admin User
    const admin = await User.create({
      name: 'SevaSangam Admin',
      email: 'admin@sevasangam.org',
      password: 'password123',
      phone: '+91 98765 00001',
      role: 'admin',
      location: 'Indore HQ',
    });

    // 3. Create Customers
    const customers = await User.create([
      {
        name: 'Rahul Sharma',
        email: 'rahul@example.com',
        password: 'password123',
        phone: '+91 98260 11223',
        role: 'customer',
        location: 'Vijay Nagar, Indore',
      },
      {
        name: 'Ananya Patel',
        email: 'ananya@example.com',
        password: 'password123',
        phone: '+91 98260 44556',
        role: 'customer',
        location: 'Palasia, Indore',
      },
      {
        name: 'Vikram Mehta',
        email: 'vikram@example.com',
        password: 'password123',
        phone: '+91 98260 77889',
        role: 'customer',
        location: 'Geeta Bhawan, Indore',
      },
    ]);

    // 4. Create Skilled Cooperative Workers
    const workers = await User.create([
      {
        name: 'Ramesh Kumar',
        email: 'ramesh.plumber@example.com',
        password: 'password123',
        phone: '+91 94250 11111',
        role: 'worker',
        category: 'plumbing',
        skills: ['Pipe Fitting', 'Bathroom Sanitary Repair', 'Water Tank Cleaning', 'Leakage Detection'],
        experience: 8,
        bio: 'Certified master plumber with 8+ years experience solving residential & commercial plumbing challenges with 100% honesty.',
        hourlyRate: 400,
        availability: true,
        location: 'Vijay Nagar & Central Indore',
        avgRating: 4.9,
        totalReviews: 24,
        totalJobsCompleted: 28,
        totalEarnings: 32400,
        totalCommissionPaid: 3600,
      },
      {
        name: 'Priya Sharma',
        email: 'priya.electrician@example.com',
        password: 'password123',
        phone: '+91 94250 22222',
        role: 'worker',
        category: 'electrical',
        skills: ['House Wiring', 'MCB / Inverter Repair', 'Appliance Setup', 'LED Fixtures & Chandeliers'],
        experience: 6,
        bio: 'Licensed electrical engineer turned cooperative tradesperson. Precision troubleshooting and safety-first wiring.',
        hourlyRate: 450,
        availability: true,
        location: 'Palasia & Bengali Square',
        avgRating: 4.9,
        totalReviews: 18,
        totalJobsCompleted: 22,
        totalEarnings: 27000,
        totalCommissionPaid: 3000,
      },
      {
        name: 'Amit Tiwari',
        email: 'amit.carpenter@example.com',
        password: 'password123',
        phone: '+91 94250 33333',
        role: 'worker',
        category: 'carpentry',
        skills: ['Custom Furniture', 'Door & Window Hinges', 'Modular Kitchen Repair', 'Polishing'],
        experience: 10,
        bio: 'Veteran carpenter specializing in custom wooden fixes, modular cabinets, and lock/hinge restorations.',
        hourlyRate: 500,
        availability: true,
        location: 'Bhawarkua & Annapurna',
        avgRating: 5.0,
        totalReviews: 15,
        totalJobsCompleted: 19,
        totalEarnings: 24300,
        totalCommissionPaid: 2700,
      },
      {
        name: 'Sunita Devi',
        email: 'sunita.cleaning@example.com',
        password: 'password123',
        phone: '+91 94250 44444',
        role: 'worker',
        category: 'cleaning',
        skills: ['Full House Deep Cleaning', 'Kitchen Degreasing', 'Bathroom Disinfection', 'Sofa Shampooing'],
        experience: 5,
        bio: 'Cooperative leader and eco-friendly cleaning expert. Eco-safe detergents, high-pressure equipment, spotless results.',
        hourlyRate: 350,
        availability: true,
        location: 'Scheme 54 & Sukhlia',
        avgRating: 4.8,
        totalReviews: 31,
        totalJobsCompleted: 35,
        totalEarnings: 37800,
        totalCommissionPaid: 4200,
      },
      {
        name: 'Rajesh Verma',
        email: 'rajesh.painter@example.com',
        password: 'password123',
        phone: '+91 94250 55555',
        role: 'worker',
        category: 'painting',
        skills: ['Interior Emulsion', 'Waterproof Exterior', 'Texture Designs', 'Wall Putty Finishing'],
        experience: 7,
        bio: 'Artisan wall painter skilled in modern texture finishes, anti-fungal waterproofing, and clean, dust-free prep work.',
        hourlyRate: 450,
        availability: true,
        location: 'Rajendra Nagar & Silicon City',
        avgRating: 4.7,
        totalReviews: 12,
        totalJobsCompleted: 15,
        totalEarnings: 20250,
        totalCommissionPaid: 2250,
      },
      {
        name: 'Manoj Gupta',
        email: 'manoj.appliance@example.com',
        password: 'password123',
        phone: '+91 94250 66666',
        role: 'worker',
        category: 'appliance-repair',
        skills: ['Washing Machine PCB', 'Refrigerator Gas Refill', 'Microwave Repair', 'RO Water Purifier'],
        experience: 9,
        bio: 'Certified technician with OEM multi-brand experience repairing major home appliances with genuine parts.',
        hourlyRate: 400,
        availability: true,
        location: 'Mahalaxmi Nagar & Nipania',
        avgRating: 4.9,
        totalReviews: 21,
        totalJobsCompleted: 26,
        totalEarnings: 29700,
        totalCommissionPaid: 3300,
      },
    ]);

    // 5. Create Services Catalog
    const services = await Service.create([
      {
        name: 'Tap, Pipe Leak & Drainage Repair',
        description: 'Comprehensive inspection and repair of dripping taps, burst pipes, blocked drain traps, and bathroom fittings with genuine parts.',
        category: 'plumbing',
        basePrice: 400,
        duration: '1-2 hours',
        icon: 'Wrench',
        features: ['Leak Detection', 'Standard Washer & Seal Replacement', '30-day Quality Guarantee'],
        isPopular: true,
      },
      {
        name: 'Electrical Fault & Short Circuit Fix',
        description: 'Emergency wiring diagnosis, tripping MCB resolution, switchboard rewiring, and surge protection installations.',
        category: 'electrical',
        basePrice: 450,
        duration: '1-2 hours',
        icon: 'Zap',
        features: ['Certified Diagnostics', 'Safety Load Calculation', 'Original OEM Switches & Wire Fixes'],
        isPopular: true,
      },
      {
        name: 'Full Home Deep Cleaning & Sanitization',
        description: 'Intense scrubbing and sanitization of bathrooms, kitchen grease removal, balcony wash, and floor machine buffing.',
        category: 'cleaning',
        basePrice: 1200,
        duration: '3-4 hours',
        icon: 'Sparkles',
        features: ['Eco-friendly Degreasers', 'High-temp Steam Disinfection', 'Dust-mite Free Vacuuming'],
        isPopular: true,
      },
      {
        name: 'Door Lock, Hinge & Furniture Repair',
        description: 'Expert carpenter service for jammed doors, mortise lock installation, squeaky hinges, and modular drawer alignment.',
        category: 'carpentry',
        basePrice: 500,
        duration: '1-2 hours',
        icon: 'Hammer',
        features: ['Precision Carpentry Tools', 'Solid Wood & Hardware Fitting', 'Smooth Movement Guarantee'],
        isPopular: false,
      },
      {
        name: 'Wall Touchup & Room Painting',
        description: 'Smooth wall putty touchups, patch repair, and premium acrylic emulsion coating with clean masking protection.',
        category: 'painting',
        basePrice: 1500,
        duration: '4-6 hours',
        icon: 'Paintbrush',
        features: ['Mess-free Masking Film', 'Dual Coat Roller Finish', 'Zero VOC Odor-free Paints'],
        isPopular: false,
      },
      {
        name: 'Washing Machine & Fridge Repair',
        description: 'Diagnostic troubleshooting and repair for front/top load washers, single/double door refrigerators, cooling problems.',
        category: 'appliance-repair',
        basePrice: 550,
        duration: '1-2 hours',
        icon: 'Tv',
        features: ['Accurate Fault Code Check', 'Authentic Component Replacement', '90-day Warranty on Replaced Spares'],
        isPopular: true,
      },
    ]);

    // 6. Create Historical Completed Bookings
    const booking1 = await Booking.create({
      customer: customers[0]._id,
      worker: workers[0]._id,
      service: services[0]._id,
      date: '2026-08-25',
      timeSlot: '10:00 AM - 12:00 PM',
      address: {
        street: 'Flat 402, Royal Palms, Scheme 54',
        city: 'Indore',
        landmark: 'Near C21 Mall',
        pincode: '452010',
      },
      notes: 'Kitchen sink pipe is leaking under the cabinet.',
      status: 'completed',
      totalAmount: 400,
      commissionRate: 10,
      commissionAmount: 40,
      workerEarning: 360,
      paymentStatus: 'settled',
      completedAt: new Date('2026-08-25T11:30:00Z'),
      hasReview: true,
    });

    const booking2 = await Booking.create({
      customer: customers[1]._id,
      worker: workers[1]._id,
      service: services[1]._id,
      date: '2026-08-27',
      timeSlot: '02:00 PM - 04:00 PM',
      address: {
        street: 'Villa 12, Silver Springs',
        city: 'Indore',
        landmark: 'AB Bypass Road',
        pincode: '452016',
      },
      notes: 'Master bedroom main switchboard sparked and tripped MCB.',
      status: 'completed',
      totalAmount: 450,
      commissionRate: 10,
      commissionAmount: 45,
      workerEarning: 405,
      paymentStatus: 'settled',
      completedAt: new Date('2026-08-27T15:45:00Z'),
      hasReview: true,
    });

    // 7. Create Active and Pending Bookings
    await Booking.create([
      {
        customer: customers[2]._id,
        worker: workers[0]._id,
        service: services[0]._id,
        date: '2026-09-02',
        timeSlot: '09:00 AM - 11:00 AM',
        address: {
          street: 'House 88, Geeta Bhawan Square',
          city: 'Indore',
          landmark: 'Opposite Temple',
          pincode: '452001',
        },
        notes: 'Overhead water tank float valve not shutting off properly.',
        status: 'pending',
        totalAmount: 400,
        commissionRate: 10,
        commissionAmount: 40,
        workerEarning: 360,
      },
      {
        customer: customers[0]._id,
        worker: workers[3]._id,
        service: services[2]._id,
        date: '2026-09-03',
        timeSlot: '11:00 AM - 02:00 PM',
        address: {
          street: 'Flat 402, Royal Palms, Scheme 54',
          city: 'Indore',
          landmark: 'Near C21 Mall',
          pincode: '452010',
        },
        notes: 'Pre-festival full 3BHK deep cleaning requested.',
        status: 'accepted',
        totalAmount: 1200,
        commissionRate: 10,
        commissionAmount: 120,
        workerEarning: 1080,
      },
    ]);

    // 8. Create Reviews
    await Review.create([
      {
        booking: booking1._id,
        customer: customers[0]._id,
        worker: workers[0]._id,
        rating: 5,
        comment: 'Ramesh ji arrived right on time, diagnosed the leak within 5 minutes, and replaced the faulty gasket. Fair cooperative rates and no hidden charges!',
        serviceName: services[0].name,
      },
      {
        booking: booking2._id,
        customer: customers[1]._id,
        worker: workers[1]._id,
        rating: 5,
        comment: 'Priya was extremely professional and thorough with the electrical diagnostics. She replaced the faulty breaker safely and explained what went wrong. Truly empowered worker cooperative!',
        serviceName: services[1].name,
      },
    ]);

    console.log('✅ SevaSangam Database Seeded Successfully!');
    console.log('----------------------------------------------------');
    console.log('Demo Credentials for Instant Testing:');
    console.log('👑 Admin:     admin@sevasangam.org / password123');
    console.log('🔧 Worker 1:  ramesh.plumber@example.com / password123 (Plumber)');
    console.log('⚡ Worker 2:  priya.electrician@example.com / password123 (Electrician)');
    console.log('👤 Customer:  rahul@example.com / password123');
    console.log('----------------------------------------------------');

    if (process.argv.includes('--exit')) {
      process.exit(0);
    }
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
};

if (require.main === module) {
  seedData().then(() => {
    console.log('Seeding finished.');
    process.exit(0);
  });
}

module.exports = seedData;
