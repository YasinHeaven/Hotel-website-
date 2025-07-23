const mongoose = require('mongoose');
require('dotenv').config();

async function createTestBooking() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected');

    // Import models after connection
    const Booking = require('./models/Booking');
    const User = require('./models/User');
    const Room = require('./models/Room');

    // Get test user and room
    const user = await User.findOne({ email: 'test@gmail.com' });
    const room = await Room.findOne({ type: 'Single Room' });
    
    console.log('User found:', !!user);
    console.log('Room found:', !!room);

    if (user && room) {
      const booking = new Booking({
        user: user._id,
        room: room._id,
        checkIn: new Date('2025-08-01'),
        checkOut: new Date('2025-08-03'),
        guests: 2,
        status: 'pending',
        customerInfo: {
          name: user.name,
          email: user.email,
          phone: '555-0123'
        },
        totalAmount: room.price * 2
      });

      await booking.save();
      console.log('✅ New booking created:', booking._id);
    }

    await mongoose.disconnect();
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

createTestBooking();
