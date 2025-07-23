// Test admin login API
const http = require('http');

function testAdminLogin() {
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

  console.log('🧪 Testing Admin Login API...');
  console.log('📧 Email: admin@yasinheavenstar.com');
  console.log('🔑 Password: admin123');

  const req = http.request(options, (res) => {
    let body = '';
    
    console.log(`\n📊 Response Status: ${res.statusCode}`);
    
    res.on('data', (chunk) => {
      body += chunk;
    });

    res.on('end', () => {
      try {
        const response = JSON.parse(body);
        
        if (res.statusCode === 200) {
          console.log('✅ Login Successful!');
          console.log('🎫 Token received:', response.token ? 'Yes' : 'No');
          console.log('👤 Admin info:', response.admin);
          console.log('\n🎉 API Authentication is working perfectly!');
        } else {
          console.log('❌ Login Failed!');
          console.log('📝 Error:', response.message);
        }
      } catch (error) {
        console.log('❌ Response parsing error:', error.message);
        console.log('📝 Raw response:', body);
      }
    });
  });

  req.on('error', (error) => {
    console.error('❌ Request failed:', error.message);
    
    if (error.code === 'ECONNREFUSED') {
      console.log('💡 Make sure your backend server is running on port 5000');
      console.log('   Run: cd Backend && node server.js');
    }
  });

  req.write(postData);
  req.end();
}

testAdminLogin();
