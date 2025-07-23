// Test script to check booking creation
const mongoose = require('mongoose');
require('dotenv').config();

const connectToMongoDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/yasin_heaven_star_hotel');
    console.log('✅ Connected to MongoDB');
    
    const Booking = require('./models/Booking');
    const User = require('./models/User');
    const Room = require('./models/Room');
    
    console.log('📊 Current data in database:');
    
    const users = await User.find().select('name email');
    console.log('👥 Users:', users.length);
    users.forEach(user => console.log(`  - ${user.name} (${user.email})`));
    
    const rooms = await Room.find().select('type number');
    console.log('🏨 Rooms:', rooms.length);
    rooms.forEach(room => console.log(`  - ${room.type} #${room.number}`));
    
    const bookings = await Booking.find().populate('user', 'name email').populate('room', 'type number');
    console.log('📅 Bookings:', bookings.length);
    bookings.forEach(booking => {
      console.log(`  - ${booking.user?.name || 'Unknown'} booked ${booking.room?.type || 'Unknown'} #${booking.room?.number || 'N/A'} (${booking.status})`);
    });
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

connectToMongoDB();
