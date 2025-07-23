// Test complete login flow
const http = require('http');

async function testCompleteLogin() {
  console.log('🧪 Testing Complete Login Flow...\n');

  // Test 1: Admin Login API
  console.log('1️⃣ Testing Admin Login API...');
  
  const postData = JSON.stringify({
    email: 'admin@yasinheavenstar.com',
    password: 'admin123'
  });

  const options = {
    hostname: 'localhost',
    port: 5000,
    path: '/api/admin/login',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(postData)
    }
  };

  return new Promise((resolve) => {
    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        try {
          const response = JSON.parse(body);
          
          if (res.statusCode === 200 && response.token) {
            console.log('✅ Login API works!');
            console.log('🎫 Token received:', response.token.substring(0, 20) + '...');
            console.log('👤 Admin info:', response.admin);
            console.log('\n🎉 Backend authentication is working perfectly!');
            
            console.log('\n🚀 Frontend Test Instructions:');
            console.log('1. Go to: http://localhost:3000');
            console.log('2. Click "Admin Sign In" button in header');
            console.log('3. Use credentials:');
            console.log('   📧 Email: admin@yasinheavenstar.com');
            console.log('   🔑 Password: admin123');
            console.log('4. Click Login - should redirect to admin dashboard');
            console.log('5. Check browser console for success messages');
            
          } else {
            console.log('❌ Login failed:', response.message);
          }
        } catch (error) {
          console.log('❌ Response error:', error.message);
        }
        resolve();
      });
    });

    req.on('error', (error) => {
      console.error('❌ Request failed:', error.message);
      resolve();
    });

    req.write(postData);
    req.end();
  });
}

testCompleteLogin();
