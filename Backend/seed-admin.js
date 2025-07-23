require('dotenv').config();
const mongoose = require('mongoose');
const Admin = require('./models/Admin');

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/yasin_heaven_star_hotel');
    console.log('✅ Connected to MongoDB');
    
    // Create admin with your preferred credentials
    const existingAdmin = await Admin.findOne({ email: 'admin@hotel.com' });
    
    if (!existingAdmin) {
      const admin = new Admin({
        email: 'admin@hotel.com',
        password: 'admin123',
        name: 'Hotel Administrator'
      });
      
      await admin.save();
      console.log('✅ Admin user created: admin@hotel.com / admin123');
    } else {
      console.log('ℹ️ Admin user already exists');
    }
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

seedAdmin();
