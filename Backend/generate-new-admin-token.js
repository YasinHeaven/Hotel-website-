const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const Admin = require('./models/Admin');

mongoose.connect(process.env.MONGODB_URI)
.then(async () => {
  console.log('Connected to MongoDB');
  const admin = await Admin.findOne({ email: 'yasinheavenstarhotel@gmail.com' });
  
  if (admin) {
    console.log('Admin found:', admin.email);
    console.log('Admin ID:', admin._id.toString());
    
    // Generate new token
    const token = jwt.sign(
      { 
        adminId: admin._id.toString(),
        email: admin.email,
        role: admin.role 
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    console.log('\n🔑 NEW ADMIN TOKEN:');
    console.log(token);
    console.log('\n💡 Copy this token and use it in your frontend localStorage as "adminToken"');
    
  } else {
    console.log('Admin not found!');
  }
  
  process.exit(0);
})
.catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
