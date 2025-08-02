// Test Frontend-Backend Connection
const https = require('https');

const BACKEND_URL = 'https://hotel-website-production-672b.up.railway.app';
const FRONTEND_URL = 'https://yasinheavenstarhotel.com';

function makeRequest(url, headers = {}) {
  return new Promise((resolve, reject) => {
    const options = {
      headers: {
        'Origin': FRONTEND_URL,
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        ...headers
      }
    };
    
    const req = https.get(url, options, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(body);
          resolve({ 
            status: res.statusCode, 
            data: parsed, 
            headers: res.headers 
          });
        } catch {
          resolve({ 
            status: res.statusCode, 
            data: body, 
            headers: res.headers 
          });
        }
      });
    });
    req.on('error', reject);
  });
}

async function testFrontendBackendConnection() {
  console.log('🔍 Testing Frontend-Backend Connection...\n');
  
  const tests = [
    { 
      name: 'Rooms API (as Frontend)', 
      url: `${BACKEND_URL}/api/rooms`,
      checkCORS: true
    },
    { 
      name: 'Auth Login Endpoint', 
      url: `${BACKEND_URL}/api/auth/login`,
      method: 'OPTIONS'
    }
  ];

  for (const test of tests) {
    try {
      console.log(`🧪 ${test.name}...`);
      const result = await makeRequest(test.url);
      
      console.log(`   Status: ${result.status}`);
      
      if (test.checkCORS) {
        console.log(`   CORS Headers:`);
        console.log(`     Access-Control-Allow-Origin: ${result.headers['access-control-allow-origin'] || 'Not Set'}`);
        console.log(`     Access-Control-Allow-Credentials: ${result.headers['access-control-allow-credentials'] || 'Not Set'}`);
      }
      
      if (result.status === 200 && Array.isArray(result.data)) {
        console.log(`   ✅ Data: ${result.data.length} items`);
        if (result.data.length > 0) {
          console.log(`   📋 Sample: ${JSON.stringify(result.data[0], null, 2).substring(0, 200)}...`);
        }
      } else if (result.status !== 200) {
        console.log(`   ❌ Error Response: ${JSON.stringify(result.data).substring(0, 200)}`);
      }
      
    } catch (error) {
      console.log(`   ❌ Network Error: ${error.message}`);
    }
    console.log('');
  }
  
  // Test direct API access
  console.log('🌐 Testing Direct API Access:');
  console.log(`   Open: ${BACKEND_URL}/api/rooms`);
  console.log(`   Open: ${BACKEND_URL}/api/mongodb-test`);
  console.log(`   Frontend: ${FRONTEND_URL}/rooms`);
}

testFrontendBackendConnection();
