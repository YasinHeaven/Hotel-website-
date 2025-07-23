// Database test script
require('dotenv').config();
const mongoose = require('mongoose');
const Room = require('./models/Room');

async function testDatabase() {
  try {
    console.log('🔌 Connecting to database...');
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/yasin_heaven_star_hotel');
    console.log('✅ Connected to MongoDB');

    // Test 1: Count existing rooms
    console.log('\n1️⃣ Checking existing rooms...');
    const roomCount = await Room.countDocuments();
    console.log(`✅ Found ${roomCount} rooms in database`);

    // Test 2: Get all rooms
    console.log('\n2️⃣ Fetching all rooms...');
    const rooms = await Room.find();
    console.log('✅ Rooms retrieved:');
    rooms.forEach((room, index) => {
      console.log(`   ${index + 1}. ${room.type} (Room ${room.number}) - $${room.price}/night`);
    });

    // Test 3: Create a new test room
    console.log('\n3️⃣ Creating a test room...');
    const testRoom = new Room({
      number: 'TEST123',
      type: 'Test Suite',
      price: 75,
      description: 'A test room to verify database functionality',
      status: 'available'
    });

    const savedRoom = await testRoom.save();
    console.log('✅ Test room created:', {
      id: savedRoom._id,
      number: savedRoom.number,
      type: savedRoom.type,
      price: savedRoom.price
    });

    // Test 4: Update the test room
    console.log('\n4️⃣ Updating test room...');
    const updatedRoom = await Room.findByIdAndUpdate(
      savedRoom._id, 
      { price: 85, description: 'Updated test room description' },
      { new: true }
    );
    console.log('✅ Room updated:', {
      id: updatedRoom._id,
      price: updatedRoom.price,
      description: updatedRoom.description
    });

    // Test 5: Delete the test room
    console.log('\n5️⃣ Cleaning up test room...');
    await Room.findByIdAndDelete(savedRoom._id);
    console.log('✅ Test room deleted');

    // Test 6: Final count
    console.log('\n6️⃣ Final room count...');
    const finalCount = await Room.countDocuments();
    console.log(`✅ Final count: ${finalCount} rooms`);

    console.log('\n🎉 Database testing completed successfully!');
    console.log('\n📊 Database Summary:');
    console.log('   - MongoDB connection ✅');
    console.log('   - Data retrieval ✅');
    console.log('   - Data creation ✅');
    console.log('   - Data updates ✅');
    console.log('   - Data deletion ✅');
    console.log('   - CRUD operations working perfectly ✅');

  } catch (error) {
    console.error('❌ Database test failed:', error.message);
  } finally {
    await mongoose.connection.close();
    console.log('🔐 Database connection closed');
    process.exit(0);
  }
}

testDatabase();
