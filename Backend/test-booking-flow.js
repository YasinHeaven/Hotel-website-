require('dotenv').config();
const axios = require('axios');

// Test the complete booking flow from user booking to admin approval
async function testBookingFlow() {
  console.log('🧪 Testing Complete Booking Flow: User → Admin\n');
  
  const API_BASE = 'http://localhost:5000/api';
  let userToken = '';
  let adminToken = '';
  let testBookingId = '';
  
  try {
    // Step 1: User Login
    console.log('1️⃣ Testing User Login...');
    
    try {
      const loginResponse = await axios.post(`${API_BASE}/users/login`, {
        email: 'testuser@example.com',
        password: 'testpass123'
      });
      userToken = loginResponse.data.token;
      console.log('✅ User login successful');
    } catch (err) {
      console.log('ℹ️  User login failed, trying to register...');
      
      // Register user if login fails
      await axios.post(`${API_BASE}/users/register`, {
        name: 'Test User',
        email: 'testuser@example.com',
        password: 'testpass123'
      });
      
      const loginResponse = await axios.post(`${API_BASE}/users/login`, {
        email: 'testuser@example.com',
        password: 'testpass123'
      });
      userToken = loginResponse.data.token;
      console.log('✅ User registered and logged in');
    }
    
    // Step 2: Get Available Rooms
    console.log('\n2️⃣ Getting Available Rooms...');
    
    const roomsResponse = await axios.get(`${API_BASE}/rooms`);
    const availableRooms = roomsResponse.data.filter(room => room.status === 'available');
    
    if (availableRooms.length === 0) {
      throw new Error('No available rooms found for testing');
    }
    
    const testRoom = availableRooms[0];
    console.log(`✅ Found available room: ${testRoom.type} (${testRoom.number}) - $${testRoom.price}/night`);
    
    // Step 3: User Creates Booking (This simulates booking from HomePage/RoomsPage)
    console.log('\n3️⃣ User Creating Booking...');
    
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dayAfter = new Date();
    dayAfter.setDate(dayAfter.getDate() + 3);
    
    const bookingData = {
      room: testRoom._id,
      checkIn: tomorrow.toISOString().split('T')[0],
      checkOut: dayAfter.toISOString().split('T')[0],
      guests: 2,
      customerInfo: {
        name: 'Test Customer',
        email: 'customer@example.com',
        phone: '+1234567890',
        specialRequests: 'Test booking from user interface'
      }
    };
    
    const bookingResponse = await axios.post(`${API_BASE}/bookings`, bookingData, {
      headers: { 'Authorization': `Bearer ${userToken}` }
    });
    
    testBookingId = bookingResponse.data.booking._id;
    console.log(`✅ User booking created successfully!`);
    console.log(`   📄 Booking ID: ${testBookingId}`);
    console.log(`   📊 Status: ${bookingResponse.data.booking.status}`);
    console.log(`   💰 Total: $${bookingResponse.data.booking.totalAmount}`);
    console.log(`   📋 Message: ${bookingResponse.data.message}`);
    
    // Step 4: Admin Login
    console.log('\n4️⃣ Admin Login...');
    
    const adminLoginResponse = await axios.post(`${API_BASE}/admin/login`, {
      email: process.env.ADMIN_EMAIL || 'admin@yasinheavenstar.com',
      password: process.env.ADMIN_PASSWORD || 'admin123'
    });
    
    adminToken = adminLoginResponse.data.token;
    console.log('✅ Admin login successful');
    
    // Step 5: Admin Views Bookings (This simulates AdminBookings page)
    console.log('\n5️⃣ Admin Viewing Bookings...');
    
    const adminBookingsResponse = await axios.get(`${API_BASE}/admin/bookings`, {
      headers: { 'Authorization': `Bearer ${adminToken}` }
    });
    
    console.log(`✅ Admin can see ${adminBookingsResponse.data.bookings.length} total bookings`);
    
    // Find our test booking
    const ourBooking = adminBookingsResponse.data.bookings.find(b => b._id === testBookingId);
    if (ourBooking) {
      console.log(`✅ Test booking found in admin panel!`);
      console.log(`   📊 Status: ${ourBooking.status}`);
      console.log(`   👤 Customer: ${ourBooking.customerInfo?.name || ourBooking.user?.name}`);
      console.log(`   🏨 Room: ${ourBooking.room?.type}`);
    } else {
      throw new Error('Test booking not found in admin panel!');
    }
    
    // Step 6: Admin Approves Booking
    console.log('\n6️⃣ Admin Approving Booking...');
    
    const approvalResponse = await axios.put(`${API_BASE}/admin/bookings/${testBookingId}/status`, {
      status: 'approved',
      adminNotes: 'Test approval - booking flow verification'
    }, {
      headers: { 'Authorization': `Bearer ${adminToken}` }
    });
    
    console.log(`✅ Booking approved successfully!`);
    console.log(`   📊 New Status: ${approvalResponse.data.booking.status}`);
    console.log(`   💳 Payment Status: ${approvalResponse.data.booking.paymentStatus}`);
    console.log(`   📝 Admin Notes: ${approvalResponse.data.booking.adminNotes}`);
    
    // Step 7: User Checks Booking Status
    console.log('\n7️⃣ User Checking Booking Status...');
    
    const userBookingsResponse = await axios.get(`${API_BASE}/bookings/my-bookings`, {
      headers: { 'Authorization': `Bearer ${userToken}` }
    });
    
    const userBooking = userBookingsResponse.data.find(b => b._id === testBookingId);
    if (userBooking) {
      console.log(`✅ User can see updated booking status!`);
      console.log(`   📊 Status: ${userBooking.status}`);
      console.log(`   💳 Payment Status: ${userBooking.paymentStatus}`);
    } else {
      throw new Error('User cannot see their booking!');
    }
    
    // Step 8: Cleanup
    console.log('\n8️⃣ Cleaning up...');
    
    await axios.delete(`${API_BASE}/admin/bookings/${testBookingId}`, {
      headers: { 'Authorization': `Bearer ${adminToken}` }
    });
    console.log('✅ Test booking cleaned up');
    
    console.log('\n🎉 BOOKING FLOW TEST PASSED!\n');
    
    console.log('📋 Flow Summary:');
    console.log('✅ User can create bookings from frontend');
    console.log('✅ Bookings appear in admin panel immediately');
    console.log('✅ Admin can approve/deny bookings');
    console.log('✅ Status updates are reflected for users');
    console.log('✅ Complete booking workflow is functional');
    
    console.log('\n🔄 Booking Flow:');
    console.log('1. User books room → Status: pending');
    console.log('2. Admin sees booking in panel');
    console.log('3. Admin approves → Status: approved');
    console.log('4. User sees updated status');
    console.log('5. Ready for payment confirmation');
    
  } catch (error) {
    console.error('❌ Booking flow test failed:', error.response?.data || error.message);
    
    // Cleanup on failure
    if (testBookingId && adminToken) {
      try {
        await axios.delete(`${API_BASE}/admin/bookings/${testBookingId}`, {
          headers: { 'Authorization': `Bearer ${adminToken}` }
        });
        console.log('🧹 Cleaned up test booking after failure');
      } catch (cleanupError) {
        console.log('⚠️  Could not cleanup test booking');
      }
    }
    
    process.exit(1);
  }
}

// Run test if called directly
if (require.main === module) {
  console.log('🚀 Starting Booking Flow Test...');
  console.log('Make sure the server is running on http://localhost:5000\n');
  
  testBookingFlow()
    .then(() => {
      console.log('✅ Booking flow test completed successfully!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Booking flow test failed:', error);
      process.exit(1);
    });
}

module.exports = { testBookingFlow };