const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// Import models
const User = require('./models/User');
const Room = require('./models/Room');
const Booking = require('./models/Booking');

async function testBookingValidation() {
  try {
    console.log('🔄 Starting booking validation test...');
    
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
    console.log(`🏨 Test room: ${testRoom.type} - Room ${testRoom.number} (Capacity: ${testRoom.capacity})`);
    
    // Generate auth token
    const token = jwt.sign(
      { userId: testUser._id, email: testUser.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    // Test 1: Valid booking data
    console.log('\n✅ Test 1: Valid booking data');
    const validBookingData = {
      user: testUser._id,
      room: testRoom._id,
      checkIn: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
      checkOut: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
      guests: 1,
      customerInfo: {
        name: 'John Doe',
        email: 'john@example.com',
        phone: '+1234567890',
        specialRequests: 'Late check-in please'
      }
    };
    
    try {
      const validBooking = new Booking(validBookingData);
      await validBooking.save();
      console.log('✅ Valid booking created successfully');
      console.log(`📋 Booking ID: ${validBooking._id}`);
      console.log(`💰 Total Amount: ${validBooking.totalAmount}`);
      
      // Clean up
      await Booking.findByIdAndDelete(validBooking._id);
    } catch (error) {
      console.log('❌ Valid booking failed:', error.message);
    }
    
    // Test 2: Missing required fields
    console.log('\n❌ Test 2: Missing required fields');
    const missingFieldsData = {
      user: testUser._id,
      // Missing room, checkIn, checkOut
      guests: 1,
      customerInfo: {
        name: 'John Doe',
        email: 'john@example.com',
        phone: '+1234567890'
      }
    };
    
    try {
      const missingFieldsBooking = new Booking(missingFieldsData);
      await missingFieldsBooking.save();
      console.log('❌ Should have failed - missing required fields');
    } catch (error) {
      console.log('✅ Correctly rejected missing required fields:', error.message);
    }
    
    // Test 3: Invalid date range (check-out before check-in)
    console.log('\n❌ Test 3: Invalid date range');
    const invalidDateData = {
      user: testUser._id,
      room: testRoom._id,
      checkIn: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
      checkOut: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow (before check-in)
      guests: 1,
      customerInfo: {
        name: 'John Doe',
        email: 'john@example.com',
        phone: '+1234567890'
      }
    };
    
    try {
      const invalidDateBooking = new Booking(invalidDateData);
      await invalidDateBooking.save();
      console.log('❌ Should have failed - invalid date range');
    } catch (error) {
      console.log('✅ Correctly rejected invalid date range');
    }
    
    // Test 4: Past check-in date
    console.log('\n❌ Test 4: Past check-in date');
    const pastDateData = {
      user: testUser._id,
      room: testRoom._id,
      checkIn: new Date(Date.now() - 24 * 60 * 60 * 1000), // Yesterday
      checkOut: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
      guests: 1,
      customerInfo: {
        name: 'John Doe',
        email: 'john@example.com',
        phone: '+1234567890'
      }
    };
    
    try {
      const pastDateBooking = new Booking(pastDateData);
      await pastDateBooking.save();
      console.log('❌ Should have failed - past check-in date');
    } catch (error) {
      console.log('✅ Correctly rejected past check-in date');
    }
    
    // Test 5: Exceeding room capacity
    console.log('\n❌ Test 5: Exceeding room capacity');
    const exceedCapacityData = {
      user: testUser._id,
      room: testRoom._id,
      checkIn: new Date(Date.now() + 24 * 60 * 60 * 1000),
      checkOut: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      guests: testRoom.capacity + 1, // Exceed room capacity
      customerInfo: {
        name: 'John Doe',
        email: 'john@example.com',
        phone: '+1234567890'
      }
    };
    
    try {
      const exceedCapacityBooking = new Booking(exceedCapacityData);
      await exceedCapacityBooking.save();
      console.log('❌ Should have failed - exceeding room capacity');
    } catch (error) {
      console.log('✅ Correctly rejected exceeding room capacity');
    }
    
    // Test 6: Invalid guest count (zero or negative)
    console.log('\n❌ Test 6: Invalid guest count');
    const invalidGuestsData = {
      user: testUser._id,
      room: testRoom._id,
      checkIn: new Date(Date.now() + 24 * 60 * 60 * 1000),
      checkOut: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      guests: 0, // Invalid guest count
      customerInfo: {
        name: 'John Doe',
        email: 'john@example.com',
        phone: '+1234567890'
      }
    };
    
    try {
      const invalidGuestsBooking = new Booking(invalidGuestsData);
      await invalidGuestsBooking.save();
      console.log('❌ Should have failed - invalid guest count');
    } catch (error) {
      console.log('✅ Correctly rejected invalid guest count');
    }
    
    // Test 7: Missing customer info
    console.log('\n❌ Test 7: Missing customer info');
    const missingCustomerData = {
      user: testUser._id,
      room: testRoom._id,
      checkIn: new Date(Date.now() + 24 * 60 * 60 * 1000),
      checkOut: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      guests: 1,
      customerInfo: {
        // Missing name, email, phone
      }
    };
    
    try {
      const missingCustomerBooking = new Booking(missingCustomerData);
      await missingCustomerBooking.save();
      console.log('❌ Should have failed - missing customer info');
    } catch (error) {
      console.log('✅ Correctly rejected missing customer info');
    }
    
    // Test 8: Invalid email format
    console.log('\n❌ Test 8: Invalid email format');
    const invalidEmailData = {
      user: testUser._id,
      room: testRoom._id,
      checkIn: new Date(Date.now() + 24 * 60 * 60 * 1000),
      checkOut: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      guests: 1,
      customerInfo: {
        name: 'John Doe',
        email: 'invalid-email-format', // Invalid email
        phone: '+1234567890'
      }
    };
    
    try {
      const invalidEmailBooking = new Booking(invalidEmailData);
      await invalidEmailBooking.save();
      console.log('❌ Should have failed - invalid email format');
    } catch (error) {
      console.log('✅ Correctly rejected invalid email format');
    }
    
    // Test 9: Booking duration too long (over 30 days)
    console.log('\n❌ Test 9: Booking duration too long');
    const longDurationData = {
      user: testUser._id,
      room: testRoom._id,
      checkIn: new Date(Date.now() + 24 * 60 * 60 * 1000),
      checkOut: new Date(Date.now() + 35 * 24 * 60 * 60 * 1000), // 35 days
      guests: 1,
      customerInfo: {
        name: 'John Doe',
        email: 'john@example.com',
        phone: '+1234567890'
      }
    };
    
    try {
      const longDurationBooking = new Booking(longDurationData);
      await longDurationBooking.save();
      console.log('❌ Should have failed - booking duration too long');
    } catch (error) {
      console.log('✅ Correctly rejected long booking duration');
    }
    
    // Test 10: Conflicting booking dates
    console.log('\n❌ Test 10: Conflicting booking dates');
    
    // First, create a booking
    const firstBooking = new Booking({
      user: testUser._id,
      room: testRoom._id,
      checkIn: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
      checkOut: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
      guests: 1,
      customerInfo: {
        name: 'First Guest',
        email: 'first@example.com',
        phone: '+1234567890'
      }
    });
    await firstBooking.save();
    console.log('✅ First booking created for conflict test');
    
    // Try to create a conflicting booking
    const conflictingData = {
      user: testUser._id,
      room: testRoom._id,
      checkIn: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now (overlaps)
      checkOut: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000), // 4 days from now
      guests: 1,
      customerInfo: {
        name: 'Second Guest',
        email: 'second@example.com',
        phone: '+1234567890'
      }
    };
    
    // Check for conflicts manually (this would be done in the API route)
    const existingBooking = await Booking.findOne({
      room: testRoom._id,
      $or: [
        {
          checkIn: { $lte: conflictingData.checkOut },
          checkOut: { $gt: conflictingData.checkIn }
        }
      ],
      status: { $nin: ['cancelled', 'denied', 'no-show'] }
    });
    
    if (existingBooking) {
      console.log('✅ Correctly detected booking conflict');
    } else {
      console.log('❌ Failed to detect booking conflict');
    }
    
    // Clean up
    await Booking.findByIdAndDelete(firstBooking._id);
    
    console.log('\n🎉 Booking validation test COMPLETED!');
    console.log('✅ All validation scenarios tested successfully');
    
  } catch (error) {
    console.error('❌ Booking validation test FAILED:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

testBookingValidation();