require('dotenv').config();
const mongoose = require('mongoose');
const Admin = require('./models/Admin');

async function createAdmin() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/yasin_heaven_star_hotel');
    console.log('✅ Connected to MongoDB');
    
    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email: 'admin@yasinheavenstar.com' });
    
    if (existingAdmin) {
      console.log('ℹ️ Admin already exists');
      console.log('Email: admin@yasinheavenstar.com');
      console.log('Password: admin123 (default)');
      process.exit(0);
    }
    
    // Create new admin
    const admin = new Admin({
      email: 'admin@yasinheavenstar.com',
      password: 'admin123', // Will be hashed by the model's pre-save hook
      name: 'Hotel Administrator',
      role: 'admin',
      isActive: true
    });
    
    await admin.save();
    
    console.log('✅ Admin created successfully!');
    console.log('Email: admin@yasinheavenstar.com');
    console.log('Password: admin123');
    
  } catch (error) {
    console.error('❌ Error creating admin:', error);
  } finally {
    await mongoose.connection.close();
    process.exit(0);
  }
}

createAdmin();