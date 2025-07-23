const mongoose = require('mongoose');
require('dotenv').config();

async function checkUserExists() {
  try {
    // Connect to database
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Check if the user exists
    const userCollection = mongoose.connection.collection('users');
    const user = await userCollection.findOne({ _id: new mongoose.Types.ObjectId('687cacdb2783ab66d46d9296') });
    
    console.log('\n🔍 USER LOOKUP RESULT:');
    console.log('User found:', !!user);
    if (user) {
      console.log('User details:', JSON.stringify(user, null, 2));
    } else {
      console.log('❌ User with ID 687cacdb2783ab66d46d9296 does NOT exist in the database');
      
      // Let's check all users to see what IDs we have
      const allUsers = await userCollection.find({}).toArray();
      console.log('\n📋 ALL USERS IN DATABASE:');
      allUsers.forEach((user, index) => {
        console.log(`${index + 1}. ID: ${user._id}, Name: ${user.name}, Email: ${user.email}`);
      });
    }

    await mongoose.disconnect();
    console.log('\n✅ Test completed');
    
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

checkUserExists();
