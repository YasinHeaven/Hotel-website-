require('dotenv').config();
const jwt = require('jsonwebtoken');

const token = jwt.sign({
  adminId: '688dbcf0566ea4ddc038d8e0',
  email: 'yasinheavenstarhotel@gmail.com',
  role: 'admin'
}, process.env.JWT_SECRET, { expiresIn: '30d' });

console.log('🔑 FRESH ADMIN TOKEN:');
console.log(token);
console.log('\n💡 Copy this token and replace your adminToken in localStorage');
console.log('\n🌐 Admin ID: 688dbcf0566ea4ddc038d8e0');
console.log('📧 Email: yasinheavenstarhotel@gmail.com');
console.log('📝 Valid for: 30 days');
