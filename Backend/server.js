require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? process.env.FRONTEND_URL || false // Allow frontend URL in production
    : ['http://localhost:3000', 'http://127.0.0.1:3000'], // Development origins
  credentials: true,
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
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/hotel')
.then(() => console.log('MongoDB connected'))
.catch((err) => console.error('MongoDB connection error:', err));

const adminAuthRoutes = require('./routes/adminAuth');
const roomRoutes = require('./routes/room');
const bookingRoutes = require('./routes/booking');
const bookingsRoutes = require('./routes/bookings');
const userRoutes = require('./routes/user');
const dashboardRoutes = require('./routes/dashboard');

app.use('/api/admin', adminAuthRoutes);
app.use('/api/rooms', roomRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/admin/bookings', bookingsRoutes);
app.use('/api/admin/dashboard', dashboardRoutes);
app.use('/api/users', userRoutes);

// Test Route for API
app.get('/api', (req, res) => {
  res.send('Yasin Heaven Star Hotel Backend API Running');
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
