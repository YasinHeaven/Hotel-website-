console.log('Testing Review system...');

// Test if the review routes file exists
try {
  const reviewRoutes = require('./routes/reviews');
  console.log('✅ Review routes file loaded successfully');
} catch (error) {
  console.error('❌ Error loading review routes:', error.message);
}

// Test if the Review model exists
try {
  const Review = require('./models/Review');
  console.log('✅ Review model loaded successfully');
} catch (error) {
  console.error('❌ Error loading Review model:', error.message);
}

// Test if adminAuth middleware exists
try {
  const adminAuth = require('./middleware/adminAuth');
  console.log('✅ Admin auth middleware loaded successfully');
} catch (error) {
  console.error('❌ Error loading admin auth middleware:', error.message);
}

console.log('Test completed');
