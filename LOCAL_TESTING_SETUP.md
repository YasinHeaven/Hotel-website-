# 🔧 **LOCAL TESTING SETUP**

## **✅ Changes Made:**

### **1. Frontend (.env):**
```env
REACT_APP_API_URL=http://localhost:5000
```

### **2. Backend (server.js):**
- Simplified CORS to allow all origins in development
- This will eliminate CORS issues during local testing

## **🚀 Testing Steps:**

### **Step 1: Start Backend Locally**
```bash
cd Backend
npm install
npm start
```
*Should show: "Server running on port 5000"*

### **Step 2: Test Backend API**
Open browser and visit:
- `http://localhost:5000/api` → Should show "API Running"
- `http://localhost:5000/api/reviews` → Should return JSON

### **Step 3: Start Frontend**
```bash
cd Frontend
# Stop current server (Ctrl+C)
npm start
```
*The .env change requires a restart!*

### **Step 4: Test Review System**
1. **User Reviews:** Try the floating review button
2. **Admin Reviews:** Login as admin and try adding reviews

## **🔍 Expected Results:**
- URLs should be: `http://localhost:5000/api/reviews` ✅
- No more `/api/api/reviews` ❌
- No CORS errors
- Review functionality should work

## **📋 Debug Checklist:**
- [ ] Backend running on port 5000
- [ ] Frontend restarted (important for .env changes)
- [ ] URLs showing localhost:5000 (not Railway)
- [ ] No double /api in URLs
- [ ] Admin logged in for admin features

Once local testing works, we'll switch back to Railway for production! 🌟
