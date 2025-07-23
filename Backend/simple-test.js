const axios = require('axios');

async function simpleTest() {
  try {
    // Test 1: Basic server health
    console.log('1. Testing server health...');
    const healthResponse = await axios.get('http://localhost:5000');
    console.log('✅ Server is running:', healthResponse.data);

    // Test 2: Admin login
    console.log('\n2. Testing admin login...');
    const loginResponse = await axios.post('http://localhost:5000/api/admin/login', {
      email: 'admin@hotel.com',
      password: 'admin123'
    });
    console.log('✅ Admin login successful');
    const token = loginResponse.data.token;

    // Test 3: Fetch dashboard stats
    console.log('\n3. Testing dashboard stats...');
    const statsResponse = await axios.get('http://localhost:5000/api/admin/dashboard/stats', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    console.log('✅ Dashboard stats retrieved');
    console.log('Stats:', statsResponse.data.stats);

    // Test 4: Fetch bookings
    console.log('\n4. Testing bookings endpoint...');
    const bookingsResponse = await axios.get('http://localhost:5000/api/admin/bookings', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    console.log('✅ Bookings retrieved');
    console.log('Total bookings:', bookingsResponse.data.bookings?.length || bookingsResponse.data.pagination?.totalItems || 0);

    console.log('\n🎉 ALL BASIC TESTS PASSED!');
    console.log('\n📊 System is working properly!');
    console.log('- Backend server: ✅ Running');
    console.log('- Admin authentication: ✅ Working');
    console.log('- Dashboard API: ✅ Working');
    console.log('- Bookings API: ✅ Working');

  } catch (error) {
    console.error('\n❌ Test Failed:', error.response?.data?.message || error.message);
    if (error.response?.data) {
      console.error('Error Details:', error.response.data);
    }
  }
}

simpleTest();
