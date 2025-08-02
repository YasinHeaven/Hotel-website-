const express = require('express');
const User = require('../models/User');
const adminAuth = require('../middleware/adminAuth');
const router = express.Router();

// Get all users (admin view)
router.get('/', adminAuth, async (req, res) => {
  try {
    console.log('👥 Admin - Getting all users');
    const users = await User.find()
      .select('-password') // Don't send passwords
      .sort({ createdAt: -1 });
    console.log(`✅ Found ${users.length} users`);
    res.json(users);
  } catch (err) {
    console.error('❌ Error getting users:', err);
    res.status(500).json({ message: 'Failed to fetch users', error: err.message });
  }
});

// Create new user (admin only)
router.post('/', adminAuth, async (req, res) => {
  try {
    console.log('👥 Admin - Creating new user:', req.body.email);
    
    // Check if user already exists
    const existingUser = await User.findOne({ email: req.body.email });
    if (existingUser) {
      return res.status(400).json({ 
        message: 'User already exists with this email',
        error: 'DUPLICATE_EMAIL' 
      });
    }
    
    const user = new User({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      phone: req.body.phone || '',
      address: req.body.address || '',
      isActive: req.body.isActive !== false // Default to true
    });
    
    await user.save();
    
    // Return user without password
    const userResponse = user.toObject();
    delete userResponse.password;
    
    console.log('✅ User created successfully:', user._id);
    res.status(201).json(userResponse);
  } catch (err) {
    console.error('❌ Error creating user:', err);
    res.status(400).json({ 
      message: 'Failed to create user', 
      error: err.message 
    });
  }
});

// Update user (admin only)
router.put('/:id', adminAuth, async (req, res) => {
  try {
    console.log('👥 Admin - Updating user:', req.params.id);
    
    // Check if trying to change email to an existing one
    if (req.body.email) {
      const existingUser = await User.findOne({ 
        email: req.body.email,
        _id: { $ne: req.params.id }
      });
      if (existingUser) {
        return res.status(400).json({ 
          message: 'Email already exists for another user',
          error: 'DUPLICATE_EMAIL' 
        });
      }
    }
    
    // Don't allow password updates through this endpoint
    const updateData = { ...req.body };
    delete updateData.password;
    
    const user = await User.findByIdAndUpdate(
      req.params.id, 
      updateData, 
      { new: true, runValidators: true }
    ).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    console.log('✅ User updated successfully');
    res.json(user);
  } catch (err) {
    console.error('❌ Error updating user:', err);
    res.status(400).json({ 
      message: 'Failed to update user', 
      error: err.message 
    });
  }
});

// Delete user (admin only)
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    console.log('👥 Admin - Deleting user:', req.params.id);
    
    // Check if user has active bookings
    const Booking = require('../models/Booking');
    const activeBookings = await Booking.countDocuments({
      user: req.params.id,
      status: { $in: ['pending', 'approved', 'booked', 'checked-in'] }
    });
    
    if (activeBookings > 0) {
      return res.status(400).json({ 
        message: 'Cannot delete user with active bookings',
        error: 'ACTIVE_BOOKINGS_EXIST' 
      });
    }
    
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    console.log('✅ User deleted successfully');
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    console.error('❌ Error deleting user:', err);
    res.status(500).json({ 
      message: 'Failed to delete user', 
      error: err.message 
    });
  }
});

// Get user statistics (admin only)
router.get('/stats', adminAuth, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({ isActive: true });
    const inactiveUsers = await User.countDocuments({ isActive: false });
    
    // Get users registered this month
    const thisMonth = new Date();
    thisMonth.setDate(1);
    thisMonth.setHours(0, 0, 0, 0);
    
    const newUsersThisMonth = await User.countDocuments({
      createdAt: { $gte: thisMonth }
    });
    
    // Get users who have bookings
    const Booking = require('../models/Booking');
    const usersWithBookings = await Booking.distinct('user');
    
    res.json({
      total: totalUsers,
      active: activeUsers,
      inactive: inactiveUsers,
      newThisMonth: newUsersThisMonth,
      withBookings: usersWithBookings.length,
      averageBookingsPerUser: totalUsers > 0 ? (usersWithBookings.length / totalUsers * 100).toFixed(1) : 0
    });
  } catch (err) {
    console.error('❌ Error getting user stats:', err);
    res.status(500).json({ message: 'Failed to fetch user statistics' });
  }
});

// Get user details with bookings (admin only)
router.get('/:id/details', adminAuth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Get user's bookings
    const Booking = require('../models/Booking');
    const bookings = await Booking.find({ user: req.params.id })
      .populate('room')
      .sort({ createdAt: -1 });
    
    res.json({
      user,
      bookings,
      totalBookings: bookings.length,
      totalSpent: bookings.reduce((sum, booking) => sum + (booking.totalAmount || 0), 0)
    });
  } catch (err) {
    console.error('❌ Error getting user details:', err);
    res.status(500).json({ message: 'Failed to fetch user details' });
  }
});

module.exports = router;
