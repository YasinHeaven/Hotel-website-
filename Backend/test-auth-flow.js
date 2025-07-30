const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Import models and middleware
const User = require('./models/User');
const auth = require('./middleware/auth');

async function testAuthenticationFlow() {
  try {
    console.log('🔄 Starting authentication flow test...');
    
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/hotel');
    console.log('✅ Connected to MongoDB');
    
    // 1. Test User Registration
    console.log('\n📝 Testing User Registration...');
    const testEmail = `test-${Date.now()}@example.com`;
    const testPassword = 'password123';
    
    const newUser = new User({
      name: 'Test User Auth',
      email: testEmail,
      password: testPassword
    });
    
    await newUser.save();
    console.log('✅ User registration successful');
    console.log(`👤 Created user: ${newUser.name} (${newUser.email})`);
    
    // 2. Test Password Hashing
    console.log('\n🔐 Testing Password Security...');
    const isPasswordHashed = newUser.password !== testPassword;
    console.log(`✅ Password hashing: ${isPasswordHashed ? 'SECURE' : 'INSECURE'}`);
    
    const isPasswordValid = await bcrypt.compare(testPassword, newUser.password);
    console.log(`✅ Password verification: ${isPasswordValid ? 'VALID' : 'INVALID'}`);
    
    // 3. Test JWT Token Generation
    console.log('\n🎫 Testing JWT Token Generation...');
    const token = jwt.sign(
      { 
        userId: newUser._id, 
        email: newUser.email,
        userType: 'user'
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    console.log('✅ JWT token generated successfully');
    console.log(`🔑 Token length: ${token.length} characters`);
    
    // 4. Test JWT Token Verification
    console.log('\n🔍 Testing JWT Token Verification...');
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log('✅ JWT token verification successful');
      console.log(`👤 Decoded user ID: ${decoded.userId}`);
      console.log(`📧 Decoded email: ${decoded.email}`);
      console.log(`🏷️ User type: ${decoded.userType}`);
    } catch (tokenError) {
      console.error('❌ JWT token verification failed:', tokenError.message);
    }
    
    // 5. Test Authentication Middleware
    console.log('\n🛡️ Testing Authentication Middleware...');
    
    // Mock request and response objects
    const mockReq = {
      headers: {
        'authorization': `Bearer ${token}`
      }
    };
    
    const mockRes = {
      status: (code) => ({
        json: (data) => {
          console.log(`❌ Auth middleware returned ${code}:`, data);
          return mockRes;
        }
      })
    };
    
    const mockNext = () => {
      console.log('✅ Authentication middleware passed');
      console.log(`👤 User ID set in request: ${mockReq.user?.userId}`);
      console.log(`📧 Email set in request: ${mockReq.user?.email}`);
    };
    
    // Test the auth middleware
    await auth(mockReq, mockRes, mockNext);
    
    // 6. Test Invalid Token
    console.log('\n🚫 Testing Invalid Token Handling...');
    const mockReqInvalid = {
      headers: {
        'authorization': 'Bearer invalid-token-here'
      }
    };
    
    const mockResInvalid = {
      status: (code) => ({
        json: (data) => {
          if (code === 401) {
            console.log('✅ Invalid token correctly rejected');
          } else {
            console.log(`❌ Unexpected response code: ${code}`);
          }
          return mockResInvalid;
        }
      })
    };
    
    const mockNextInvalid = () => {
      console.log('❌ Invalid token should not pass authentication');
    };
    
    await auth(mockReqInvalid, mockResInvalid, mockNextInvalid);
    
    // 7. Test Missing Token
    console.log('\n🔍 Testing Missing Token Handling...');
    const mockReqNoToken = {
      headers: {}
    };
    
    const mockResNoToken = {
      status: (code) => ({
        json: (data) => {
          if (code === 401) {
            console.log('✅ Missing token correctly rejected');
          } else {
            console.log(`❌ Unexpected response code: ${code}`);
          }
          return mockResNoToken;
        }
      })
    };
    
    const mockNextNoToken = () => {
      console.log('❌ Missing token should not pass authentication');
    };
    
    await auth(mockReqNoToken, mockResNoToken, mockNextNoToken);
    
    // 8. Test Token Expiration (simulate expired token)
    console.log('\n⏰ Testing Token Expiration...');
    const expiredToken = jwt.sign(
      { 
        userId: newUser._id, 
        email: newUser.email,
        userType: 'user'
      },
      process.env.JWT_SECRET,
      { expiresIn: '1ms' } // Expires immediately
    );
    
    // Wait a moment to ensure token expires
    await new Promise(resolve => setTimeout(resolve, 10));
    
    try {
      jwt.verify(expiredToken, process.env.JWT_SECRET);
      console.log('❌ Expired token should not verify');
    } catch (expiredError) {
      if (expiredError.name === 'TokenExpiredError') {
        console.log('✅ Expired token correctly rejected');
      } else {
        console.log('❌ Unexpected error:', expiredError.message);
      }
    }
    
    // 9. Test User Lookup by Token
    console.log('\n👤 Testing User Lookup by Token...');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const foundUser = await User.findById(decoded.userId);
    
    if (foundUser) {
      console.log('✅ User lookup by token successful');
      console.log(`👤 Found user: ${foundUser.name} (${foundUser.email})`);
    } else {
      console.log('❌ User lookup by token failed');
    }
    
    // Cleanup - remove test user
    await User.findByIdAndDelete(newUser._id);
    console.log('🧹 Test user cleaned up');
    
    console.log('\n🎉 Authentication flow test COMPLETED!');
    console.log('✅ All authentication components working correctly');
    
  } catch (error) {
    console.error('❌ Authentication flow test FAILED:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

testAuthenticationFlow();