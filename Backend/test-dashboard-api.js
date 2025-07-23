const jwt = require('jsonwebtoken');

// Create a test admin token
const testAdminToken = jwt.sign(
  { id: 'test-admin-id', email: 'admin@hotel.com', role: 'admin' },
  process.env.JWT_SECRET || 'your_super_secret_jwt_key_here_change_this_in_production',
  { expiresIn: '7d' }
);

console.log('Test Admin Token:', testAdminToken);

// Test the dashboard API
async function testDashboardAPI() {
  try {
    const response = await fetch('http://localhost:5000/api/admin/dashboard/stats', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${testAdminToken}`
      }
    });
    
    console.log('Response status:', response.status);
    
    if (response.ok) {
      const data = await response.json();
      console.log('Dashboard data:', JSON.stringify(data, null, 2));
    } else {
      const errorText = await response.text();
      console.log('Error response:', errorText);
    }
  } catch (err) {
    console.error('Request error:', err.message);
  }
}

testDashboardAPI();
