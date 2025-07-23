# Yasin Heaven Star Hotel - Backend API

A standalone Node.js/Express backend API for the hotel booking system.

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud)
- npm or yarn

### Installation & Setup

1. **Install dependencies:**
```bash
npm install
```

2. **Configure environment:**
```bash
cp .env.example .env
# Edit .env with your configuration
```

3. **Setup database and seed data:**
```bash
npm run setup
```

4. **Start the server:**
```bash
# Development mode
npm run dev

# Production mode
npm start

# Standalone production (API only)
npm run standalone
```

## 📋 Available Scripts

- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npm run standalone` - Start production server (API only, no static files)
- `npm run prod` - Start production server with static file serving
- `npm run setup` - Install dependencies, test DB, and seed data
- `npm run seed` - Seed database with initial data
- `npm run test-db` - Test database connection

## 🔧 Environment Configuration

Create a `.env` file based on `.env.example`:

```env
# Server Configuration
NODE_ENV=development
PORT=5000

# Frontend Configuration (for CORS)
FRONTEND_URL=http://localhost:3000
SERVE_STATIC=false
BUILD_PATH=./build

# Database Configuration
MONGODB_URI=mongodb://localhost:27017/hotel

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=7d

# Admin Configuration
ADMIN_EMAIL=admin@hotel.com
ADMIN_PASSWORD=admin123
```

## 🌐 API Endpoints

### Authentication
- `POST /api/admin/login` - Admin login
- `POST /api/users/register` - User registration
- `POST /api/users/login` - User login

### Rooms
- `GET /api/rooms` - Get all rooms
- `GET /api/rooms/:id` - Get room by ID
- `POST /api/rooms` - Create room (admin only)
- `PUT /api/rooms/:id` - Update room (admin only)
- `DELETE /api/rooms/:id` - Delete room (admin only)

### Bookings
- `GET /api/bookings` - Get all bookings (admin only)
- `POST /api/bookings` - Create booking
- `GET /api/bookings/my-bookings` - Get user bookings
- `PUT /api/bookings/:id/status` - Update booking status (admin only)
- `PUT /api/bookings/:id/cancel` - Cancel booking

### Admin Dashboard
- `GET /api/admin/dashboard/stats` - Get dashboard statistics
- `GET /api/admin/bookings` - Get all bookings with filters

### Users
- `GET /api/users` - Get all users (admin only)
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `DELETE /api/users/:id` - Delete user (admin only)

## 🔐 Authentication

The API uses JWT tokens for authentication:
- **User tokens**: For regular user operations
- **Admin tokens**: For administrative operations

Include the token in the Authorization header:
```
Authorization: Bearer <your-token>
```

## 🗄️ Database

The application uses MongoDB with Mongoose ODM. The database structure includes:
- Users collection
- Rooms collection
- Bookings collection
- Admin collection

## 🚀 Deployment

### Standalone API Server
```bash
# Set environment variables
export NODE_ENV=production
export PORT=5000
export MONGODB_URI=your-mongodb-connection-string

# Start the server
npm run standalone
```

### With Static File Serving
If you want to serve a frontend build from this server:
```bash
# Place your frontend build in ./build/ directory
# Set environment variables
export NODE_ENV=production
export SERVE_STATIC=true
export BUILD_PATH=./build

# Start the server
npm run prod
```

## 🔧 CORS Configuration

The server is configured to accept requests from:
- Development: `http://localhost:3000`
- Production: Configurable via `FRONTEND_URL` environment variable

## 📝 Logging

The server includes:
- Request logging with Morgan
- Error logging to console
- Environment-specific log levels

## 🛡️ Security Features

- Helmet for security headers
- Rate limiting
- CORS protection
- JWT token validation
- Password hashing with bcrypt
- Input validation with express-validator

## 🧪 Testing

```bash
# Test database connection
npm run test-db

# Run tests (when implemented)
npm test
```

## 📞 Support

The API server runs independently and can be deployed separately from any frontend application. It provides a complete REST API for hotel booking operations.