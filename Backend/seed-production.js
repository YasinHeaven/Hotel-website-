// Seed Production Database with Sample Data
require('dotenv').config();
const mongoose = require('mongoose');

// Import models
const Room = require('./models/Room');
const Admin = require('./models/Admin');

async function seedDatabase() {
  try {
    console.log('🌱 Starting database seeding...');
    
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');
    console.log('📍 Database:', mongoose.connection.db.databaseName);
    
    // Clear existing data
    console.log('🧹 Clearing existing data...');
    await Room.deleteMany({});
    await Admin.deleteMany({});
    
    // Sample room data
    const sampleRooms = [
      {
        number: '101',
        name: 'Deluxe Suite',
        type: 'Suite',
        price: 150,
        capacity: 2,
        amenities: ['WiFi', 'AC', 'TV', 'Mini Bar', 'Room Service'],
        description: 'Luxurious suite with stunning city views',
        images: ['/assets/Rooms/deluxe-suite.jpg'],
        status: 'available',
        size: '45 sqm',
        bedType: 'King Size',
        features: {
          wifi: true,
          airConditioning: true,
          minibar: true,
          balcony: true,
          cityView: true
        }
      },
      {
        number: '102',
        name: 'Standard Room',
        type: 'Standard',
        price: 80,
        capacity: 2,
        amenities: ['WiFi', 'AC', 'TV'],
        description: 'Comfortable standard room with modern amenities',
        images: ['/assets/Rooms/standard-room.jpg'],
        status: 'available',
        size: '25 sqm',
        bedType: 'Queen Size',
        features: {
          wifi: true,
          airConditioning: true,
          minibar: false,
          balcony: false,
          cityView: true
        }
      },
      {
        number: '201',
        name: 'Family Room',
        type: 'Family',
        price: 200,
        capacity: 4,
        amenities: ['WiFi', 'AC', 'TV', 'Kitchenette', 'Extra Bed'],
        description: 'Spacious family room perfect for families',
        images: ['/assets/Rooms/family-room.jpg'],
        status: 'available',
        size: '55 sqm',
        bedType: 'Twin Beds + Sofa Bed',
        features: {
          wifi: true,
          airConditioning: true,
          minibar: true,
          balcony: true,
          cityView: true
        }
      },
      {
        number: '301',
        name: 'Presidential Suite',
        type: 'Presidential',
        price: 500,
        capacity: 2,
        amenities: ['WiFi', 'AC', 'TV', 'Mini Bar', 'Room Service', 'Balcony', 'Jacuzzi'],
        description: 'Ultimate luxury with premium amenities',
        images: ['/assets/Rooms/presidential-suite.jpg'],
        status: 'available',
        size: '80 sqm',
        bedType: 'King Size',
        features: {
          wifi: true,
          airConditioning: true,
          minibar: true,
          balcony: true,
          cityView: true,
          oceanView: true
        }
      },
      {
        number: '103',
        name: 'Business Room',
        type: 'Business',
        price: 120,
        capacity: 1,
        amenities: ['WiFi', 'AC', 'TV', 'Work Desk', 'Coffee Machine'],
        description: 'Perfect for business travelers',
        images: ['/assets/Rooms/business-room.jpg'],
        status: 'available',
        size: '30 sqm',
        bedType: 'Queen Size',
        features: {
          wifi: true,
          airConditioning: true,
          minibar: true,
          balcony: false,
          cityView: true
        }
      }
    ];
    
    // Insert sample rooms
    console.log('🏨 Adding sample rooms...');
    const rooms = await Room.insertMany(sampleRooms);
    console.log(`✅ Added ${rooms.length} rooms`);
    
    // Create admin user
    console.log('👤 Creating admin user...');
    const bcrypt = require('bcryptjs');
    const hashedPassword = await bcrypt.hash('YHSHotel@2025!', 12);
    
    const admin = new Admin({
      email: 'yasinheavenstarhotel@gmail.com',
      password: hashedPassword,
      role: 'admin'
    });
    
    await admin.save();
    console.log('✅ Admin user created');
    
    // Verify data
    const roomCount = await Room.countDocuments();
    const adminCount = await Admin.countDocuments();
    
    console.log('\n📊 Database Summary:');
    console.log(`   Rooms: ${roomCount}`);
    console.log(`   Admins: ${adminCount}`);
    console.log(`   Database: ${mongoose.connection.db.databaseName}`);
    
    console.log('\n🎉 Database seeding completed successfully!');
    console.log('\n🔗 Test your API:');
    console.log('   Rooms: https://hotel-website-production-672b.up.railway.app/api/rooms');
    console.log('   MongoDB Test: https://hotel-website-production-672b.up.railway.app/api/mongodb-test');
    
  } catch (error) {
    console.error('❌ Seeding failed:', error.message);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
  }
}

seedDatabase();
