require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, curl, etc.)
    if (!origin) return callback(null, true);
    
    const allowedOrigins = process.env.NODE_ENV === 'production' 
      ? ['https://yasinheavenstarhotel.com'] 
      : ['http://localhost:3000', 'http://127.0.0.1:3000'];
    
    // Remove trailing slash from origin for comparison
    const normalizedOrigin = origin.replace(/\/$/, '');
    const normalizedAllowed = allowedOrigins.map(url => url.replace(/\/$/, ''));
    
    if (normalizedAllowed.includes(normalizedOrigin)) {
      callback(null, true);
    } else {
      console.log(`CORS blocked origin: ${origin} (normalized: ${normalizedOrigin})`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Origin', 'X-Requested-With', 'Accept'],
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json());

// Serve static files from React build in production (if build folder exists)
if (process.env.NODE_ENV === 'production' && process.env.SERVE_STATIC === 'true') {
  const buildPath = process.env.BUILD_PATH || path.join(__dirname, 'build');
  app.use(express.static(buildPath));
}

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
.then(() => {
  console.log('✅ MongoDB connected successfully');
  console.log('📍 Database:', mongoose.connection.db.databaseName);
  console.log('🌐 Host:', mongoose.connection.host);
  console.log('🔌 Port:', mongoose.connection.port);
})
.catch((err) => {
  console.error('❌ MongoDB connection error:', err.message);
  console.error('🔗 Connection URI:', process.env.MONGODB_URI ? 'URI Set' : 'URI Missing');
});

// Monitor connection events
mongoose.connection.on('connected', () => {
  console.log('🟢 Mongoose connected to MongoDB');
});

mongoose.connection.on('error', (err) => {
  console.error('🔴 Mongoose connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('🟡 Mongoose disconnected from MongoDB');
});

const adminAuthRoutes = require('./routes/adminAuth');
const authRoutes = require('./routes/auth');
const roomRoutes = require('./routes/room');
const bookingRoutes = require('./routes/booking');
const bookingsRoutes = require('./routes/bookings');
const userRoutes = require('./routes/user');
const dashboardRoutes = require('./routes/dashboard');

app.use('/api/admin', adminAuthRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/rooms', roomRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/admin/bookings', bookingsRoutes);
app.use('/api/admin/dashboard', dashboardRoutes);
app.use('/api/users', userRoutes);

// Test Route for API
app.get('/api', (req, res) => {
  res.send('Yasin Heaven Star Hotel Backend API Running');
});

// MongoDB Connection Test Endpoint
app.get('/api/mongodb-test', async (req, res) => {
  try {
    // Import models (they should be available)
    const Room = require('./models/Room');
    const User = require('./models/User');
    const Booking = require('./models/Booking');
    
    // Test database connection
    const db = mongoose.connection.db;
    const admin = db.admin();
    
    // Get basic server info
    const serverStatus = await admin.serverStatus();
    const dbStats = await db.stats();
    
    // Count documents in collections
    const roomsCount = await Room.countDocuments();
    const usersCount = await User.countDocuments();
    const bookingsCount = await Booking.countDocuments();
    
    res.json({
      status: 'Connected to MongoDB Atlas',
      connectionState: mongoose.connection.readyState, // 1 = connected
      database: db.databaseName,
      host: mongoose.connection.host,
      collections: {
        rooms: roomsCount,
        users: usersCount,
        bookings: bookingsCount
      },
      serverInfo: {
        version: serverStatus.version,
        uptime: Math.floor(serverStatus.uptime / 60) + ' minutes',
        host: serverStatus.host
      },
      dbStats: {
        collections: dbStats.collections,
        dataSize: Math.round(dbStats.dataSize / 1024) + ' KB',
        indexSize: Math.round(dbStats.indexSize / 1024) + ' KB'
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('MongoDB test error:', error);
    res.status(500).json({
      status: 'MongoDB connection failed',
      error: error.message,
      connectionState: mongoose.connection.readyState,
      connectionStates: {
        0: 'disconnected',
        1: 'connected',
        2: 'connecting',
        3: 'disconnecting'
      },
      timestamp: new Date().toISOString()
    });
  }
});

// Serve React app for all non-API routes in production (only if serving static files)
if (process.env.NODE_ENV === 'production' && process.env.SERVE_STATIC === 'true') {
  app.get('*', (req, res) => {
    const buildPath = process.env.BUILD_PATH || path.join(__dirname, 'build');
    res.sendFile(path.join(buildPath, 'index.html'));
  });
} else {
  app.get('/', (req, res) => {
    res.json({
      message: 'Yasin Heaven Star Hotel Backend API Running',
      version: '1.0.0',
      environment: process.env.NODE_ENV || 'development',
      endpoints: {
        api: '/api',
        admin: '/api/admin',
        rooms: '/api/rooms',
        bookings: '/api/bookings',
        users: '/api/users'
      }
    });
  });
}

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});
