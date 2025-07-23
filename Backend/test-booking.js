// Quick test to create a user booking manually
const mongoose = require('mongoose');
require('dotenv').config();

const createTestBooking = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/yasin_heaven_star_hotel');
    console.log('✅ Connected to MongoDB');
    
    const Booking = require('./models/Booking');
    const User = require('./models/User');
    const Room = require('./models/Room');
    
    // Find a user and room to create booking
    const user = await User.findOne().sort({ createdAt: -1 }); // Get latest user
    const room = await Room.findOne(); // Get any room
    
    if (!user || !room) {
      console.log('❌ No user or room found');
      process.exit(1);
    }
    
    console.log(`👤 Using user: ${user.name} (${user.email})`);
    console.log(`🏨 Using room: ${room.type} #${room.number}`);
    
    // Create a test booking
    const booking = new Booking({
      user: user._id,
      room: room._id,
      checkIn: new Date('2025-07-25'),
      checkOut: new Date('2025-07-27'),
      guests: 2,
      customerInfo: {
        name: `${user.name}`,
        email: user.email,
        phone: '123-456-7890'
      },
      status: 'pending'
    });
    
    await booking.save();
    console.log('✅ Test booking created:', booking._id);
    
    // Verify it was saved
    const allBookings = await Booking.find().populate('user', 'name email').populate('room', 'type number');
    console.log(`📊 Total bookings now: ${allBookings.length}`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

createTestBooking();
