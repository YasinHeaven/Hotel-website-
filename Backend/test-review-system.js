require('dotenv').config();
const mongoose = require('mongoose');

console.log('🔍 Testing Review System Connection...');

async function testReviewSystem() {
  try {
    // Connect to MongoDB
    console.log('Connecting to MongoDB...');
    const mongoUri = process.env.MONGODB_URI;
    
    if (!mongoUri) {
      console.error('❌ MONGODB_URI not found in environment variables');
      return;
    }
    
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB');
    
    // Import Review model
    const Review = require('./models/Review');
    console.log('✅ Review model loaded');
    
    // Test Review operations
    console.log('\n📝 Testing Review operations...');
    
    // Count existing reviews
    const existingCount = await Review.countDocuments();
    console.log(`📊 Existing reviews in database: ${existingCount}`);
    
    // Create a test review
    const testReview = new Review({
      name: 'System Test User',
      email: 'test@example.com',
      rating: 5,
      title: 'Test Review - Please Delete',
      comment: 'This is a test review created by system verification. Please delete this.',
      location: 'Test Location',
      isApproved: false
    });
    
    await testReview.save();
    console.log('✅ Test review created successfully');
    console.log('📄 Review ID:', testReview._id);
    
    // Test approval
    testReview.isApproved = true;
    await testReview.save();
    console.log('✅ Review approval test successful');
    
    // Test query for approved reviews
    const approvedReviews = await Review.find({ isApproved: true, isVisible: true });
    console.log(`📊 Approved and visible reviews: ${approvedReviews.length}`);
    
    // Clean up test review
    await Review.findByIdAndDelete(testReview._id);
    console.log('🧹 Test review cleaned up');
    
    console.log('\n🎉 All Review system tests passed!');
    console.log('\n✅ Your review system is ready to use:');
    console.log('   - Database connection: Working');
    console.log('   - Review model: Working');
    console.log('   - CRUD operations: Working');
    console.log('   - Admin approval workflow: Working');
    
  } catch (error) {
    console.error('❌ Error testing review system:', error.message);
    console.error('Stack:', error.stack);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

testReviewSystem();
