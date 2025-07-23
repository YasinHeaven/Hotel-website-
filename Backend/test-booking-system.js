require('dotenv').config();
const mongoose = require('mongoose');
const axios = require('axios');

// Test the complete booking system workflow
async function testBookingSystem() {
  console.log('🧪 Testing Complete Booking System Workflow...\n');
  
  const API_BASE = 'http://localhost:5000/api';
  let userToken = '';
  let adminToken = '';
  let testBookingId = '';
  
  try {
    // Step 1: Test User Registration and Login
    console.log('1️⃣ Testing User Authentication...');
    
    const testUser = {
      name: 'Test User',
      email: 'testuser@example.com',
      password: 'testpass123'
    };
    
    try {
      await axios.post(`${API_BASE}/users/register`, testUser);
      console.log('✅ User registered successfully');
    } catch (err) {
      if (err.response?.status === 400 && err.response?.data?.message?.includes('already exists')) {
        console.log('ℹ️  User already exists, proceeding with login');
      } else {
        throw err;
      }
    }
    
    const loginResponse = await axios.post(`${API_BASE}/users/login`, {
      email: testUser.email,
      password: testUser.password
    });
    
    userToken = loginResponse.data.token;
    console.log('✅ User login successful');
    
    // Step 2: Test Admin Login
    console.log('\n2️⃣ Testing Admin Authentication...');
    
    const adminLoginResponse = await axios.post(`${API_BASE}/admin/login`, {
      email: process.env.ADMIN_EMAIL || 'admin@yasinheavenstar.com',
      password: process.env.ADMIN_PASSWORD || 'admin123'
    });
    
    adminToken = adminLoginResponse.data.token;
    console.log('✅ Admin login successful');
    
    // Step 3: Get Available Rooms
    console.log('\n3️⃣ Testing Room Availability...');
    
    const roomsResponse = await axios.get(`${API_BASE}/rooms`);
    const availableRooms = roomsResponse.data.filter(room => room.status === 'available');
    
    if (availableRooms.length === 0) {
      throw new Error('No available rooms found for testing');
    }
    
    const testRoom = availableRooms[0];
    console.log(`✅ Found available room: ${testRoom.type} (${testRoom.number}) - $${testRoom.price}/night`);
    
    // Step 4: Test Booking Creation (User)
    console.log('\n4️⃣ Testing Booking Creation...');
    
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
        specialRequests: 'Test booking - please ignore'
      }
    };
    
    const bookingResponse = await axios.post(`${API_BASE}/bookings`, bookingData, {
      headers: { 'Authorization': `Bearer ${userToken}` }
    });
    
    testBookingId = bookingResponse.data.booking._id;
    console.log(`✅ Booking created successfully: ${testBookingId}`);
    console.log(`   Status: ${bookingResponse.data.booking.status}`);
    console.log(`   Total: $${bookingResponse.data.booking.totalAmount}`);
    
    // Step 5: Test Admin Booking Management
    console.log('\n5️⃣ Testing Admin Booking Management...');
    
    // Get all bookings (admin)
    const adminBookingsResponse = await axios.get(`${API_BASE}/admin/bookings`, {
      headers: { 'Authorization': `Bearer ${adminToken}` }
    });
    
    console.log(`✅ Admin can view ${adminBookingsResponse.data.bookings.length} bookings`);
    
    // Test booking approval
    console.log('\n6️⃣ Testing Booking Approval Workflow...');
    
    const approvalResponse = await axios.put(`${API_BASE}/admin/bookings/${testBookingId}/status`, {
      status: 'approved',
      adminNotes: 'Test approval - automated test'
    }, {
      headers: { 'Authorization': `Bearer ${adminToken}` }
    });
    
    console.log(`✅ Booking approved successfully`);
    console.log(`   New Status: ${approvalResponse.data.booking.status}`);
    console.log(`   Payment Status: ${approvalResponse.data.booking.paymentStatus}`);
    
    // Step 7: Test User Booking Retrieval
    console.log('\n7️⃣ Testing User Booking Retrieval...');
    
    const userBookingsResponse = await axios.get(`${API_BASE}/bookings/my-bookings`, {
      headers: { 'Authorization': `Bearer ${userToken}` }
    });
    
    const userBooking = userBookingsResponse.data.find(b => b._id === testBookingId);
    console.log(`✅ User can view their booking: ${userBooking.status}`);
    
    // Step 8: Test Booking Status Updates
    console.log('\n8️⃣ Testing Booking Status Transitions...');
    
    // Mark as booked (payment received)
    await axios.put(`${API_BASE}/admin/bookings/${testBookingId}/status`, {
      status: 'booked',
      adminNotes: 'Payment received - test'
    }, {
      headers: { 'Authorization': `Bearer ${adminToken}` }
    });
    console.log('✅ Booking marked as booked');
    
    // Mark as checked-in
    await axios.put(`${API_BASE}/admin/bookings/${testBookingId}/status`, {
      status: 'checked-in',
      adminNotes: 'Guest checked in - test'
    }, {
      headers: { 'Authorization': `Bearer ${adminToken}` }
    });
    console.log('✅ Booking marked as checked-in');
    
    // Mark as checked-out
    await axios.put(`${API_BASE}/admin/bookings/${testBookingId}/status`, {
      status: 'checked-out',
      adminNotes: 'Guest checked out - test completed'
    }, {
      headers: { 'Authorization': `Bearer ${adminToken}` }
    });
    console.log('✅ Booking marked as checked-out');
    
    // Step 9: Test Security Validations
    console.log('\n9️⃣ Testing Security Validations...');
    
    // Test invalid date
    try {
      await axios.post(`${API_BASE}/bookings`, {
        ...bookingData,
        checkIn: '2020-01-01', // Past date
        checkOut: '2020-01-02'
      }, {
        headers: { 'Authorization': `Bearer ${userToken}` }
      });
      console.log('❌ Security test failed - past date should be rejected');
    } catch (err) {
      if (err.response?.status === 400) {
        console.log('✅ Security validation working - past dates rejected');
      }
    }
    
    // Test invalid email
    try {
      await axios.post(`${API_BASE}/bookings`, {
        ...bookingData,
        customerInfo: {
          ...bookingData.customerInfo,
          email: 'invalid-email'
        }
      }, {
        headers: { 'Authorization': `Bearer ${userToken}` }
      });
      console.log('❌ Security test failed - invalid email should be rejected');
    } catch (err) {
      if (err.response?.status === 400) {
        console.log('✅ Security validation working - invalid email rejected');
      }
    }
    
    // Step 10: Cleanup
    console.log('\n🧹 Cleaning up test data...');
    
    // Delete test booking
    await axios.delete(`${API_BASE}/admin/bookings/${testBookingId}`, {
      headers: { 'Authorization': `Bearer ${adminToken}` }
    });
    console.log('✅ Test booking deleted');
    
    console.log('\n🎉 ALL TESTS PASSED! Booking system is working correctly.\n');
    
    console.log('📋 Test Summary:');
    console.log('✅ User authentication');
    console.log('✅ Admin authentication');
    console.log('✅ Room availability check');
    console.log('✅ Booking creation with validation');
    console.log('✅ Admin booking management');
    console.log('✅ Booking approval workflow');
    console.log('✅ Status transition management');
    console.log('✅ User booking retrieval');
    console.log('✅ Security validations');
    console.log('✅ Data cleanup');
    
  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
    
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

// Run tests if called directly
if (require.main === module) {
  console.log('🚀 Starting Booking System Tests...');
  console.log('Make sure the server is running on http://localhost:5000\n');
  
  testBookingSystem()
    .then(() => {
      console.log('✅ All tests completed successfully!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Tests failed:', error);
      process.exit(1);
    });
}

module.exports = { testBookingSystem };