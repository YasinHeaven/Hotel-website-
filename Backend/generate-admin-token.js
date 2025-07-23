const jwt = require('jsonwebtoken');
require('dotenv').config();

// Generate admin token for testing using the correct JWT_SECRET
const token = jwt.sign(
  { id: 'admin-id', email: 'admin@hotel.com', role: 'admin' }, 
  process.env.JWT_SECRET, // Use the actual secret from .env
  { expiresIn: '7d' }
);

console.log('🔑 Admin Token for testing (using correct JWT_SECRET):');
console.log(token);
console.log('\n📋 To use this token:');
console.log('1. Open browser dev tools (F12)');
console.log('2. Go to Application/Storage > Local Storage');
console.log('3. Add key: adminToken');
console.log('4. Add value: ' + token);
console.log('5. Refresh the page');
console.log('\n🔐 JWT Secret being used:', process.env.JWT_SECRET);
