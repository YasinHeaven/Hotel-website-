const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// Import models
const User = require('./models/User');
const Room = require('./models/Room');
const Booking = require('./models/Booking');

async function testCompleteBookingFlow() {
  try {
    console.log('🔄 Starting complete booking flow test...');
    
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/hotel');
    console.log('✅ Connected to MongoDB');
    
    // 1. Check if we have users
    const userCount = await User.countDocuments();
    console.log(`👥 Users in database: ${userCount}`);
    
    if (userCount === 0) {
      console.log('❌ No users found. Creating a test user...');
      const testUser = new User({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123'
      });
      await testUser.save();
      console.log('✅ Test user created');
    }
    
    // 2. Check if we have rooms
    const roomCount = await Room.countDocuments();
    console.log(`🏨 Rooms in database: ${roomCount}`);
    
    if (roomCount === 0) {
      console.log('❌ No rooms found. Creating a test room...');
      const testRoom = new Room({
        number: '101',
        type: 'Single Room',
        price: 100,
        status: 'available',
        description: 'A comfortable single room',
        capacity: 1
      });
      await testRoom.save();
      console.log('✅ Test room created');
    }
    
    // 3. Get a test user and room
    const testUser = await User.findOne();
    const testRoom = await Room.findOne({ status: 'available' });
    
    console.log(`👤 Test user: ${testUser.name} (${testUser.email})`);
    console.log(`🏨 Test room: ${testRoom.type} - Room ${testRoom.number} ($${testRoom.price})`);
    
    // 4. Create a test booking
    console.log('📝 Creating test booking...');
    
    const checkInDate = new Date();
    checkInDate.setDate(checkInDate.getDate() + 1); // Tomorrow
    const checkOutDate = new Date();
    checkOutDate.setDate(checkOutDate.getDate() + 3); // Day after tomorrow
    
    const bookingData = {
      user: testUser._id,
      room: testRoom._id,
      checkIn: checkInDate,
      checkOut: checkOutDate,
      guests: 1,
      customerInfo: {
        name: testUser.name,
        email: testUser.email,
        phone: '+1234567890'
      },
      specialRequests: 'Test booking from automated test'
    };
    
    const booking = new Booking(bookingData);
    await booking.save();
    
    console.log('✅ Booking created successfully!');
    console.log(`📋 Booking ID: ${booking._id}`);
    console.log(`💰 Total Amount: $${booking.totalAmount}`);
    console.log(`📅 Check-in: ${booking.checkIn.toISOString().split('T')[0]}`);
    console.log(`📅 Check-out: ${booking.checkOut.toISOString().split('T')[0]}`);
    console.log(`📊 Status: ${booking.status}`);
    
    // 5. Test fetching bookings
    console.log('🔍 Testing booking retrieval...');
    
    const userBookings = await Booking.find({ user: testUser._id }).populate('room');
    console.log(`📚 User has ${userBookings.length} booking(s)`);
    
    const allBookings = await Booking.find().populate('user room');
    console.log(`📚 Total bookings in system: ${allBookings.length}`);
    
    // 6. Test JWT token generation (simulate frontend auth)
    console.log('🔐 Testing JWT token generation...');
    const token = jwt.sign(
      { userId: testUser._id, email: testUser.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    console.log('✅ JWT token generated successfully');
    
    // 7. Test token verification
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('✅ JWT token verified successfully');
    console.log(`👤 Decoded user: ${decoded.email}`);
    
    console.log('🎉 Complete booking flow test PASSED!');
    
  } catch (error) {
    console.error('❌ Booking flow test FAILED:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

testCompleteBookingFlow();