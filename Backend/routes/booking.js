const express = require('express');
const Booking = require('../models/Booking');
const auth = require('../middleware/auth');
const router = express.Router();
const nodemailer = require('nodemailer');
require('dotenv').config();

// Create Booking (user must be authenticated)
router.post('/', auth, async (req, res) => {
  try {
    console.log('📝 NEW BOOKING REQUEST:');
    console.log('👤 User from token:', req.user);
    console.log('📋 Request body:', req.body);
    
    const { room, checkIn, checkOut, guests, customerInfo } = req.body;
    
    // 🔒 SECURITY: Input validation
    if (!room || !checkIn || !checkOut || !customerInfo) {
      return res.status(400).json({ 
        message: 'Missing required fields: room, checkIn, checkOut, customerInfo',
        success: false 
      });
    }
    
    // 🔒 SECURITY: Validate dates
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (checkInDate < today) {
      return res.status(400).json({ 
        message: 'Check-in date cannot be in the past',
        success: false 
      });
    }
    
    if (checkOutDate <= checkInDate) {
      return res.status(400).json({ 
        message: 'Check-out date must be after check-in date',
        success: false 
      });
    }
    
    // 🔒 SECURITY: Validate booking duration (max 30 days)
    const daysDiff = Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24));
    if (daysDiff > 30) {
      return res.status(400).json({ 
        message: 'Booking duration cannot exceed 30 days',
        success: false 
      });
    }
    
    // 🔒 SECURITY: Validate guests count
    if (!guests || guests < 1 || guests > 10) {
      return res.status(400).json({ 
        message: 'Invalid number of guests (must be between 1 and 10)',
        success: false 
      });
    }
    
    // 🔒 SECURITY: Validate customer info
    if (!customerInfo.name || !customerInfo.email || !customerInfo.phone) {
      return res.status(400).json({ 
        message: 'Customer information is incomplete (name, email, phone required)',
        success: false 
      });
    }
    
    // 🔒 SECURITY: Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(customerInfo.email)) {
      return res.status(400).json({ 
        message: 'Invalid email format',
        success: false 
      });
    }
    
    // 🔒 SECURITY: Sanitize customer info
    const sanitizedCustomerInfo = {
      name: customerInfo.name.trim().substring(0, 100),
      email: customerInfo.email.trim().toLowerCase().substring(0, 100),
      phone: customerInfo.phone.trim().substring(0, 20),
      specialRequests: customerInfo.specialRequests ? customerInfo.specialRequests.trim().substring(0, 500) : ''
    };
    
    // 🔒 SECURITY: Check if room exists and is available
    const Room = require('../models/Room');
    const roomDoc = await Room.findById(room);
    if (!roomDoc) {
      return res.status(404).json({ 
        message: 'Room not found',
        success: false 
      });
    }
    
    if (roomDoc.status !== 'available') {
      return res.status(400).json({ 
        message: 'Room is not available for booking',
        success: false 
      });
    }
    
    // 🔒 SECURITY: Check room capacity
    if (guests > roomDoc.capacity) {
      return res.status(400).json({ 
        message: `Room capacity exceeded. Maximum guests: ${roomDoc.capacity}`,
        success: false 
      });
    }
    
    // 🔒 SECURITY: Check for conflicting bookings
    const existingBooking = await Booking.findOne({
      room,
      $or: [
        {
          checkIn: { $lte: checkOutDate },
          checkOut: { $gt: checkInDate }
        }
      ],
      status: { $nin: ['cancelled', 'denied', 'no-show'] }
    });
    
    if (existingBooking) {
      console.log('❌ Room not available - existing booking found:', existingBooking._id);
      return res.status(400).json({ 
        message: 'Room is not available for the selected dates. Please choose different dates.',
        success: false,
        conflictingBooking: {
          checkIn: existingBooking.checkIn,
          checkOut: existingBooking.checkOut,
          status: existingBooking.status
        }
      });
    }
    
    // 🔒 SECURITY: Rate limiting - check user's recent bookings
    const recentBookings = await Booking.countDocuments({
      user: req.user.userId,
      createdAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) } // Last 24 hours
    });
    
    if (recentBookings >= 5) {
      return res.status(429).json({ 
        message: 'Too many booking requests. Please wait before making another booking.',
        success: false 
      });
    }
    
    // Create booking with validated data
    const booking = new Booking({
      user: req.user.userId,
      room,
      checkIn: checkInDate,
      checkOut: checkOutDate,
      guests: parseInt(guests),
      customerInfo: sanitizedCustomerInfo,
      status: 'pending',
      paymentStatus: 'pending'
    });
    
    console.log('💾 Saving booking:', {
      user: req.user.userId,
      room: roomDoc.type,
      checkIn: checkInDate.toISOString().split('T')[0],
      checkOut: checkOutDate.toISOString().split('T')[0],
      guests: guests,
      status: 'pending',
      totalAmount: booking.totalAmount
    });
    
    await booking.save();
    console.log('✅ Booking created successfully:', booking._id);

    // Send email to admin
    try {
      let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.GMAIL_USER || 'muhammadhaiderali2710@gmail.com',
          pass: process.env.GMAIL_PASS || 'qfru ziks molv nwcx'
        }
      });
      // Compose email
      let mailOptions = {
        from: 'no-reply@yasinheavenstar.com',
        to: process.env.ADMIN_NOTIFICATION_EMAIL || 'muhammadhaiderali2710@gmail.com',
        subject: 'New Room Booking Notification',
        text: `A new room booking has been made.\n\n` +
          `Name: ${booking.customerInfo.name}\n` +
          `Email: ${booking.customerInfo.email}\n` +
          `Phone: ${booking.customerInfo.phone}\n` +
          `Room: ${booking.room}\n` +
          `Check-in: ${booking.checkIn.toISOString().split('T')[0]}\n` +
          `Check-out: ${booking.checkOut.toISOString().split('T')[0]}\n` +
          `Guests: ${booking.guests}\n` +
          `Booking ID: ${booking._id}`
      };
      let info = await transporter.sendMail(mailOptions);
      console.log('📧 Booking notification sent to admin:', info.messageId);
    } catch (mailErr) {
      console.error('❌ Failed to send booking notification email:', mailErr);
    }
    
    // Populate for response
    await booking.populate('room', 'type price features images number');
    await booking.populate('user', 'name email');
    
    // Return comprehensive response
    res.status(201).json({
      success: true,
      message: 'Booking request submitted successfully! Our team will review and confirm within 24 hours.',
      booking: {
        _id: booking._id,
        status: booking.status,
        checkIn: booking.checkIn,
        checkOut: booking.checkOut,
        guests: booking.guests,
        totalAmount: booking.totalAmount,
        room: booking.room,
        user: booking.user,
        customerInfo: booking.customerInfo,
        createdAt: booking.createdAt,
        paymentStatus: booking.paymentStatus
      },
      nextSteps: [
        '✅ Your booking request has been received',
        '⏳ Admin will review within 24 hours',
        '📧 You will receive email confirmation with payment details',
        '📱 Check "My Bookings" for real-time status updates',
        '💡 Booking ID: ' + booking._id + ' (save this for reference)'
      ],
      bookingDetails: {
        nights: daysDiff,
        pricePerNight: roomDoc.price,
        totalAmount: booking.totalAmount,
        roomType: roomDoc.type,
        roomNumber: roomDoc.number
      }
    });
    
  } catch (err) {
    console.error('❌ ERROR creating booking:', err);
    
    // 🔒 SECURITY: Don't expose internal errors
    if (err.name === 'ValidationError') {
      return res.status(400).json({ 
        message: 'Invalid booking data provided',
        success: false 
      });
    }
    
    res.status(500).json({ 
      message: 'Internal server error. Please try again later.',
      success: false 
    });
  }
});

// Get all Bookings (admin only)
router.get('/', auth, async (req, res) => {
  try {
    const bookings = await Booking.find().populate('user room');
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get User's Own Bookings
router.get('/my-bookings', auth, async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user.userId })
      .populate('room')
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get Booking by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id).populate('user room');
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    res.json(booking);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update Booking
router.put('/:id', auth, async (req, res) => {
  try {
    const booking = await Booking.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    res.json(booking);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete Booking
router.delete('/:id', auth, async (req, res) => {
  try {
    const booking = await Booking.findByIdAndDelete(req.params.id);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    res.json({ message: 'Booking deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router; 