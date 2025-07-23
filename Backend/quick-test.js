const mongoose = require('mongoose');
require('dotenv').config();
const Booking = require('./models/Booking');
const User = require('./models/User');

async function quickTest() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected');
    
    const booking = await Booking.findById('687df24028af4e51cd55ea3f')
      .populate('user', 'name email')
      .populate('room', 'type price');
    
    console.log('Booking user:', booking.user ? booking.user.name : 'No user');
    console.log('Booking room:', booking.room ? booking.room.type : 'No room');
    
    await mongoose.disconnect();
    console.log('Done');
  } catch (err) {
    console.error('Error:', err.message);
  }
}

quickTest();
