const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/yasin_heaven_star_hotel', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const User = require('./models/User');
const Room = require('./models/Room');
const Booking = require('./models/Booking');

mongoose.connection.once('open', async () => {
  try {
    const bookings = await Booking.find().populate('user').populate('room');
    const users = await User.find();
    const rooms = await Room.find();
    
    console.log('Total users in database:', users.length);
    console.log('Total rooms in database:', rooms.length);
    console.log('Total bookings in database:', bookings.length);
    
    if (bookings.length > 0) {
      console.log('Bookings:', bookings.map(b => ({
        id: b._id,
        user: b.user?.name || 'Unknown',
        room: b.room?.type || 'Unknown',
        status: b.status,
        customerInfo: b.customerInfo,
        createdAt: b.createdAt
      })));
    }
  } catch (err) {
    console.error('Error:', err);
  } finally {
    mongoose.connection.close();
  }
});
