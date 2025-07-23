const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Room = require('../models/Room');
const Booking = require('../models/Booking');
const auth = require('../middleware/auth');

// Get dashboard statistics
router.get('/stats', auth, async (req, res) => {
  try {
    console.log('Dashboard stats requested...');
    
    // Get counts
    const userCount = await User.countDocuments();
    const roomCount = await Room.countDocuments();
    const bookingCount = await Booking.countDocuments();
    
    console.log('Counts:', { userCount, roomCount, bookingCount });
    
    // Get today's bookings
    const today = new Date();
    const todayStart = new Date(today.setHours(0, 0, 0, 0));
    const todayBookings = await Booking.countDocuments({
      createdAt: { $gte: todayStart }
    });
    
    console.log('Today bookings:', todayBookings);
    
    // Get checked-in bookings
    const checkedIn = await Booking.countDocuments({
      status: 'checked-in'
    });
    
    // Get pending check-ins (approved/booked and check-in date is today or past)
    const pending = await Booking.countDocuments({
      status: { $in: ['pending', 'approved', 'booked'] },
      checkIn: { $lte: new Date() }
    });
    
    console.log('Checked in:', checkedIn, 'Pending:', pending);
    
    // Calculate total revenue (including totalAmount field)
    const completedBookings = await Booking.find({
      status: { $ne: 'cancelled' }
    });
    
    const revenue = completedBookings.reduce((total, booking) => {
      // Use totalAmount if available, otherwise calculate
      if (booking.totalAmount) {
        return total + booking.totalAmount;
      }
      return total;
    }, 0);
    
    console.log('Revenue calculation:', { completedBookingsCount: completedBookings.length, revenue });
    
    // Get recent bookings
    const recentBookings = await Booking.find()
      .populate('user room')
      .sort({ createdAt: -1 })
      .limit(5);
    
    console.log('Recent bookings count:', recentBookings.length);
    
    // Get recent users
    const recentUsers = await User.find()
      .sort({ createdAt: -1 })
      .limit(5);
    
    res.json({
      stats: {
        users: userCount,
        rooms: roomCount,
        bookings: bookingCount,
        revenue,
        todayBookings,
        checkedIn,
        pending,
        occupancyRate: roomCount > 0 ? ((checkedIn / roomCount) * 100).toFixed(1) : 0
      },
      recentBookings,
      recentUsers
    });
  } catch (err) {
    console.error('Dashboard stats error:', err);
    res.status(500).json({ message: 'Failed to fetch dashboard stats' });
  }
});

// Get monthly revenue data
router.get('/revenue', auth, async (req, res) => {
  try {
    const currentYear = new Date().getFullYear();
    const monthlyRevenue = [];
    
    for (let month = 0; month < 12; month++) {
      const startDate = new Date(currentYear, month, 1);
      const endDate = new Date(currentYear, month + 1, 0);
      
      const bookings = await Booking.find({
        checkIn: { $gte: startDate, $lte: endDate },
        status: { $ne: 'cancelled' }
      }).populate('room');
      
      const monthRevenue = bookings.reduce((total, booking) => {
        if (booking.room) {
          const nights = Math.ceil((new Date(booking.checkOut) - new Date(booking.checkIn)) / (1000 * 60 * 60 * 24));
          return total + (booking.room.price * nights);
        }
        return total;
      }, 0);
      
      monthlyRevenue.push({
        month: month + 1,
        revenue: monthRevenue,
        bookings: bookings.length
      });
    }
    
    res.json(monthlyRevenue);
  } catch (err) {
    console.error('Revenue data error:', err);
    res.status(500).json({ message: 'Failed to fetch revenue data' });
  }
});

// Get occupancy data
router.get('/occupancy', auth, async (req, res) => {
  try {
    const totalRooms = await Room.countDocuments();
    const currentlyOccupied = await Booking.countDocuments({
      status: 'checked-in'
    });
    
    // Get occupancy for next 30 days
    const occupancyData = [];
    const today = new Date();
    
    for (let i = 0; i < 30; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      
      const dateStart = new Date(date.setHours(0, 0, 0, 0));
      const dateEnd = new Date(date.setHours(23, 59, 59, 999));
      
      const occupiedRooms = await Booking.countDocuments({
        checkIn: { $lte: dateEnd },
        checkOut: { $gte: dateStart },
        status: { $ne: 'cancelled' }
      });
      
      occupancyData.push({
        date: dateStart,
        occupied: occupiedRooms,
        available: totalRooms - occupiedRooms,
        occupancyRate: totalRooms > 0 ? ((occupiedRooms / totalRooms) * 100).toFixed(1) : 0
      });
    }
    
    res.json({
      currentOccupancy: {
        total: totalRooms,
        occupied: currentlyOccupied,
        available: totalRooms - currentlyOccupied,
        rate: totalRooms > 0 ? ((currentlyOccupied / totalRooms) * 100).toFixed(1) : 0
      },
      forecast: occupancyData
    });
  } catch (err) {
    console.error('Occupancy data error:', err);
    res.status(500).json({ message: 'Failed to fetch occupancy data' });
  }
});

module.exports = router;