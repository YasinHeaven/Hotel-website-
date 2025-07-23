const jwt = require('jsonwebtoken');

module.exports = function(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  console.log('🔐 Auth middleware - Token received:', token ? 'Present' : 'Missing');
  console.log('🔑 JWT Secret being used:', process.env.JWT_SECRET ? 'Set' : 'Missing');
  
  if (!token) {
    console.log('❌ No token provided');
    return res.status(401).json({ message: 'No token, authorization denied' });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('✅ Token verified successfully:', decoded);
    // Support both user and admin tokens
    req.user = decoded;
    req.admin = decoded; // Keep for backward compatibility
    next();
  } catch (err) {
    console.log('❌ Token verification failed:', err.message);
    res.status(401).json({ message: 'Token is not valid' });
  }
};
