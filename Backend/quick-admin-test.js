const https = require('https');

// Quick test without authentication to see if endpoints exist
function testEndpoint(url) {
  return new Promise((resolve) => {
    const urlObj = new URL(url);
    const requestOptions = {
      hostname: urlObj.hostname,
      port: 443,
      path: urlObj.pathname,
      method: 'GET',
      headers: {
        'Origin': 'https://yasinheavenstarhotel.com',
        'Accept': 'application/json'
      }
    };

    const req = https.request(requestOptions, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        resolve({ status: res.statusCode, body });
      });
    });

    req.on('error', (error) => {
      resolve({ status: 'ERROR', error: error.message });
    });
    
    req.end();
  });
}

async function quickTest() {
  console.log('🧪 Quick Admin Endpoint Test (without auth)');
  console.log('Expected: 401 Unauthorized (means endpoint exists)\n');
  
  const endpoints = [
    'https://hotel-website-production-672b.up.railway.app/api/admin/rooms',
    'https://hotel-website-production-672b.up.railway.app/api/admin/users'
  ];
  
  for (const url of endpoints) {
    const result = await testEndpoint(url);
    console.log(`${url}`);
    console.log(`Status: ${result.status}`);
    if (result.status === 401) {
      console.log('✅ Endpoint exists (401 = needs auth)');
    } else if (result.status === 404) {
      console.log('❌ Endpoint not found');
    } else {
      console.log(`🔍 Status: ${result.status}`);
    }
    console.log('');
  }
}

quickTest();
