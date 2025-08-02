// Simple test to register a user and verify authentication
console.log('🧪 Testing Authentication Flow...\n');

const FRONTEND_URL = process.env.NODE_ENV === 'production' 
  ? 'https://yasinheavenstarhotel.com'
  : 'http://localhost:3000';

// Test 1: Create a user account through the frontend
console.log(`1. Visit ${FRONTEND_URL}/signup`);
console.log('2. Fill the form with:');
console.log('   - Name: Test User');
console.log('   - Email: test@example.com'); 
console.log('   - Password: password123');
console.log('   - Confirm Password: password123');
console.log('3. Click "Create Account"');
console.log('4. Check if you get redirected and see welcome message in header\n');

// Test 2: Login with the account
console.log(`5. Visit ${FRONTEND_URL}/login`);
console.log('6. Fill the form with:');
console.log('   - Email: test@example.com');
console.log('   - Password: password123');
console.log('7. Click "Sign In"');
console.log('8. Check if you get redirected and see welcome message in header\n');

// Test 3: Try booking page 
console.log(`9. Visit ${FRONTEND_URL}/booking`);
console.log('10. Should see your bookings page if logged in\n');

console.log('⚠️  If any step fails, check the browser console for errors');
console.log('⚠️  Make sure both frontend (3000) and backend (5000) are running');
