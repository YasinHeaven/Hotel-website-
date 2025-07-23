require('dotenv').config();
const mongoose = require('mongoose');

const testConnection = async () => {
  try {
    console.log('🔍 Testing database connection...');
    console.log('Database URI:', process.env.MONGODB_URI || 'mongodb://localhost:27017/yasin_heaven_star_hotel');
    
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/yasin_heaven_star_hotel', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('✅ Successfully connected to MongoDB!');
    
    // Test database operations
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('📁 Available collections:', collections.map(c => c.name));
    
    // Test basic query
    const stats = await mongoose.connection.db.stats();
    console.log('📊 Database stats:', {
      database: stats.db,
      collections: stats.collections,
      objects: stats.objects,
      dataSize: `${(stats.dataSize / 1024 / 1024).toFixed(2)} MB`
    });
    
    console.log('🎉 Database connection test successful!');
    
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    
    if (error.code === 'ENOTFOUND') {
      console.log('💡 Possible solutions:');
      console.log('   1. Make sure MongoDB is installed and running');
      console.log('   2. Check if MongoDB service is started');
      console.log('   3. Verify the connection string in .env file');
    }
    
    if (error.code === 'ECONNREFUSED') {
      console.log('💡 MongoDB is not running. Start it with:');
      console.log('   - Windows: net start MongoDB');
      console.log('   - Or use Docker: docker-compose up -d mongo');
    }
  } finally {
    await mongoose.connection.close();
    console.log('🔐 Connection closed');
    process.exit(0);
  }
};

testConnection();
