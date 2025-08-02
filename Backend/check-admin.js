const mongoose = require('mongoose');
require('dotenv').config();
const Admin = require('./models/Admin');

mongoose.connect(process.env.MONGODB_URI)
.then(async () => {
  console.log('Connected to MongoDB');
  const admins = await Admin.find({});
  console.log('Admins in database:', admins.length);
  admins.forEach(admin => {
    console.log('Admin ID:', admin._id.toString());
    console.log('Email:', admin.email);
    console.log('Role:', admin.role);
    console.log('---');
  });
  process.exit(0);
})
.catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
