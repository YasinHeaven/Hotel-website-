// Test All API Endpoints After CORS Fix
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
        'Origin': FRONTEND_URL, // Without trailing slash
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

async function testAllEndpoints() {
  console.log('🔍 Testing All API Endpoints After CORS Fix\n');
  console.log(`Backend: ${BACKEND_URL}`);
  console.log(`Frontend Origin: ${FRONTEND_URL}\n`);

  const tests = [
    {
      name: 'API Health',
      url: `${BACKEND_URL}/api`,
      expectStatus: 200
    },
    {
      name: 'Get Rooms',
      url: `${BACKEND_URL}/api/rooms`,
      expectStatus: 200,
      checkData: true
    },
    {
      name: 'MongoDB Test',
      url: `${BACKEND_URL}/api/mongodb-test`,
      expectStatus: 200
    },
    {
      name: 'User Routes',
      url: `${BACKEND_URL}/api/users`,
      expectStatus: [200, 404] // Might not have this endpoint
    },
    {
      name: 'Auth Route',
      url: `${BACKEND_URL}/api/auth`,
      expectStatus: [200, 404] // Might not have GET
    },
    {
      name: 'Admin Route',
      url: `${BACKEND_URL}/api/admin`,
      expectStatus: [200, 401, 404]
    }
  ];

  let allPassed = true;

  for (const test of tests) {
    try {
      console.log(`🧪 ${test.name}...`);
      
      const result = await makeRequest(test.url);
      
      // Check CORS headers
      const corsOrigin = result.headers['access-control-allow-origin'];
      const corsCredentials = result.headers['access-control-allow-credentials'];
      
      console.log(`   Status: ${result.status}`);
      console.log(`   CORS Origin: ${corsOrigin || 'Not Set'}`);
      console.log(`   CORS Credentials: ${corsCredentials || 'Not Set'}`);
      
      // Check if status is expected
      const expectedStatuses = Array.isArray(test.expectStatus) ? test.expectStatus : [test.expectStatus];
      const statusOk = expectedStatuses.includes(result.status);
      
      if (statusOk) {
        console.log(`   ✅ Status OK`);
      } else {
        console.log(`   ❌ Unexpected status (expected: ${expectedStatuses.join(' or ')})`);
        allPassed = false;
      }
      
      // Check CORS
      if (corsOrigin === FRONTEND_URL) {
        console.log(`   ✅ CORS OK`);
      } else {
        console.log(`   ❌ CORS Issue: Expected '${FRONTEND_URL}', got '${corsOrigin}'`);
        allPassed = false;
      }
      
      // Check data if needed
      if (test.checkData && result.status === 200) {
        if (Array.isArray(result.data)) {
          console.log(`   ✅ Data: ${result.data.length} items`);
        } else {
          console.log(`   ⚠️  Data: Not an array`);
        }
      }
      
    } catch (error) {
      console.log(`   ❌ Network Error: ${error.message}`);
      allPassed = false;
    }
    console.log('');
  }

  console.log('📊 SUMMARY:');
  if (allPassed) {
    console.log('✅ All tests passed! Frontend should work now.');
  } else {
    console.log('❌ Some tests failed. Check the issues above.');
  }
  
  console.log('\n🌐 Next Steps:');
  console.log('1. Wait 2-3 minutes for Railway deployment');
  console.log('2. Clear browser cache');
  console.log('3. Test: https://yasinheavenstarhotel.com/rooms');
}

testAllEndpoints();
