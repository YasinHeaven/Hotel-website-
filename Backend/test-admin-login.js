const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

mongoose.connect('mongodb://localhost:27017/hotel');

const Admin = require('./models/Admin');

async function createAdminAndGetToken() {
  try {
    // Create a test admin
    const admin = new Admin({
      email: 'admin@test.com',
      password: 'admin123',
      name: 'Test Admin',
      role: 'admin'
    });
    
    await admin.save();
    console.log('Admin created:', admin._id);

    // Generate token
    const token = jwt.sign(
      { id: admin._id, email: admin.email, role: admin.role }, 
      process.env.JWT_SECRET || 'fallback-secret', 
      { expiresIn: '7d' }
    );
    
    console.log('Admin Token:', token);

    // Test the API with the token
    const response = await fetch('http://localhost:5000/api/admin/bookings', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    
    console.log('API Response status:', response.status);
    
    if (response.ok) {
      const data = await response.json();
      console.log('Bookings found:', data.bookings.length);
      console.log('First booking:', data.bookings[0]);
    } else {
      const errorText = await response.text();
      console.log('Error:', errorText);
    }

  } catch (err) {
    console.error('Error:', err);
  } finally {
    mongoose.connection.close();
  }
}

createAdminAndGetToken();
