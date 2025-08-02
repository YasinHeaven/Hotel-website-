// Debug Production API Issues
const https = require('https');

const BACKEND_URL = 'https://hotel-website-production-672b.up.railway.app';

function makeRequest(url) {
  return new Promise((resolve, reject) => {
    const req = https.get(url, (res) => {
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
  });
}

async function debugAPI() {
  console.log('🔍 Debugging Production API Issues...\n');
  
  const tests = [
    { name: 'MongoDB Connection Test', url: `${BACKEND_URL}/api/mongodb-test` },
    { name: 'Get All Rooms', url: `${BACKEND_URL}/api/rooms` },
    { name: 'API Status', url: `${BACKEND_URL}/api` }
  ];

  for (const test of tests) {
    try {
      console.log(`🧪 ${test.name}...`);
      const result = await makeRequest(test.url);
      
      console.log(`   Status: ${result.status}`);
      
      if (result.status === 200) {
        if (test.name === 'MongoDB Connection Test') {
          console.log(`   ✅ Database: ${result.data.database}`);
          console.log(`   ✅ Host: ${result.data.host}`);
          console.log(`   ✅ Connection State: ${result.data.connectionState}`);
          console.log(`   📊 Collections:`);
          console.log(`      - Rooms: ${result.data.collections.rooms}`);
          console.log(`      - Users: ${result.data.collections.users}`);
          console.log(`      - Admins: ${result.data.collections.admins}`);
        } else if (test.name === 'Get All Rooms') {
          if (Array.isArray(result.data)) {
            console.log(`   ✅ Rooms Found: ${result.data.length}`);
            if (result.data.length > 0) {
              console.log(`   📋 First Room: ${result.data[0].number} - ${result.data[0].type}`);
            }
          } else {
            console.log(`   ⚠️  Response: ${JSON.stringify(result.data)}`);
          }
        }
      } else {
        console.log(`   ❌ Error: ${JSON.stringify(result.data)}`);
      }
      
    } catch (error) {
      console.log(`   ❌ Network Error: ${error.message}`);
    }
    console.log('');
  }
  
  console.log('🔗 Direct Test URLs:');
  console.log(`   MongoDB Test: ${BACKEND_URL}/api/mongodb-test`);
  console.log(`   Rooms API: ${BACKEND_URL}/api/rooms`);
  console.log(`   Frontend: https://yasinheavenstarhotel.com/rooms`);
}

debugAPI();
