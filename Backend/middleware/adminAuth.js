const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

const adminAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    
    console.log('🔐 Admin Auth - Token received:', token ? 'Present' : 'Missing');
    
    if (!token) {
      console.log('❌ No admin token provided');
      return res.status(401).json({ 
        message: 'Admin access required - No token provided',
        success: false 
      });
    }
    
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('🔍 Decoded token:', decoded);
    
    // Check if this is an admin token (should have adminId or role)
    if (!decoded.adminId && !decoded.userId) {
      console.log('❌ Invalid token structure');
      return res.status(401).json({ 
        message: 'Invalid admin token',
        success: false 
      });
    }
    
    // Find admin in database
    const adminId = decoded.adminId || decoded.userId;
    const admin = await Admin.findById(adminId);
    
    if (!admin) {
      console.log('❌ Admin not found in database');
      return res.status(401).json({ 
        message: 'Admin not found',
        success: false 
      });
    }
    
    if (!admin.isActive) {
      console.log('❌ Admin account is inactive');
      return res.status(401).json({ 
        message: 'Admin account is inactive',
        success: false 
      });
    }
    
    // Update last login
    admin.lastLogin = new Date();
    await admin.save();
    
    // Attach admin info to request
    req.user = {
      userId: admin._id,
      adminId: admin._id,
      email: admin.email,
      name: admin.name,
      role: admin.role,
      isAdmin: true
    };
    
    console.log('✅ Admin authenticated:', admin.email);
    next();
    
  } catch (err) {
    console.error('❌ Admin auth error:', err);
    
    if (err.name === 'JsonWebTokenError') {
      return res.status(401).json({ 
        message: 'Invalid admin token',
        success: false 
      });
    }
    
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        message: 'Admin token expired',
        success: false 
      });
    }
    
    res.status(500).json({ 
      message: 'Admin authentication error',
      success: false 
    });
  }
};

module.exports = adminAuth;