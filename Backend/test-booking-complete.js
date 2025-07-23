const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api';

// Test data
const testData = {
  admin: {
    email: 'admin@hotel.com',
    password: 'admin123'
  },
  user: {
    name: 'Test User',
    email: 'test@example.com',
    password: 'password123',
    phone: '1234567890'
  },
  room: {
    number: '101',
    type: 'Single',
    price: 100,
    features: ['AC', 'WiFi', 'TV'],
    description: 'Test room',
    images: ['test.jpg']
  },
  booking: {
    checkIn: '2024-02-01',
    checkOut: '2024-02-03',
    guests: 2,
    specialRequests: 'Test booking'
  }
};

let authToken = '';
let userId = '';
let roomId = '';
let bookingId = '';

async function testBookingSystem() {
  console.log('🚀 Starting Booking System Test...\n');

  try {
    // 1. Test Admin Login
    console.log('1. Testing Admin Authentication...');
    const loginResponse = await axios.post(`${BASE_URL}/admin/login`, testData.admin);
    authToken = loginResponse.data.token;
    console.log('✅ Admin login successful');
    
    const headers = { Authorization: `Bearer ${authToken}` };

    // 2. Create Test User
    console.log('\n2. Creating Test User...');
    try {
      const userResponse = await axios.post(`${BASE_URL}/users/register`, testData.user);
      userId = userResponse.data.user._id;
      console.log('✅ User created successfully');
    } catch (error) {
      // User might already exist
      if (error.response?.status === 400) {
        const existingUser = await axios.post(`${BASE_URL}/users/login`, {
          email: testData.user.email,
          password: testData.user.password
        });
        userId = existingUser.data.user._id;
        console.log('✅ Using existing user');
      } else {
        throw error;
      }
    }

    // 3. Create Test Room
    console.log('\n3. Creating Test Room...');
    try {
      const roomResponse = await axios.post(`${BASE_URL}/rooms`, testData.room, { headers });
      roomId = roomResponse.data._id;
      console.log('✅ Room created successfully');
    } catch (error) {
      // Check if room already exists
      if (error.response?.status === 400 && error.response?.data?.message?.includes('E11000')) {
        const roomsResponse = await axios.get(`${BASE_URL}/rooms`);
        const existingRoom = roomsResponse.data.find(room => room.number === testData.room.number);
        if (existingRoom) {
          roomId = existingRoom._id;
          console.log('✅ Using existing room with number', testData.room.number);
        } else {
          // Try with a different room number
          testData.room.number = '102';
          const roomResponse = await axios.post(`${BASE_URL}/rooms`, testData.room, { headers });
          roomId = roomResponse.data._id;
          console.log('✅ Room created successfully with number 102');
        }
      } else {
        throw error;
      }
    }

    // 4. Create Booking
    console.log('\n4. Creating Booking...');
    const bookingData = {
      userId,
      roomId,
      checkIn: testData.booking.checkIn,
      checkOut: testData.booking.checkOut,
      guests: testData.booking.guests,
      specialRequests: testData.booking.specialRequests
    };
    const bookingResponse = await axios.post(`${BASE_URL}/admin/bookings`, bookingData, { headers });
    bookingId = bookingResponse.data._id;
    console.log('✅ Booking created successfully');
    console.log('📝 Booking Details:', {
      id: bookingId,
      user: bookingResponse.data.user?.name,
      room: bookingResponse.data.room?.type,
      checkIn: bookingResponse.data.checkIn,
      checkOut: bookingResponse.data.checkOut,
      status: bookingResponse.data.status,
      totalAmount: bookingResponse.data.totalAmount
    });

    // 5. Test Dashboard Stats
    console.log('\n5. Testing Dashboard Statistics...');
    const statsResponse = await axios.get(`${BASE_URL}/admin/dashboard/stats`, { headers });
    console.log('✅ Dashboard stats retrieved');
    console.log('📊 Dashboard Stats:', {
      users: statsResponse.data.stats.users,
      rooms: statsResponse.data.stats.rooms,
      bookings: statsResponse.data.stats.bookings,
      revenue: statsResponse.data.stats.revenue,
      occupancyRate: statsResponse.data.stats.occupancyRate + '%'
    });

    // 6. Test Booking Retrieval
    console.log('\n6. Testing Booking Retrieval...');
    const allBookingsResponse = await axios.get(`${BASE_URL}/admin/bookings`, { headers });
    console.log('✅ All bookings retrieved');
    console.log('📋 Total Bookings:', allBookingsResponse.data.bookings.length);

    // 7. Test Booking Status Update
    console.log('\n7. Testing Booking Status Update...');
    const statusUpdateResponse = await axios.patch(
      `${BASE_URL}/admin/bookings/${bookingId}/status`,
      { status: 'checked-in' },
      { headers }
    );
    console.log('✅ Booking status updated to checked-in');

    // 8. Test Booking Details
    console.log('\n8. Testing Booking Details...');
    const bookingDetailsResponse = await axios.get(`${BASE_URL}/admin/bookings/${bookingId}`, { headers });
    console.log('✅ Booking details retrieved');
    console.log('📄 Updated Booking:', {
      status: bookingDetailsResponse.data.status,
      user: bookingDetailsResponse.data.user?.name,
      room: bookingDetailsResponse.data.room?.type
    });

    // 9. Test Booking Search/Filter
    console.log('\n9. Testing Booking Search/Filter...');
    const filteredBookingsResponse = await axios.get(
      `${BASE_URL}/admin/bookings?status=checked-in&search=${testData.user.name}`,
      { headers }
    );
    console.log('✅ Booking search/filter working');
    console.log('🔍 Filtered Results:', filteredBookingsResponse.data.bookings.length);

    // 10. Test Revenue Data
    console.log('\n10. Testing Revenue Data...');
    const revenueResponse = await axios.get(`${BASE_URL}/admin/dashboard/revenue`, { headers });
    console.log('✅ Revenue data retrieved');
    
    // 11. Test Occupancy Data
    console.log('\n11. Testing Occupancy Data...');
    const occupancyResponse = await axios.get(`${BASE_URL}/admin/dashboard/occupancy`, { headers });
    console.log('✅ Occupancy data retrieved');
    console.log('🏨 Current Occupancy:', occupancyResponse.data.currentOccupancy);

    console.log('\n🎉 ALL TESTS PASSED! Booking system is working properly!');
    console.log('\n📈 System Status Summary:');
    console.log('- ✅ Admin Authentication: Working');
    console.log('- ✅ User Management: Working');
    console.log('- ✅ Room Management: Working');
    console.log('- ✅ Booking Creation: Working');
    console.log('- ✅ Booking Updates: Working');
    console.log('- ✅ Dashboard Statistics: Working');
    console.log('- ✅ Revenue Tracking: Working');
    console.log('- ✅ Occupancy Management: Working');
    console.log('- ✅ Search/Filter: Working');

  } catch (error) {
    console.error('\n❌ Test Failed:', error.response?.data?.message || error.message);
    if (error.response?.data) {
      console.error('Error Details:', error.response.data);
    }
    console.error('Full Error:', error.message);
  }
}

// Run the test
testBookingSystem();
