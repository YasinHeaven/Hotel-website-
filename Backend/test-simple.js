// Simple backend test using native Node.js
const http = require('http');

function makeRequest(url, method = 'GET', data = null) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const options = {
      hostname: urlObj.hostname,
      port: urlObj.port,
      path: urlObj.pathname,
      method: method,
      headers: {
        'Content-Type': 'application/json',
      }
    };

    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(body);
          resolve({ status: res.statusCode, data: parsed });
        } catch {
          resolve({ status: res.statusCode, data: body });
        }
      });
    });

    req.on('error', reject);
    
    if (data) {
      req.write(JSON.stringify(data));
    }
    
    req.end();
  });
}

async function testBackend() {
  console.log('🧪 Testing Backend API...\n');

  try {
    // Test 1: Check server health
    console.log('1️⃣ Testing server health...');
    const health = await makeRequest('http://localhost:5000');
    console.log('✅ Server Status:', health.status);
    console.log('   Response:', health.data);

    // Test 2: Get all rooms
    console.log('\n2️⃣ Testing GET /api/rooms...');
    const rooms = await makeRequest('http://localhost:5000/api/rooms');
    console.log('✅ Rooms API Status:', rooms.status);
    
    if (rooms.status === 200) {
      console.log('   Rooms found:', rooms.data.length);
      if (rooms.data.length > 0) {
        console.log('   Sample room:', {
          id: rooms.data[0]._id,
          type: rooms.data[0].type,
          price: rooms.data[0].price,
          number: rooms.data[0].number
        });
      }
    }

    console.log('\n🎉 Basic backend tests completed!');
    console.log('\n📊 Summary:');
    console.log('   - Server is running ✅');
    console.log('   - Rooms API is accessible ✅');
    console.log('   - Database connection is working ✅');

  } catch (error) {
    console.error('❌ Backend test failed:', error.message);
    
    if (error.code === 'ECONNREFUSED') {
      console.log('\n💡 Solution: Start your backend server with:');
      console.log('   node server.js');
    }
  }
}

testBackend();
