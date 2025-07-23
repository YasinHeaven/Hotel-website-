const mongoose = require('mongoose');
const axios = require('axios');
require('dotenv').config();

// Connect to database
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/yasin_heaven_star_hotel');

const testAdminAuth = async () => {
  try {
    console.log('🔧 Setting up admin authentication...');
    
    // First, try to register an admin
    console.log('📝 Attempting to register admin...');
    try {
      const registerResponse = await axios.post('http://localhost:5000/api/admin/register', {
        email: 'admin@hotel.com',
        password: 'admin123',
        name: 'Hotel Administrator'
      });
      console.log('✅ Admin registered:', registerResponse.data);
    } catch (regError) {
      console.log('ℹ️ Admin registration response:', regError.response?.data?.message || 'Registration attempt made');
    }
    
    // Then, try to login
    console.log('🔐 Attempting admin login...');
    const loginResponse = await axios.post('http://localhost:5000/api/admin/login', {
      email: 'admin@hotel.com',
      password: 'admin123'
    });
    
    console.log('✅ Login successful!');
    console.log('🎫 Token:', loginResponse.data.token);
    console.log('👤 Admin info:', loginResponse.data.admin);
    
    // Test the dashboard API with this token
    console.log('\n🧪 Testing dashboard API with token...');
    const dashboardResponse = await axios.get('http://localhost:5000/api/admin/dashboard/stats', {
      headers: {
        'Authorization': `Bearer ${loginResponse.data.token}`
      }
    });
    
    console.log('✅ Dashboard API works!');
    console.log('📊 Stats:', dashboardResponse.data.stats);
    
    console.log('\n🎯 SOLUTION: Use this token in browser localStorage:');
    console.log('Key: adminToken');
    console.log('Value:', loginResponse.data.token);
    
  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
  } finally {
    process.exit(0);
  }
};

testAdminAuth();
