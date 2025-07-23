const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/yasin_heaven_star_hotel');

const User = require('./models/User');
const Room = require('./models/Room');
const Booking = require('./models/Booking');

async function createTestData() {
  try {
    // Find or create a test user
    let user = await User.findOne({ email: 'test@example.com' });
    if (!user) {
      user = new User({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123'
      });
      await user.save();
      console.log('User created:', user._id);
    } else {
      console.log('Using existing user:', user._id);
    }

    // Find or create a test room
    let room = await Room.findOne({ number: 101 });
    if (!room) {
      room = new Room({
        number: 101,
        type: 'Single Room',
        price: 100,
        status: 'available',
        description: 'Test room'
      });
      await room.save();
      console.log('Room created:', room._id);
    } else {
      console.log('Using existing room:', room._id);
    }

    // Create a new test booking with unique dates
    const booking = new Booking({
      user: user._id,
      room: room._id,
      checkIn: new Date('2025-07-25'),
      checkOut: new Date('2025-07-27'),
      guests: 1,
      customerInfo: {
        name: 'Test Guest',
        email: 'guest@example.com',
        phone: '123-456-7890'
      },
      status: 'pending'
    });
    await booking.save();
    console.log('Booking created:', booking._id);

    // Fetch and display the booking
    const savedBooking = await Booking.findById(booking._id).populate('user').populate('room');
    console.log('Saved booking:', {
      id: savedBooking._id,
      user: savedBooking.user.name,
      room: savedBooking.room.type,
      status: savedBooking.status,
      customerInfo: savedBooking.customerInfo
    });

  } catch (err) {
    console.error('Error:', err);
  } finally {
    mongoose.connection.close();
  }
}

createTestData();
