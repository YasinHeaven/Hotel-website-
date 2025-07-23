# 🚀 Standalone Setup Guide

This guide explains how to run the Frontend and Backend completely independently, even if moved to separate locations.

## 📁 Project Structure (Independent)

```
yasin-heaven-star-hotel/
├── Frontend/                    # ✅ Completely standalone React app
│   ├── src/
│   ├── public/
│   ├── .env.example            # ✅ API configuration template
│   ├── package.json            # ✅ Independent dependencies
│   ├── README.md               # ✅ Standalone documentation
│   ├── setup.bat               # ✅ Windows setup script
│   └── start.bat               # ✅ Windows start script
│
└── Backend/                     # ✅ Completely standalone API server
    ├── routes/
    ├── models/
    ├── .env.example            # ✅ Server configuration template
    ├── package.json            # ✅ Independent dependencies
    ├── README.md               # ✅ Standalone documentation
    ├── setup.bat               # ✅ Windows setup script
    └── start.bat               # ✅ Windows start script
```

## 🎯 Complete Independence Achieved

### ✅ Frontend Independence
- **No Backend Dependencies**: Frontend can run without Backend folder present
- **Configurable API URL**: Can connect to any backend via environment variables
- **Standalone Build**: Creates independent production build
- **Own Documentation**: Complete setup and usage guide
- **Own Scripts**: Independent setup and start scripts

### ✅ Backend Independence  
- **No Frontend Dependencies**: Backend runs without Frontend folder present
- **Configurable CORS**: Can serve any frontend via environment variables
- **API-Only Mode**: Can run as pure API server
- **Own Documentation**: Complete API documentation
- **Own Scripts**: Independent setup and start scripts

## 🚀 How to Use Independently

### Option 1: Move Frontend to Separate Location

1. **Copy the Frontend folder anywhere:**
```bash
# Copy Frontend folder to a new location
cp -r Frontend/ /path/to/new/location/hotel-frontend/
cd /path/to/new/location/hotel-frontend/
```

2. **Setup independently:**
```bash
# Windows
setup.bat

# Or manually
npm install
cp .env.example .env
# Edit .env with your backend URL
```

3. **Configure API connection:**
```env
# In .env file
REACT_APP_API_URL=http://your-backend-server:5000/api
```

4. **Start the frontend:**
```bash
# Windows
start.bat

# Or manually
npm start
```

### Option 2: Move Backend to Separate Location

1. **Copy the Backend folder anywhere:**
```bash
# Copy Backend folder to a new location
cp -r Backend/ /path/to/new/location/hotel-backend/
cd /path/to/new/location/hotel-backend/
```

2. **Setup independently:**
```bash
# Windows
setup.bat

# Or manually
npm install
cp .env.example .env
# Edit .env with your configuration
```

3. **Configure for your frontend:**
```env
# In .env file
NODE_ENV=development
PORT=5000
FRONTEND_URL=http://your-frontend-domain:3000
SERVE_STATIC=false
MONGODB_URI=mongodb://localhost:27017/hotel
```

4. **Start the backend:**
```bash
# Windows
start.bat

# Or manually
npm run dev        # Development
npm start          # Production
npm run standalone # API only
```

## 🌐 Different Deployment Scenarios

### Scenario 1: Both on Same Server
```env
# Frontend .env
REACT_APP_API_URL=http://localhost:5000/api

# Backend .env
FRONTEND_URL=http://localhost:3000
```

### Scenario 2: Different Servers
```env
# Frontend .env (on server A)
REACT_APP_API_URL=https://api.yourhotel.com/api

# Backend .env (on server B)
FRONTEND_URL=https://app.yourhotel.com
```

### Scenario 3: Different Ports
```env
# Frontend .env
REACT_APP_API_URL=http://localhost:8080/api

# Backend .env
PORT=8080
FRONTEND_URL=http://localhost:3000
```

### Scenario 4: Cloud Deployment
```env
# Frontend .env
REACT_APP_API_URL=https://your-backend.herokuapp.com/api

# Backend .env
FRONTEND_URL=https://your-frontend.netlify.app
```

## 🔧 Configuration Examples

### Frontend Connecting to Remote Backend
```env
# Frontend/.env
REACT_APP_API_URL=https://api.example.com/api
REACT_APP_NAME=Yasin Heaven Star Hotel
REACT_APP_VERSION=1.0.0
GENERATE_SOURCEMAP=false
```

### Backend Serving Remote Frontend
```env
# Backend/.env
NODE_ENV=production
PORT=5000
FRONTEND_URL=https://hotel-app.example.com
SERVE_STATIC=false
MONGODB_URI=mongodb://your-mongo-server/hotel
JWT_SECRET=your-production-secret
```

## 📋 Quick Setup Commands

### Frontend Only Setup
```bash
cd Frontend/
npm install
cp .env.example .env
# Edit .env with your backend URL
npm start
```

### Backend Only Setup
```bash
cd Backend/
npm install
cp .env.example .env
# Edit .env with your configuration
npm run setup
npm run dev
```

## 🧪 Testing Independence

### Test Frontend Independence
1. Move Frontend folder to desktop
2. Run setup and start scripts
3. Should work with any backend URL

### Test Backend Independence
1. Move Backend folder to desktop
2. Run setup and start scripts
3. Should serve API to any frontend

## 🔍 Troubleshooting Independent Setup

### Frontend Issues
- **API Connection Failed**: Check `REACT_APP_API_URL` in `.env`
- **CORS Errors**: Ensure backend allows your frontend domain
- **Build Errors**: Run `npm install` to ensure all dependencies

### Backend Issues
- **CORS Errors**: Check `FRONTEND_URL` in `.env`
- **Database Connection**: Verify `MONGODB_URI` in `.env`
- **Port Conflicts**: Change `PORT` in `.env`

## ✅ Independence Checklist

- [x] Frontend runs without Backend folder present
- [x] Backend runs without Frontend folder present
- [x] Frontend can connect to any backend URL
- [x] Backend can serve any frontend domain
- [x] Both have independent documentation
- [x] Both have independent setup scripts
- [x] Both have independent dependencies
- [x] Both can be deployed separately
- [x] Configuration is environment-based
- [x] No hardcoded paths between folders

## 🎉 Result

Both Frontend and Backend are now **completely independent** and can be:
- Moved to separate locations
- Deployed on different servers
- Developed by different teams
- Scaled independently
- Configured for any environment

The only connection between them is the API URL configuration, which is completely flexible and environment-based!