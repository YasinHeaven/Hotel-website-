// Test MongoDB Atlas Connection on Production
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

async function testMongoDBConnection() {
  console.log('🔍 Testing MongoDB Atlas Connection on Production...\n');
  
  try {
    console.log('⏳ Waiting for deployment to complete...');
    await new Promise(resolve => setTimeout(resolve, 30000)); // Wait 30 seconds for deployment
    
    console.log('🧪 Testing MongoDB connection endpoint...');
    const result = await makeRequest(`${BACKEND_URL}/api/mongodb-test`);
    
    console.log(`📊 Status: ${result.status}\n`);
    
    if (result.status === 200) {
      const data = result.data;
      console.log('✅ MongoDB Atlas Connection Details:');
      console.log(`   Status: ${data.status}`);
      console.log(`   Database: ${data.database}`);
      console.log(`   Host: ${data.host}`);
      console.log(`   Connection State: ${data.connectionState} (1 = connected)`);
      console.log('\n📈 Collection Counts:');
      console.log(`   Rooms: ${data.collections.rooms}`);
      console.log(`   Users: ${data.collections.users}`);
      console.log(`   Bookings: ${data.collections.bookings}`);
      console.log('\n🖥️  Server Info:');
      console.log(`   MongoDB Version: ${data.serverInfo.version}`);
      console.log(`   Uptime: ${data.serverInfo.uptime}`);
      console.log(`   Host: ${data.serverInfo.host}`);
      console.log('\n💾 Database Stats:');
      console.log(`   Collections: ${data.dbStats.collections}`);
      console.log(`   Data Size: ${data.dbStats.dataSize}`);
      console.log(`   Index Size: ${data.dbStats.indexSize}`);
    } else {
      console.log('❌ Connection Test Failed:');
      console.log(JSON.stringify(result.data, null, 2));
    }
    
  } catch (error) {
    console.error('❌ Test Error:', error.message);
  }
  
  console.log('\n🔗 Test URLs:');
  console.log(`   MongoDB Test: ${BACKEND_URL}/api/mongodb-test`);
  console.log(`   API Status: ${BACKEND_URL}/api`);
  console.log(`   Rooms: ${BACKEND_URL}/api/rooms`);
}

testMongoDBConnection();
