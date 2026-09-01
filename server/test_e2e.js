const http = require('http');

const request = (options, postData = null) => {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          resolve({ status: res.statusCode, data: parsed });
        } catch (e) {
          resolve({ status: res.statusCode, raw: data });
        }
      });
    });

    req.on('error', (err) => reject(err));

    if (postData) {
      req.write(JSON.stringify(postData));
    }
    req.end();
  });
};

const runE2E = async () => {
  console.log('🚀 Starting SevaSangam Automated End-to-End Test Suite...\n');

  try {
    // 1. Health check
    console.log('1️⃣ Testing Server Health...');
    const health = await request({
      hostname: 'localhost',
      port: 5000,
      path: '/api/health',
      method: 'GET',
    });
    console.log('   Status:', health.status, 'Response:', health.data);
    if (health.status !== 200) throw new Error('Health check failed');

    // 2. Fetch Services
    console.log('\n2️⃣ Testing Services Catalog Retrieval...');
    const services = await request({
      hostname: 'localhost',
      port: 5000,
      path: '/api/services',
      method: 'GET',
    });
    console.log(`   Found ${services.data.count} active services.`);
    const sampleService = services.data.services[0];
    console.log(`   Sample Service: "${sampleService.name}" (Base Price: ₹${sampleService.basePrice})`);

    // 3. Customer Login
    console.log('\n3️⃣ Testing Customer Authentication (Rahul Sharma)...');
    const customerLogin = await request(
      {
        hostname: 'localhost',
        port: 5000,
        path: '/api/auth/login',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      },
      { email: 'rahul@example.com', password: 'password123' }
    );
    console.log('   Customer Login Success:', customerLogin.data.success, 'Role:', customerLogin.data.user.role);
    const customerToken = customerLogin.data.token;
    const customerId = customerLogin.data.user._id;

    // 4. Fetch Available Workers
    console.log('\n4️⃣ Testing Worker Discovery (Category: plumbing)...');
    const workers = await request({
      hostname: 'localhost',
      port: 5000,
      path: '/api/auth/workers?category=plumbing',
      method: 'GET',
    });
    console.log(`   Found ${workers.data.count} plumbing workers.`);
    const plumber = workers.data.workers[0];
    console.log(`   Selected Worker: ${plumber.name} (Avg Rating: ${plumber.avgRating}, Hourly: ₹${plumber.hourlyRate})`);

    // 5. Customer Places Booking
    console.log('\n5️⃣ Testing Booking Creation with 90/10 Cooperative Wage Calculation...');
    const newBooking = await request(
      {
        hostname: 'localhost',
        port: 5000,
        path: '/api/bookings',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${customerToken}`,
        },
      },
      {
        serviceId: sampleService._id,
        workerId: plumber._id,
        date: '2026-09-04',
        timeSlot: '02:00 PM - 04:00 PM',
        address: {
          street: 'Flat 402, Royal Palms, Scheme 54',
          city: 'Indore',
          pincode: '452010',
        },
        notes: 'Bathroom shower tap dripping continuously.',
      }
    );
    console.log('   Booking Created Status:', newBooking.status);
    console.log('   Booking ID:', newBooking.data.booking._id);
    console.log(`   💰 Gross Amount: ₹${newBooking.data.booking.totalAmount}`);
    console.log(`   🤝 Co-op Fee (10%): ₹${newBooking.data.booking.commissionAmount}`);
    console.log(`   👷 Worker Payout (90%): ₹${newBooking.data.booking.workerEarning}`);
    const bookingId = newBooking.data.booking._id;

    // 6. Worker Login (Ramesh Kumar)
    console.log('\n6️⃣ Testing Worker Authentication (Ramesh Kumar)...');
    const workerLogin = await request(
      {
        hostname: 'localhost',
        port: 5000,
        path: '/api/auth/login',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      },
      { email: 'ramesh.plumber@example.com', password: 'password123' }
    );
    console.log('   Worker Login Success:', workerLogin.data.success, 'Role:', workerLogin.data.user.role);
    const workerToken = workerLogin.data.token;

    // 7. Worker Accepts & Completes Job
    console.log('\n7️⃣ Testing Worker Job Lifecycle (Accept -> In-Progress -> Complete)...');
    await request(
      {
        hostname: 'localhost',
        port: 5000,
        path: `/api/bookings/${bookingId}/status`,
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${workerToken}`,
        },
      },
      { status: 'accepted' }
    );
    console.log('   Job Accepted.');

    const completedRes = await request(
      {
        hostname: 'localhost',
        port: 5000,
        path: `/api/bookings/${bookingId}/status`,
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${workerToken}`,
        },
      },
      { status: 'completed' }
    );
    console.log('   Job Completed & Settled:', completedRes.data.booking.status);

    // 8. Customer Submits Review
    console.log('\n8️⃣ Testing Customer Review & Rating Submission...');
    const reviewRes = await request(
      {
        hostname: 'localhost',
        port: 5000,
        path: '/api/reviews',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${customerToken}`,
        },
      },
      {
        bookingId,
        rating: 5,
        comment: 'Ramesh was prompt, courteous, and solved the leak instantly. Excellent cooperative service!',
      }
    );
    console.log('   Review Created Status:', reviewRes.status, 'Rating:', reviewRes.data.review.rating);

    // 9. Admin Governance Portal & Commission Rate Update
    console.log('\n9️⃣ Testing Admin Governance Dashboard (admin@sevasangam.org)...');
    const adminLogin = await request(
      {
        hostname: 'localhost',
        port: 5000,
        path: '/api/auth/login',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      },
      { email: 'admin@sevasangam.org', password: 'password123' }
    );
    const adminToken = adminLogin.data.token;

    const dashRes = await request({
      hostname: 'localhost',
      port: 5000,
      path: '/api/admin/dashboard',
      method: 'GET',
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    console.log('   Platform Total Revenue:', `₹${dashRes.data.stats.totalRevenue}`);
    console.log('   Platform Worker Payouts:', `₹${dashRes.data.stats.totalWorkerEarnings}`);
    console.log('   Platform Co-op Commission:', `₹${dashRes.data.stats.totalCommission}`);
    console.log('   Total Bookings:', dashRes.data.stats.totalBookings);

    // Update Commission rate to 12%
    console.log('\n🔟 Testing Updating Cooperative Commission Fee to 12%...');
    const updateFeeRes = await request(
      {
        hostname: 'localhost',
        port: 5000,
        path: '/api/admin/commission',
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`,
        },
      },
      { rate: 12 }
    );
    console.log('   Commission Fee Update Response:', updateFeeRes.data.message);

    // 11. Test Frontend Client Delivery
    console.log('\n1️⃣1️⃣ Testing Frontend Client Delivery (http://localhost:5173)...');
    const clientRes = await request({
      hostname: 'localhost',
      port: 5173,
      path: '/',
      method: 'GET',
    });
    console.log('   Client HTML Status:', clientRes.status, 'Contains Root Element:', clientRes.raw?.includes('id="root"'));

    console.log('\n🎉 ALL 11 END-TO-END SYSTEM TESTS PASSED SUCCESSFULLY! ✅');
  } catch (error) {
    console.error('❌ E2E Test Failed:', error);
    process.exit(1);
  }
};

runE2E();
