const mongoose = require('mongoose');
require('dotenv').config();

async function createTestBookingWorkflow() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('🔌 Connected to MongoDB');

    const Booking = require('./models/Booking');
    const User = require('./models/User');
    const Room = require('./models/Room');

    // Get test user and room
    const user = await User.findOne({ email: 'test@gmail.com' });
    const room = await Room.findOne({ type: 'Single Room' });
    
    if (!user || !room) {
      console.log('❌ User or room not found');
      await mongoose.disconnect();
      return;
    }

    console.log('📝 Creating new test booking...');
    console.log('👤 User:', user.name, '(' + user.email + ')');
    console.log('🏨 Room:', room.type, '- $' + room.price);

    const newBooking = new Booking({
      user: user._id,
      room: room._id,
      checkIn: new Date('2025-08-01'),
      checkOut: new Date('2025-08-03'),
      guests: 1,
      status: 'pending',
      customerInfo: {
        name: user.name,
        email: user.email,
        phone: '555-1234'
      },
      totalAmount: room.price * 2
    });

    await newBooking.save();
    console.log('✅ NEW TEST BOOKING CREATED!');
    console.log('📋 Booking ID:', newBooking._id);
    console.log('📊 Status:', newBooking.status);
    console.log('💰 Total:', '$' + newBooking.totalAmount);

    // Verify it can be found and populated
    const verifyBooking = await Booking.findById(newBooking._id)
      .populate('user', 'name email')
      .populate('room', 'type price');
    
    console.log('\n✅ VERIFICATION - Booking can be populated:');
    console.log('👤 User Name:', verifyBooking.user.name);
    console.log('🏨 Room Type:', verifyBooking.room.type);

    await mongoose.disconnect();
    console.log('\n🎉 TEST BOOKING WORKFLOW COMPLETED!');
    console.log('💡 This booking should now appear in the admin panel');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

createTestBookingWorkflow();
