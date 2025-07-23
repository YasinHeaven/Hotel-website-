# Yasin Heaven Star Hotel - Database Setup Guide

## Prerequisites

1. **Node.js** (v14 or higher)
2. **MongoDB** (Local installation or Docker)

## Option 1: Using Local MongoDB

### Install MongoDB
1. Download MongoDB from: https://www.mongodb.com/try/download/community
2. Install and start MongoDB service:
   ```cmd
   net start MongoDB
   ```

### Setup Steps
1. Navigate to backend directory:
   ```cmd
   cd Backend
   ```

2. Install dependencies:
   ```cmd
   npm install
   ```

3. Test database connection:
   ```cmd
   npm run test-db
   ```

4. Seed initial data:
   ```cmd
   npm run seed
   ```

5. Start the server:
   ```cmd
   npm run dev
   ```

## Option 2: Using Docker

### Setup Steps
1. Navigate to backend directory:
   ```cmd
   cd Backend
   ```

2. Start MongoDB with Docker:
   ```cmd
   docker-compose up -d mongo
   ```

3. Install dependencies:
   ```cmd
   npm install
   ```

4. Test database connection:
   ```cmd
   npm run test-db
   ```

5. Seed initial data:
   ```cmd
   npm run seed
   ```

6. Start the server:
   ```cmd
   npm run dev
   ```

## Environment Variables

Make sure your `.env` file contains:
```env
MONGODB_URI=mongodb://localhost:27017/yasin_heaven_star_hotel
PORT=5000
JWT_SECRET=your_super_secret_jwt_key_here
ADMIN_EMAIL=admin@yasinheavenstar.com
ADMIN_PASSWORD=admin123
```

## Default Admin Credentials

- **Email**: admin@yasinheavenstar.com
- **Password**: admin123

## API Endpoints

- **Backend**: http://localhost:5000
- **Test Route**: http://localhost:5000/
- **Admin Routes**: http://localhost:5000/api/admin/
- **Room Routes**: http://localhost:5000/api/rooms/
- **Booking Routes**: http://localhost:5000/api/bookings/
- **User Routes**: http://localhost:5000/api/users/

## Troubleshooting

### MongoDB Connection Issues
1. Check if MongoDB service is running
2. Verify connection string in `.env`
3. Check firewall settings
4. Try using Docker option

### Permission Issues
1. Run terminal as administrator
2. Check MongoDB installation directory permissions

### Port Conflicts
1. Change PORT in `.env` file
2. Check if port 5000 is already in use
