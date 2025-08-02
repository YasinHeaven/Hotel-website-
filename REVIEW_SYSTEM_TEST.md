# 🎯 Review System Test Guide

## ✅ **Testing the Review System**

### **1. Frontend Testing (User Side):**
1. Go to your homepage
2. Scroll down to see the "Guest Reviews" section
3. Click "Write a Review" button
4. Fill out the form with test data:
   - Name: John Doe
   - Email: john@test.com  
   - Rating: 5 stars
   - Title: Amazing hotel experience!
   - Comment: Great service and beautiful location
5. Submit the review
6. You should see: "Thank you for your review! It will be published after admin approval."

### **2. Backend Testing:**
Check if the review was saved to database:
```
GET http://localhost:8080/api/reviews/admin
```
(Requires admin token)

### **3. Admin Testing:**
1. Login to admin panel: `/admin/login`
2. Go to "Reviews" in the sidebar
3. You should see the pending review
4. Click "Approve" to approve it
5. Go back to homepage - the review should now appear!

### **4. API Endpoints Created:**
- `GET /api/reviews` - Get approved reviews (public)
- `POST /api/reviews` - Submit new review (public)  
- `GET /api/reviews/admin` - Get all reviews (admin only)
- `PUT /api/reviews/:id/approve` - Approve review (admin only)
- `PUT /api/reviews/:id/reject` - Reject review (admin only)
- `DELETE /api/reviews/:id` - Delete review (admin only)

### **5. Features Implemented:**
✅ Review submission form with validation
✅ Star rating system (1-5 stars)
✅ Admin approval workflow
✅ Review display on homepage with stats
✅ Mobile responsive design
✅ Duplicate prevention (1 review per email per day)
✅ Professional styling matching your hotel theme

The system is now ready for your live website! 🚀
