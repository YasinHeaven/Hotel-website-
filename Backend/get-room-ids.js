const mongoose = require('mongoose');
require('dotenv').config();

const Room = require('./models/Room');
const User = require('./models/User');

async function getRoomAndUserIds() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');
    
    const rooms = await Room.find().limit(3);
    console.log('🏨 Available rooms:');
    rooms.forEach(room => {
      console.log(`  - ${room.type} (Room ${room.number}): ${room._id}`);
    });
    
    const users = await User.find().limit(3);
    console.log('👥 Available users:');
    users.forEach(user => {
      console.log(`  - ${user.name} (${user.email}): ${user._id}`);
    });
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.disconnect();
  }
}

getRoomAndUserIds();