const mongoose = require('mongoose');
require('dotenv').config();

async function fixOrphanedBooking() {
  try {
    // Connect to database
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Update the orphaned booking to reference the Test user
    const bookingCollection = mongoose.connection.collection('bookings');
    const testUserId = new mongoose.Types.ObjectId('687f7b6257a46c233ab069b0'); // Test user
    
    const result = await bookingCollection.updateOne(
      { _id: new mongoose.Types.ObjectId('687df24028af4e51cd55ea3f') },
      { $set: { user: testUserId } }
    );
    
    console.log('📝 Update result:', result);
    
    // Verify the fix
    const fixedBooking = await bookingCollection.findOne({ 
      _id: new mongoose.Types.ObjectId('687df24028af4e51cd55ea3f') 
    });
    
    console.log('✅ Fixed booking user ID:', fixedBooking.user);
    console.log('📋 Full fixed booking:', JSON.stringify(fixedBooking, null, 2));

    await mongoose.disconnect();
    console.log('\n✅ Orphaned booking fixed!');
    
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

fixOrphanedBooking();
