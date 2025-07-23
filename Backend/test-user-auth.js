const axios = require('axios');

const testUserAuth = async () => {
  try {
    console.log('🧪 Testing User Authentication Endpoints...\n');

    // Test user registration
    console.log('1. Testing user registration...');
    const registerResponse = await axios.post('http://localhost:5000/api/users/register', {
      name: 'Test User',
      email: 'testuser@example.com',
      password: 'password123'
    });
    console.log('✅ Registration successful:', registerResponse.data.message);
    console.log('👤 User created:', registerResponse.data.user);
    
    // Test user login
    console.log('\n2. Testing user login...');
    const loginResponse = await axios.post('http://localhost:5000/api/users/login', {
      email: 'testuser@example.com',
      password: 'password123'
    });
    console.log('✅ Login successful:', loginResponse.data.message);
    console.log('🔑 Token received:', loginResponse.data.token ? 'YES' : 'NO');
    console.log('👤 User info:', loginResponse.data.user);

    console.log('\n🎉 All user authentication tests passed!');
    
  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
  }
};

testUserAuth();
