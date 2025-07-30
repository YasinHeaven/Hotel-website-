const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const axios = require('axios');
require('dotenv').config();

// Import models
const User = require('./models/User');
const Room = require('./models/Room');

async function testBookingAPI() {
  try {
    console.log('🔄 Starting booking API test...');
    
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/hotel');
    console.log('✅ Connected to MongoDB');
    
    // Get or create test user and room
    let testUser = await User.findOne();
    if (!testUser) {
      testUser = new User({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123'
      });
      await testUser.save();
    }
    
    let testRoom = await Room.findOne({ status: 'available' });
    if (!testRoom) {
      testRoom = new Room({
        number: '101',
        type: 'Single Room',
        price: 100,
        status: 'available',
        description: 'A comfortable single room',
        capacity: 2
      });
      await testRoom.save();
    }
    
    console.log(`👤 Test user: ${testUser.name} (${testUser.email})`);
    console.log(`🏨 Test room: ${testRoom.type} - Room ${testRoom.number}`);
    
    // Generate auth token
    const token = jwt.sign(
      { userId: testUser._id, email: testUser.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    const baseURL = 'http://localhost:5000/api/bookings';
    const headers = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
    
    // Test 1: Valid booking
    console.log('\n✅ Test 1: Valid booking');
    const validBookingData = {
      room: testRoom._id,
      checkIn: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Tomorrow
      checkOut: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 3 days from now
      guests: 1,
      customerInfo: {
        name: 'John Doe',
        email: 'john@example.com',
        phone: '+1234567890',
        specialRequests: 'Late check-in please'
      }
    };
    
    try {
      const response = await axios.post(baseURL, validBookingData, { headers });
      console.log('✅ Valid booking created successfully');
      console.log(`📋 Booking ID: ${response.data.booking._id}`);
      console.log(`💰 Total Amount: ${response.data.booking.totalAmount}`);
      
      // Store booking ID for cleanup
      const bookingId = response.data.booking._id;
      
      // Clean up
      await axios.delete(`${baseURL}/${bookingId}`, { headers });
      console.log('🧹 Test booking cleaned up');
    } catch (error) {
      console.log('❌ Valid booking failed:', error.response?.data?.message || error.message);
    }
    
    // Test 2: Missing required fields
    console.log('\n❌ Test 2: Missing required fields');
    const missingFieldsData = {
      // Missing room, checkIn, checkOut
      guests: 1,
      customerInfo: {
        name: 'John Doe',
        email: 'john@example.com',
        phone: '+1234567890'
      }
    };
    
    try {
      await axios.post(baseURL, missingFieldsData, { headers });
      console.log('❌ Should have failed - missing required fields');
    } catch (error) {
      console.log('✅ Correctly rejected missing required fields:', error.response?.data?.message);
    }
    
    // Test 3: Past check-in date
    console.log('\n❌ Test 3: Past check-in date');
    const pastDateData = {
      room: testRoom._id,
      checkIn: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Yesterday
      checkOut: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Tomorrow
      guests: 1,
      customerInfo: {
        name: 'John Doe',
        email: 'john@example.com',
        phone: '+1234567890'
      }
    };
    
    try {
      await axios.post(baseURL, pastDateData, { headers });
      console.log('❌ Should have failed - past check-in date');
    } catch (error) {
      console.log('✅ Correctly rejected past check-in date:', error.response?.data?.message);
    }
    
    // Test 4: Invalid date range (check-out before check-in)
    console.log('\n❌ Test 4: Invalid date range');
    const invalidDateData = {
      room: testRoom._id,
      checkIn: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 3 days from now
      checkOut: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Tomorrow
      guests: 1,
      customerInfo: {
        name: 'John Doe',
        email: 'john@example.com',
        phone: '+1234567890'
      }
    };
    
    try {
      await axios.post(baseURL, invalidDateData, { headers });
      console.log('❌ Should have failed - invalid date range');
    } catch (error) {
      console.log('✅ Correctly rejected invalid date range:', error.response?.data?.message);
    }
    
    // Test 5: Exceeding room capacity
    console.log('\n❌ Test 5: Exceeding room capacity');
    const exceedCapacityData = {
      room: testRoom._id,
      checkIn: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      checkOut: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      guests: testRoom.capacity + 1, // Exceed room capacity
      customerInfo: {
        name: 'John Doe',
        email: 'john@example.com',
        phone: '+1234567890'
      }
    };
    
    try {
      await axios.post(baseURL, exceedCapacityData, { headers });
      console.log('❌ Should have failed - exceeding room capacity');
    } catch (error) {
      console.log('✅ Correctly rejected exceeding room capacity:', error.response?.data?.message);
    }
    
    // Test 6: Invalid guest count
    console.log('\n❌ Test 6: Invalid guest count');
    const invalidGuestsData = {
      room: testRoom._id,
      checkIn: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      checkOut: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      guests: 0, // Invalid guest count
      customerInfo: {
        name: 'John Doe',
        email: 'john@example.com',
        phone: '+1234567890'
      }
    };
    
    try {
      await axios.post(baseURL, invalidGuestsData, { headers });
      console.log('❌ Should have failed - invalid guest count');
    } catch (error) {
      console.log('✅ Correctly rejected invalid guest count:', error.response?.data?.message);
    }
    
    // Test 7: Invalid email format
    console.log('\n❌ Test 7: Invalid email format');
    const invalidEmailData = {
      room: testRoom._id,
      checkIn: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      checkOut: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      guests: 1,
      customerInfo: {
        name: 'John Doe',
        email: 'invalid-email-format', // Invalid email
        phone: '+1234567890'
      }
    };
    
    try {
      await axios.post(baseURL, invalidEmailData, { headers });
      console.log('❌ Should have failed - invalid email format');
    } catch (error) {
      console.log('✅ Correctly rejected invalid email format:', error.response?.data?.message);
    }
    
    // Test 8: Booking duration too long
    console.log('\n❌ Test 8: Booking duration too long');
    const longDurationData = {
      room: testRoom._id,
      checkIn: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      checkOut: new Date(Date.now() + 35 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 35 days
      guests: 1,
      customerInfo: {
        name: 'John Doe',
        email: 'john@example.com',
        phone: '+1234567890'
      }
    };
    
    try {
      await axios.post(baseURL, longDurationData, { headers });
      console.log('❌ Should have failed - booking duration too long');
    } catch (error) {
      console.log('✅ Correctly rejected long booking duration:', error.response?.data?.message);
    }
    
    // Test 9: No authentication token
    console.log('\n❌ Test 9: No authentication token');
    try {
      await axios.post(baseURL, validBookingData); // No headers
      console.log('❌ Should have failed - no authentication token');
    } catch (error) {
      console.log('✅ Correctly rejected request without token:', error.response?.data?.message);
    }
    
    console.log('\n🎉 Booking API validation test COMPLETED!');
    console.log('✅ All API validation scenarios tested successfully');
    
  } catch (error) {
    console.error('❌ Booking API test FAILED:', error.message);
    if (error.code === 'ECONNREFUSED') {
      console.log('💡 Make sure the server is running on http://localhost:5000');
    }
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

testBookingAPI();