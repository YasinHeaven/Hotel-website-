// Debug Frontend API Configuration
console.log('🔍 Frontend API Configuration Debug:');
console.log('Environment:', process.env.NODE_ENV);
console.log('REACT_APP_API_URL:', process.env.REACT_APP_API_URL);

// Test if the frontend can reach the backend
const testBackendConnection = async () => {
  const apiUrl = process.env.REACT_APP_API_URL || 'https://hotel-website-production-672b.up.railway.app/api';
  
  console.log('🧪 Testing backend connection...');
  console.log('API URL being used:', apiUrl);
  
  try {
    const response = await fetch(`${apiUrl}/rooms`);
    const data = await response.json();
    
    console.log('✅ Backend Response Status:', response.status);
    console.log('✅ Rooms found:', Array.isArray(data) ? data.length : 'Not an array');
    
    if (Array.isArray(data) && data.length > 0) {
      console.log('✅ First room:', data[0].number, '-', data[0].type);
    }
    
  } catch (error) {
    console.error('❌ Backend connection failed:', error.message);
  }
};

// Run the test
testBackendConnection();
