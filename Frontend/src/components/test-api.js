// Quick test to verify backend API
const apiUrl = 'https://hotel-website-production-672b.up.railway.app';

console.log('🔍 Testing Backend API...');

// Test 1: Basic API connection
fetch(`${apiUrl}/api`)
  .then(response => response.text())
  .then(data => {
    console.log('✅ Basic API:', data);
  })
  .catch(error => {
    console.error('❌ Basic API failed:', error);
  });

// Test 2: Reviews endpoint (public)
fetch(`${apiUrl}/api/reviews`)
  .then(response => response.json())
  .then(data => {
    console.log('✅ Reviews API:', data);
  })
  .catch(error => {
    console.error('❌ Reviews API failed:', error);
  });

// Test 3: CORS test
console.log('Testing CORS from:', window.location.origin);
