const mongoose = require('mongoose');
require('dotenv').config();

// Import models
const Booking = require('./models/Booking');
const User = require('./models/User');
const Room = require('./models/Room');

async function testBookingIssue() {
  try {
    // Connect to database
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Check all bookings in database
    console.log('\n📋 CHECKING ALL BOOKINGS IN DATABASE:');
    const allBookings = await Booking.find()
      .populate('user', 'name email')
      .populate('room', 'type price');
    
    console.log(`📊 Total bookings found: ${allBookings.length}`);
    
    allBookings.forEach((booking, index) => {
      console.log(`\n${index + 1}. Booking ID: ${booking._id}`);
      console.log(`   User: ${booking.user?.name || 'No user'} (${booking.user?.email || 'No email'})`);
      console.log(`   Room: ${booking.room?.type || 'No room type'}`);
      console.log(`   Status: ${booking.status}`);
      console.log(`   Check-in: ${booking.checkIn}`);
      console.log(`   Check-out: ${booking.checkOut}`);
      console.log(`   Created: ${booking.createdAt}`);
    });

    // Check users
    console.log('\n👥 CHECKING ALL USERS:');
    const allUsers = await User.find({}, 'name email role');
    console.log(`📊 Total users found: ${allUsers.length}`);
    
    allUsers.forEach((user, index) => {
      console.log(`${index + 1}. ${user.name} (${user.email}) - Role: ${user.role || 'user'}`);
    });

    // Check rooms
    console.log('\n🏨 CHECKING ALL ROOMS:');
    const allRooms = await Room.find({}, 'type price');
    console.log(`📊 Total rooms found: ${allRooms.length}`);
    
    allRooms.forEach((room, index) => {
      console.log(`${index + 1}. ${room.type} - $${room.price}`);
    });

    await mongoose.disconnect();
    console.log('\n✅ Test completed - database disconnected');
    
  } catch (error) {
    console.error('❌ Error during test:', error);
    process.exit(1);
  }
}

testBookingIssue();
