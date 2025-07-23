const http = require('http');

const testToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImFkbWluLWlkIiwiZW1haWwiOiJhZG1pbkBob3RlbC5jb20iLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3NTMwODU1MDAsImV4cCI6MTc1MzY5MDMwMH0.CUPWq4fypcmnwX9NluwCF93NhCR9JotGNfcKucRhUjc';

const options = {
  hostname: 'localhost',
  port: 5000,
  path: '/api/admin/dashboard/stats',
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${testToken}`
  }
};

console.log('🧪 Testing dashboard API with admin token...');

const req = http.request(options, (res) => {
  let data = '';
  
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    console.log('📊 Status Code:', res.statusCode);
    console.log('📝 Response Headers:', res.headers);
    console.log('📋 Response Data:', data);
    
    if (res.statusCode === 200) {
      console.log('✅ API is working correctly!');
    } else {
      console.log('❌ API returned error status');
    }
  });
});

req.on('error', (err) => {
  console.error('❌ Request error:', err.message);
});

req.end();
