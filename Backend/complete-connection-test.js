// Complete Frontend-Backend Connection Test
const https = require('https');

const BACKEND_URL = 'https://hotel-website-production-672b.up.railway.app';
const FRONTEND_URL = 'https://yasinheavenstarhotel.com';

function makeRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const requestOptions = {
      hostname: urlObj.hostname,
      port: 443,
      path: urlObj.pathname + urlObj.search,
      method: options.method || 'GET',
      headers: {
        'Origin': FRONTEND_URL,
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        ...options.headers
      }
    };

    const req = https.request(requestOptions, (res) => {
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

    req.on('error', (error) => {
      reject(error);
    });

    if (options.body) {
      req.write(JSON.stringify(options.body));
    }
    
    req.end();
  });
}

async function runCompleteTest() {
  console.log('🔍 Complete Frontend-Backend Connection Test\n');
  console.log(`Backend URL: ${BACKEND_URL}`);
  console.log(`Frontend URL: ${FRONTEND_URL}\n`);

  const tests = [
    {
      name: 'Backend Health Check',
      url: `${BACKEND_URL}/api`,
      description: 'Basic API endpoint'
    },
    {
      name: 'MongoDB Connection Test',
      url: `${BACKEND_URL}/api/mongodb-test`,
      description: 'Database connection status'
    },
    {
      name: 'Get All Rooms',
      url: `${BACKEND_URL}/api/rooms`,
      description: 'Rooms data for frontend'
    },
    {
      name: 'CORS Preflight Test',
      url: `${BACKEND_URL}/api/rooms`,
      method: 'OPTIONS',
      description: 'CORS preflight request'
    },
    {
      name: 'Auth Login Endpoint',
      url: `${BACKEND_URL}/api/auth/login`,
      method: 'POST',
      body: { email: 'test@test.com', password: 'test' },
      description: 'Login endpoint accessibility'
    }
  ];

  for (const test of tests) {
    try {
      console.log(`🧪 ${test.name}...`);
      console.log(`   ${test.description}`);
      
      const result = await makeRequest(test.url, {
        method: test.method,
        body: test.body
      });
      
      console.log(`   Status: ${result.status}`);
      
      // Check CORS headers
      const corsOrigin = result.headers['access-control-allow-origin'];
      const corsCredentials = result.headers['access-control-allow-credentials'];
      
      if (corsOrigin) {
        console.log(`   CORS Origin: ${corsOrigin}`);
      }
      if (corsCredentials) {
        console.log(`   CORS Credentials: ${corsCredentials}`);
      }
      
      // Handle different response types
      if (result.status === 200) {
        if (test.name === 'Get All Rooms' && Array.isArray(result.data)) {
          console.log(`   ✅ Rooms Found: ${result.data.length}`);
          if (result.data.length > 0) {
            console.log(`   📋 First Room: ${result.data[0].number} - ${result.data[0].type}`);
          }
        } else if (test.name === 'MongoDB Connection Test') {
          console.log(`   ✅ Database: ${result.data.database}`);
          console.log(`   ✅ Collections: Rooms=${result.data.collections?.rooms || 0}`);
        } else {
          console.log(`   ✅ Response: ${typeof result.data === 'object' ? 'JSON' : 'Text'}`);
        }
      } else if (result.status === 404) {
        console.log(`   ⚠️  Endpoint not found`);
      } else if (result.status === 401) {
        console.log(`   🔒 Authentication required (expected for login test)`);
      } else if (result.status === 400) {
        console.log(`   ⚠️  Bad request (expected for login test)`);
      } else {
        console.log(`   ❌ Unexpected status`);
      }
      
    } catch (error) {
      console.log(`   ❌ Network Error: ${error.message}`);
    }
    console.log('');
  }

  console.log('🌐 Direct Test URLs:');
  console.log(`   Backend API: ${BACKEND_URL}/api`);
  console.log(`   Rooms API: ${BACKEND_URL}/api/rooms`);
  console.log(`   MongoDB Test: ${BACKEND_URL}/api/mongodb-test`);
  console.log(`   Frontend: ${FRONTEND_URL}/rooms`);
  
  console.log('\n💡 If rooms still don\'t load on frontend:');
  console.log('   1. Clear browser cache');
  console.log('   2. Check browser developer console for errors');
  console.log('   3. Verify CORS headers above');
}

runCompleteTest();
