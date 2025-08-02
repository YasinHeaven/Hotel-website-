require('dotenv').config();
const mongoose = require('mongoose');
const Admin = require('./models/Admin');

async function createAdmin() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');
    
    // Remove all existing admins
    await Admin.deleteMany({});
    console.log('🗑️ All existing admins deleted.');

    // Create new admin
    const adminEmail = 'yasinheavenstarhotel@gmail.com';
    const adminPassword = 'YHSHotel@2025!'; // Secure password, change as needed
    const admin = new Admin({
      email: adminEmail,
      password: adminPassword, // Will be hashed by the model's pre-save hook
      name: 'Hotel Administrator',
      role: 'admin',
      isActive: true
    });

    await admin.save();

    console.log('✅ Admin created successfully!');
    console.log('Email:', adminEmail);
    
  } catch (error) {
    console.error('❌ Error creating admin:', error);
  } finally {
    await mongoose.connection.close();
    process.exit(0);
  }
}

createAdmin();