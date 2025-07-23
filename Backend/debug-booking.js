const mongoose = require('mongoose');
require('dotenv').config();

// Import models
const Booking = require('./models/Booking');

async function checkBookingDetails() {
  try {
    // Connect to database
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Get the specific booking without population first
    const rawBooking = await Booking.findById('687df24028af4e51cd55ea3f');
    console.log('\n🔍 RAW BOOKING DATA (no population):');
    console.log('User ID:', rawBooking.user);
    console.log('Room ID:', rawBooking.room);
    console.log('Full booking:', JSON.stringify(rawBooking, null, 2));

    // Now try with population
    const populatedBooking = await Booking.findById('687df24028af4e51cd55ea3f')
      .populate('user', 'name email')
      .populate('room', 'type price');
    
    console.log('\n🔍 POPULATED BOOKING DATA:');
    console.log('User:', populatedBooking.user);
    console.log('Room:', populatedBooking.room);

    await mongoose.disconnect();
    console.log('\n✅ Test completed');
    
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

checkBookingDetails();
