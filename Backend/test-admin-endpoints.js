// Test Admin Room and User Management APIs
const https = require('https');

const BACKEND_URL = 'https://hotel-website-production-672b.up.railway.app';
const FRONTEND_URL = 'https://yasinheavenstarhotel.com';

// You'll need to get this token from your admin login
const ADMIN_TOKEN = 'your-admin-token-here'; // Replace with actual token

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
        'Authorization': `Bearer ${ADMIN_TOKEN}`,
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

    req.on('error', reject);

    if (options.body) {
      req.write(JSON.stringify(options.body));
    }
    
    req.end();
  });
}

async function testAdminEndpoints() {
  console.log('🔍 Testing Admin Room & User Management APIs\n');
  console.log(`Backend: ${BACKEND_URL}`);
  console.log(`Admin Token: ${ADMIN_TOKEN ? 'Provided' : 'MISSING - Please add your admin token!'}\n`);

  if (!ADMIN_TOKEN || ADMIN_TOKEN === 'your-admin-token-here') {
    console.log('❌ Please update ADMIN_TOKEN with your actual admin token');
    console.log('💡 Get your token by logging into admin panel and checking localStorage');
    return;
  }

  const tests = [
    {
      name: 'Get All Rooms (Admin)',
      url: `${BACKEND_URL}/api/admin/rooms`,
      expectStatus: 200
    },
    {
      name: 'Get All Users (Admin)',
      url: `${BACKEND_URL}/api/admin/users`,
      expectStatus: 200
    },
    {
      name: 'Get Room Stats (Admin)',
      url: `${BACKEND_URL}/api/admin/rooms/stats`,
      expectStatus: 200
    },
    {
      name: 'Get User Stats (Admin)',
      url: `${BACKEND_URL}/api/admin/users/stats`,
      expectStatus: 200
    },
    {
      name: 'Create Test Room (Admin)',
      url: `${BACKEND_URL}/api/admin/rooms`,
      method: 'POST',
      body: {
        number: '999',
        type: 'Test Room',
        price: 100,
        status: 'available',
        description: 'Test room created by admin'
      },
      expectStatus: 201
    }
  ];

  let allPassed = true;

  for (const test of tests) {
    try {
      console.log(`🧪 ${test.name}...`);
      
      const result = await makeRequest(test.url, {
        method: test.method || 'GET',
        body: test.body
      });
      
      console.log(`   Status: ${result.status}`);
      
      const expectedStatuses = Array.isArray(test.expectStatus) ? test.expectStatus : [test.expectStatus];
      const statusOk = expectedStatuses.includes(result.status);
      
      if (statusOk) {
        console.log(`   ✅ Status OK`);
        if (result.data && typeof result.data === 'object') {
          if (Array.isArray(result.data)) {
            console.log(`   📊 Data: ${result.data.length} items`);
          } else if (result.data.message) {
            console.log(`   💬 Message: ${result.data.message}`);
          }
        }
      } else {
        console.log(`   ❌ Unexpected status (expected: ${expectedStatuses.join(' or ')})`);
        if (result.data && result.data.message) {
          console.log(`   💬 Error: ${result.data.message}`);
        }
        allPassed = false;
      }
      
    } catch (error) {
      console.log(`   ❌ Network Error: ${error.message}`);
      allPassed = false;
    }
    console.log('');
  }

  console.log('📊 SUMMARY:');
  if (allPassed) {
    console.log('✅ All admin endpoints working! The admin panel should now work properly.');
  } else {
    console.log('❌ Some endpoints failed. Check the issues above.');
  }
  
  console.log('\n🔧 How to get your admin token:');
  console.log('1. Open: https://yasinheavenstarhotel.com/admin/login');
  console.log('2. Login with admin credentials');
  console.log('3. Open browser Developer Tools (F12)');
  console.log('4. Go to Application/Storage tab');
  console.log('5. Check localStorage for "adminToken"');
  console.log('6. Copy the token value and update this script');
}

testAdminEndpoints();
