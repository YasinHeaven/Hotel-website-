// Complete system test
const http = require('http');

console.log('🧪 Testing Complete Hotel System...\n');

// Test 1: Backend Health
function testBackend() {
  return new Promise((resolve) => {
    const req = http.request('http://localhost:5000', (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        console.log('✅ Backend Status:', res.statusCode === 200 ? 'Running' : 'Error');
        resolve(res.statusCode === 200);
      });
    });
    req.on('error', () => {
      console.log('❌ Backend: Not running');
      resolve(false);
    });
    req.end();
  });
}

// Test 2: Frontend Health
function testFrontend() {
  return new Promise((resolve) => {
    const req = http.request('http://localhost:3000', (res) => {
      console.log('✅ Frontend Status:', res.statusCode === 200 ? 'Running' : 'Error');
      resolve(res.statusCode === 200);
    });
    req.on('error', () => {
      console.log('❌ Frontend: Not running');
      resolve(false);
    });
    req.end();
  });
}

// Test 3: Admin Login API
function testAdminLogin() {
  return new Promise((resolve) => {
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

    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        if (res.statusCode === 200) {
          console.log('✅ Admin Login API: Working');
          resolve(true);
        } else {
          console.log('❌ Admin Login API: Failed');
          resolve(false);
        }
      });
    });

    req.on('error', () => {
      console.log('❌ Admin Login API: Error');
      resolve(false);
    });

    req.write(postData);
    req.end();
  });
}

async function runTests() {
  const backendOk = await testBackend();
  const frontendOk = await testFrontend();
  const loginOk = await testAdminLogin();

  console.log('\n📊 System Status Summary:');
  console.log('🖥️  Backend Server:', backendOk ? '✅ Running' : '❌ Down');
  console.log('🌐 Frontend App:', frontendOk ? '✅ Running' : '❌ Down');
  console.log('🔐 Admin Login:', loginOk ? '✅ Working' : '❌ Failed');

  if (backendOk && frontendOk && loginOk) {
    console.log('\n🎉 All systems are working perfectly!');
    console.log('\n🚀 Ready to test login:');
    console.log('   1. Open: http://localhost:3000/admin/login');
    console.log('   2. Email: admin@yasinheavenstar.com');
    console.log('   3. Password: admin123');
    console.log('   4. Click Login and check browser console!');
  } else {
    console.log('\n⚠️  Some systems need attention. Check the status above.');
  }
}

runTests();
