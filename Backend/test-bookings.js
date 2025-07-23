const mongoose = require('mongoose');
const Booking = require('./models/Booking');

async function testBooking() {
  try {
    await mongoose.connect('mongodb://localhost:27017/hotel');
    console.log('✅ Connected to MongoDB');
    
    const bookingCount = await Booking.countDocuments();
    console.log('📊 Current bookings in database:', bookingCount);
    
    const recentBookings = await Booking.find().populate('user room').limit(3);
    console.log('📋 Recent bookings:');
    recentBookings.forEach(booking => {
      console.log('  - ID:', booking._id.toString().slice(-6));
      console.log('    User:', booking.user?.name || 'N/A');
      console.log('    Room:', booking.room?.number || 'N/A');
      console.log('    Status:', booking.status);
      console.log('---');
    });
    
    process.exit(0);
  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  }
}

testBooking();
