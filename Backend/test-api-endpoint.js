const axios = require('axios');
const jwt = require('jsonwebtoken');
require('dotenv').config();

async function testBookingAPIEndpoint() {
  try {
    console.log('🔄 Testing booking API endpoint...');
    
    // Generate a test JWT token
    const token = jwt.sign(
      { userId: '687ca8c22783ab66d46d927e', email: 'muhammadhaiderali2710@gmail.com' }, // Use existing user ID
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    console.log('🔐 Generated JWT token');
    
    // Test booking data
    const bookingData = {
      room: '687c93099fb73c8a114a0bba', // Use existing room ID
      checkIn: '2025-07-30',
      checkOut: '2025-08-01',
      guests: 1,
      customerInfo: {
        name: 'API Test User',
        email: 'apitest@example.com',
        phone: '+1234567890',
        specialRequests: 'API endpoint test booking'
      }
    };
    
    console.log('📝 Sending booking request...');
    console.log('Request data:', JSON.stringify(bookingData, null, 2));
    
    // Make API request
    const response = await axios.post('http://localhost:5000/api/bookings', bookingData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('✅ API request successful!');
    console.log('Response status:', response.status);
    console.log('Response data:', JSON.stringify(response.data, null, 2));
    
  } catch (error) {
    console.error('❌ API request failed:');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    } else {
      console.error('Error:', error.message);
    }
  }
}

testBookingAPIEndpoint();