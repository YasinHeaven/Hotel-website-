require('dotenv').config();
const mongoose = require('mongoose');

// Import models
const Admin = require('../models/Admin');
const Room = require('../models/Room');
const User = require('../models/User');
const Gallery = require('../models/Gallery');

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/yasin_heaven_star_hotel');
    console.log('✅ Connected to MongoDB');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
};

// Seed Admin User
const seedAdmin = async () => {
  try {
    const existingAdmin = await Admin.findOne({ email: process.env.ADMIN_EMAIL || 'admin@yasinheavenstar.com' });
    
    if (!existingAdmin) {
      const admin = new Admin({
        email: process.env.ADMIN_EMAIL || 'admin@yasinheavenstar.com',
        password: process.env.ADMIN_PASSWORD || 'admin123',
        name: 'Hotel Administrator'
      });
      
      await admin.save();
      console.log('✅ Admin user created successfully');
    } else {
      console.log('ℹ️  Admin user already exists');
    }
  } catch (error) {
    console.error('❌ Error creating admin:', error);
  }
};

// Seed Sample Rooms
const seedRooms = async () => {
  try {
    const existingRooms = await Room.countDocuments();
    
    if (existingRooms === 0) {
      const sampleRooms = [
        {
          number: '101',
          type: 'Single Room',
          price: 75,
          status: 'available',
          description: 'Comfortable single room with modern amenities, perfect for solo travelers',
          capacity: 1,
          size: '18 sqm',
          bedType: 'Single Bed',
          amenities: ['WiFi', 'Air Conditioning', 'TV', 'Mini Fridge', 'Private Bathroom'],
          images: ['/assets/Rooms/Single Room 1.jpg', '/assets/Rooms/Single Room 2.jpg'],
          features: {
            wifi: true,
            airConditioning: true,
            minibar: false,
            balcony: false,
            cityView: true,
            oceanView: false
          }
        },
        {
          number: '102',
          type: 'Single Room',
          price: 75,
          status: 'available',
          description: 'Cozy single room with city view and all essential amenities',
          capacity: 1,
          size: '18 sqm',
          bedType: 'Single Bed',
          amenities: ['WiFi', 'Air Conditioning', 'TV', 'Mini Fridge', 'Private Bathroom'],
          images: ['/assets/Rooms/Single Room 1.jpg', '/assets/Rooms/Single Room 2.jpg'],
          features: {
            wifi: true,
            airConditioning: true,
            minibar: false,
            balcony: false,
            cityView: true,
            oceanView: false
          }
        },
        {
          number: '201',
          type: 'Delux Room',
          price: 120,
          status: 'available',
          description: 'Spacious deluxe room with premium amenities and stunning city view',
          capacity: 2,
          size: '28 sqm',
          bedType: 'Queen Size Bed',
          amenities: ['WiFi', 'Air Conditioning', 'TV', 'Minibar', 'Private Bathroom', 'Balcony', 'Work Desk'],
          images: ['/assets/Rooms/Delux Room 1.jpg', '/assets/Rooms/Delux Room 2.jpg'],
          features: {
            wifi: true,
            airConditioning: true,
            minibar: true,
            balcony: true,
            cityView: true,
            oceanView: false
          }
        },
        {
          number: '202',
          type: 'Delux Room',
          price: 120,
          status: 'available',
          description: 'Elegant deluxe room with modern furnishings and luxury amenities',
          capacity: 2,
          size: '28 sqm',
          bedType: 'Queen Size Bed',
          amenities: ['WiFi', 'Air Conditioning', 'TV', 'Minibar', 'Private Bathroom', 'Balcony', 'Work Desk'],
          images: ['/assets/Rooms/Delux Room 1.jpg', '/assets/Rooms/Delux Room 2.jpg'],
          features: {
            wifi: true,
            airConditioning: true,
            minibar: true,
            balcony: true,
            cityView: true,
            oceanView: false
          }
        },
        {
          number: '301',
          type: 'Master Room',
          price: 180,
          status: 'available',
          description: 'Luxurious master suite with panoramic view and premium facilities',
          capacity: 2,
          size: '40 sqm',
          bedType: 'King Size Bed',
          amenities: ['WiFi', 'Air Conditioning', 'Smart TV', 'Minibar', 'Private Bathroom', 'Balcony', 'Work Desk', 'Sitting Area', 'Premium Toiletries'],
          images: ['/assets/Rooms/Master Room 1.jpg', '/assets/Rooms/Master Room 2.jpg'],
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
          number: '302',
          type: 'Family Room',
          price: 150,
          status: 'available',
          description: 'Spacious family room perfect for families with children, includes extra beds',
          capacity: 4,
          size: '35 sqm',
          bedType: 'Queen Bed + Twin Beds',
          amenities: ['WiFi', 'Air Conditioning', 'TV', 'Minibar', 'Private Bathroom', 'Balcony', 'Extra Beds', 'Mini Fridge'],
          images: ['/assets/Rooms/Family room 1.jpg', '/assets/Rooms/Family room 2.jpg'],
          features: {
            wifi: true,
            airConditioning: true,
            minibar: true,
            balcony: true,
            cityView: true,
            oceanView: false
          }
        },
        {
          number: '303',
          type: 'Family Room',
          price: 150,
          status: 'available',
          description: 'Large family room with connecting space and child-friendly amenities',
          capacity: 4,
          size: '35 sqm',
          bedType: 'Queen Bed + Twin Beds',
          amenities: ['WiFi', 'Air Conditioning', 'TV', 'Minibar', 'Private Bathroom', 'Balcony', 'Extra Beds', 'Mini Fridge'],
          images: ['/assets/Rooms/Family room 1.jpg', '/assets/Rooms/Family room 2.jpg'],
          features: {
            wifi: true,
            airConditioning: true,
            minibar: true,
            balcony: true,
            cityView: true,
            oceanView: false
          }
        },
        {
          number: '401',
          type: 'Master Room',
          price: 180,
          status: 'available',
          description: 'Premium master suite with ocean view and exclusive amenities',
          capacity: 2,
          size: '40 sqm',
          bedType: 'King Size Bed',
          amenities: ['WiFi', 'Air Conditioning', 'Smart TV', 'Minibar', 'Private Bathroom', 'Balcony', 'Work Desk', 'Sitting Area', 'Premium Toiletries', 'Ocean View'],
          images: ['/assets/Rooms/Master Room 1.jpg', '/assets/Rooms/Master Room 2.jpg'],
          features: {
            wifi: true,
            airConditioning: true,
            minibar: true,
            balcony: true,
            cityView: false,
            oceanView: true
          }
        }
      ];
      
      await Room.insertMany(sampleRooms);
      console.log('✅ Sample rooms created successfully');
    } else {
      console.log('ℹ️  Rooms already exist in database');
    }
  } catch (error) {
    console.error('❌ Error creating rooms:', error);
  }
};

// Seed Sample Gallery Images
const seedGallery = async () => {
  try {
    const existingImages = await Gallery.countDocuments();
    
    if (existingImages === 0) {
      const sampleImages = [
        {
          title: 'Hotel Exterior',
          description: 'Beautiful exterior view of Yasin Heaven Star Hotel',
          imageUrl: '/assets/Home 1.jpg',
          category: 'exterior'
        },
        {
          title: 'Master Room',
          description: 'Luxurious master room with premium amenities',
          imageUrl: '/assets/Master Room 1.jpg',
          category: 'rooms'
        },
        {
          title: 'Delux Room',
          description: 'Comfortable deluxe room with modern facilities',
          imageUrl: '/assets/Delux Room 1.jpg',
          category: 'rooms'
        },
        {
          title: 'Family Room',
          description: 'Spacious family room perfect for families',
          imageUrl: '/assets/Family room 1.jpg',
          category: 'rooms'
        },
        {
          title: 'Single Room',
          description: 'Cozy single room with all essential amenities',
          imageUrl: '/assets/Single Room 1.jpg',
          category: 'rooms'
        }
      ];
      
      await Gallery.insertMany(sampleImages);
      console.log('✅ Sample gallery images created successfully');
    } else {
      console.log('ℹ️  Gallery images already exist in database');
    }
  } catch (error) {
    console.error('❌ Error creating gallery images:', error);
  }
};

// Main seeder function
const runSeeder = async () => {
  try {
    console.log('🌱 Starting database seeding...');
    
    await connectDB();
    await seedAdmin();
    await seedRooms();
    await seedGallery();
    
    console.log('🎉 Database seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
};

// Run seeder if called directly
if (require.main === module) {
  runSeeder();
}

module.exports = { runSeeder, seedAdmin, seedRooms, seedGallery };
