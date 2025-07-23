const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const Room = require('../models/Room');
const User = require('../models/User');
const adminAuth = require('../middleware/adminAuth');

// Get all bookings with filters
router.get('/', adminAuth, async (req, res) => {
  try {
    const { status, search, sortBy = 'createdAt', sortOrder = 'desc', page = 1, limit = 10 } = req.query;
    
    // Build filter query
    let filter = {};
    
    if (status && status !== 'all') {
      filter.status = status;
    }
    
    // Calculate skip for pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    // Get bookings with population
    let query = Booking.find(filter)
      .populate('user', 'name email phone')
      .populate('room', 'type price features images')
      .sort({ [sortBy]: sortOrder === 'desc' ? -1 : 1 })
      .skip(skip)
      .limit(parseInt(limit));
    
    const bookings = await query;
    const total = await Booking.countDocuments(filter);
    
    // Filter by search term if provided
    let filteredBookings = bookings;
    if (search) {
      filteredBookings = bookings.filter(booking => {
        const searchLower = search.toLowerCase();
        return (
          booking.user?.name?.toLowerCase().includes(searchLower) ||
          booking.user?.email?.toLowerCase().includes(searchLower) ||
          booking.room?.type?.toLowerCase().includes(searchLower) ||
          booking.status?.toLowerCase().includes(searchLower)
        );
      });
    }
    
    res.json({
      bookings: filteredBookings,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / parseInt(limit)),
        totalItems: total,
        itemsPerPage: parseInt(limit)
      }
    });
  } catch (err) {
    console.error('Get bookings error:', err);
    res.status(500).json({ message: 'Failed to fetch bookings' });
  }
});

// Get booking by ID
router.get('/:id', adminAuth, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('user', 'name email phone')
      .populate('room', 'type price features images');
    
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    
    res.json(booking);
  } catch (err) {
    console.error('Get booking error:', err);
    res.status(500).json({ message: 'Failed to fetch booking' });
  }
});

// Create new booking (admin only)
router.post('/', adminAuth, async (req, res) => {
  try {
    const { userId, roomId, checkIn, checkOut, guests, specialRequests } = req.body;
    
    // Validate required fields
    if (!userId || !roomId || !checkIn || !checkOut || !guests) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    
    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Check if room exists
    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }
    
    // Check room availability
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    
    const conflictingBooking = await Booking.findOne({
      room: roomId,
      status: { $ne: 'cancelled' },
      $or: [
        {
          checkIn: { $lte: checkInDate },
          checkOut: { $gt: checkInDate }
        },
        {
          checkIn: { $lt: checkOutDate },
          checkOut: { $gte: checkOutDate }
        },
        {
          checkIn: { $gte: checkInDate },
          checkOut: { $lte: checkOutDate }
        }
      ]
    });
    
    if (conflictingBooking) {
      return res.status(400).json({ message: 'Room is not available for selected dates' });
    }
    
    // Calculate total amount
    const nights = Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24));
    const totalAmount = room.price * nights;
    
    // Create booking
    const booking = new Booking({
      user: userId,
      room: roomId,
      checkIn: checkInDate,
      checkOut: checkOutDate,
      guests,
      totalAmount,
      specialRequests,
      status: 'booked'
    });
    
    await booking.save();
    
    // Populate and return
    await booking.populate('user', 'name email phone');
    await booking.populate('room', 'type price features images');
    
    res.status(201).json(booking);
  } catch (err) {
    console.error('Create booking error:', err);
    res.status(500).json({ message: 'Failed to create booking' });
  }
});

// Update booking
router.put('/:id', adminAuth, async (req, res) => {
  try {
    const { checkIn, checkOut, guests, specialRequests, status } = req.body;
    
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    
    // If updating dates, check availability
    if (checkIn || checkOut) {
      const newCheckIn = checkIn ? new Date(checkIn) : booking.checkIn;
      const newCheckOut = checkOut ? new Date(checkOut) : booking.checkOut;
      
      const conflictingBooking = await Booking.findOne({
        _id: { $ne: booking._id },
        room: booking.room,
        status: { $ne: 'cancelled' },
        $or: [
          {
            checkIn: { $lte: newCheckIn },
            checkOut: { $gt: newCheckIn }
          },
          {
            checkIn: { $lt: newCheckOut },
            checkOut: { $gte: newCheckOut }
          },
          {
            checkIn: { $gte: newCheckIn },
            checkOut: { $lte: newCheckOut }
          }
        ]
      });
      
      if (conflictingBooking) {
        return res.status(400).json({ message: 'Room is not available for selected dates' });
      }
      
      // Recalculate total if dates changed
      if (checkIn || checkOut) {
        const room = await Room.findById(booking.room);
        const nights = Math.ceil((newCheckOut - newCheckIn) / (1000 * 60 * 60 * 24));
        booking.totalAmount = room.price * nights;
      }
    }
    
    // Update fields
    if (checkIn) booking.checkIn = new Date(checkIn);
    if (checkOut) booking.checkOut = new Date(checkOut);
    if (guests) booking.guests = guests;
    if (specialRequests !== undefined) booking.specialRequests = specialRequests;
    if (status) booking.status = status;
    
    await booking.save();
    
    // Populate and return
    await booking.populate('user', 'name email phone');
    await booking.populate('room', 'type price features images');
    
    res.json(booking);
  } catch (err) {
    console.error('Update booking error:', err);
    res.status(500).json({ message: 'Failed to update booking' });
  }
});

// Update booking status
router.patch('/:id/status', adminAuth, async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!status) {
      return res.status(400).json({ message: 'Status is required' });
    }
    
    const validStatuses = ['booked', 'checked-in', 'checked-out', 'cancelled', 'no-show'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }
    
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    
    booking.status = status;
    await booking.save();
    
    // Populate and return
    await booking.populate('user', 'name email phone');
    await booking.populate('room', 'type price features images');
    
    res.json(booking);
  } catch (err) {
    console.error('Update booking status error:', err);
    res.status(500).json({ message: 'Failed to update booking status' });
  }
});

// Update booking status (comprehensive endpoint for admin)
router.put('/:id/status', adminAuth, async (req, res) => {
  try {
    const { status, adminNotes, deniedReason } = req.body;
    const bookingId = req.params.id;
    
    console.log(`📋 Admin updating booking ${bookingId} status to: ${status}`);
    console.log(`👤 Admin user:`, req.user);
    
    // Validate required fields
    if (!status) {
      return res.status(400).json({ 
        message: 'Status is required',
        success: false 
      });
    }
    
    // Validate status values
    const validStatuses = ['pending', 'approved', 'booked', 'checked-in', 'checked-out', 'cancelled', 'no-show', 'denied'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ 
        message: `Invalid status. Valid options: ${validStatuses.join(', ')}`,
        success: false 
      });
    }
    
    // Find booking
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ 
        message: 'Booking not found',
        success: false 
      });
    }
    
    console.log(`📊 Status transition: ${booking.status} → ${status}`);
    
    // Validate status transitions
    const validTransitions = {
      'pending': ['approved', 'denied', 'cancelled'],
      'approved': ['booked', 'cancelled', 'denied'],
      'booked': ['checked-in', 'cancelled', 'no-show'],
      'checked-in': ['checked-out'],
      'checked-out': [], // Final state
      'cancelled': [], // Final state
      'denied': [], // Final state
      'no-show': [] // Final state
    };
    
    if (!validTransitions[booking.status]?.includes(status) && booking.status !== status) {
      return res.status(400).json({ 
        message: `Cannot change status from '${booking.status}' to '${status}'. Valid transitions: ${validTransitions[booking.status]?.join(', ') || 'none'}`,
        success: false 
      });
    }
    
    // Update booking with proper tracking
    const oldStatus = booking.status;
    booking.status = status;
    booking.adminNotes = adminNotes || booking.adminNotes;
    booking.updatedAt = new Date();
    
    // Handle specific status changes
    switch (status) {
      case 'approved':
        booking.approvedBy = req.user.userId;
        booking.approvedAt = new Date();
        booking.paymentStatus = 'pending';
        console.log(`✅ Booking approved by admin ${req.user.userId}`);
        break;
        
      case 'denied':
        if (!deniedReason) {
          return res.status(400).json({ 
            message: 'Denial reason is required when denying a booking',
            success: false 
          });
        }
        booking.deniedReason = deniedReason;
        booking.paymentStatus = 'refunded';
        console.log(`❌ Booking denied: ${deniedReason}`);
        break;
        
      case 'booked':
        booking.paymentStatus = 'paid';
        console.log(`💰 Booking confirmed as paid`);
        break;
        
      case 'checked-in':
        booking.checkInTime = new Date();
        console.log(`🏨 Guest checked in at ${booking.checkInTime}`);
        break;
        
      case 'checked-out':
        booking.checkOutTime = new Date();
        console.log(`🚪 Guest checked out at ${booking.checkOutTime}`);
        break;
        
      case 'cancelled':
        booking.paymentStatus = 'refunded';
        console.log(`🚫 Booking cancelled`);
        break;
        
      case 'no-show':
        console.log(`👻 Guest marked as no-show`);
        break;
    }
    
    // Save booking
    await booking.save();
    
    // Populate for response
    await booking.populate('user', 'name email phone');
    await booking.populate('room', 'type price features images number');
    if (booking.approvedBy) {
      await booking.populate('approvedBy', 'name email');
    }
    
    console.log(`✅ Booking ${bookingId} status updated: ${oldStatus} → ${status}`);
    
    // Return comprehensive response
    res.json({
      success: true,
      message: `Booking ${status} successfully`,
      booking,
      statusChange: {
        from: oldStatus,
        to: status,
        timestamp: new Date(),
        adminId: req.user.userId
      },
      nextActions: getNextActions(status)
    });
    
  } catch (err) {
    console.error('❌ Update booking status error:', err);
    res.status(500).json({ 
      message: 'Failed to update booking status: ' + err.message,
      success: false 
    });
  }
});

// Helper function to suggest next actions
function getNextActions(status) {
  const actions = {
    'pending': ['Review booking details', 'Approve or deny the request'],
    'approved': ['Wait for customer payment', 'Send payment instructions'],
    'booked': ['Prepare room', 'Send check-in instructions'],
    'checked-in': ['Monitor guest stay', 'Prepare for checkout'],
    'checked-out': ['Clean room', 'Process final billing'],
    'cancelled': ['Process refund if applicable', 'Make room available'],
    'denied': ['Send denial notification', 'Archive booking'],
    'no-show': ['Release room', 'Process no-show fee if applicable']
  };
  
  return actions[status] || [];
}

// Send email/contact customer
router.post('/:id/contact', adminAuth, async (req, res) => {
  try {
    const { subject, message, emailType, contactMethod } = req.body;
    const bookingId = req.params.id;
    
    const booking = await Booking.findById(bookingId)
      .populate('user', 'name email phone')
      .populate('room', 'type price');
    
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    
    // Here you would integrate with your email service (SendGrid, Nodemailer, etc.)
    // For now, we'll just log it and return success
    console.log(`📧 ${contactMethod} sent to customer:`);
    console.log(`Customer: ${booking.user.name} (${booking.user.email})`);
    console.log(`Subject: ${subject}`);
    console.log(`Message: ${message}`);
    console.log(`Type: ${emailType}`);
    
    // Add contact log to booking
    if (!booking.contactHistory) {
      booking.contactHistory = [];
    }
    
    booking.contactHistory.push({
      date: new Date(),
      type: emailType,
      contactMethod,
      subject,
      message,
      sentBy: req.user.userId
    });
    
    await booking.save();
    
    res.json({ 
      message: `${contactMethod} sent successfully`,
      customerEmail: booking.user.email,
      customerPhone: booking.user.phone 
    });
  } catch (err) {
    console.error('Send contact error:', err);
    res.status(500).json({ message: 'Failed to send contact' });
  }
});

// Delete booking
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    
    await Booking.findByIdAndDelete(req.params.id);
    res.json({ message: 'Booking deleted successfully' });
  } catch (err) {
    console.error('Delete booking error:', err);
    res.status(500).json({ message: 'Failed to delete booking' });
  }
});

// Get booking statistics
router.get('/stats/summary', adminAuth, async (req, res) => {
  try {
    const totalBookings = await Booking.countDocuments();
    const bookedCount = await Booking.countDocuments({ status: 'booked' });
    const checkedInCount = await Booking.countDocuments({ status: 'checked-in' });
    const checkedOutCount = await Booking.countDocuments({ status: 'checked-out' });
    const cancelledCount = await Booking.countDocuments({ status: 'cancelled' });
    
    // Calculate revenue
    const completedBookings = await Booking.find({
      status: { $in: ['checked-out', 'checked-in'] }
    });
    const totalRevenue = completedBookings.reduce((sum, booking) => sum + booking.totalAmount, 0);
    
    res.json({
      total: totalBookings,
      booked: bookedCount,
      checkedIn: checkedInCount,
      checkedOut: checkedOutCount,
      cancelled: cancelledCount,
      revenue: totalRevenue
    });
  } catch (err) {
    console.error('Booking stats error:', err);
    res.status(500).json({ message: 'Failed to fetch booking statistics' });
  }
});

module.exports = router;
