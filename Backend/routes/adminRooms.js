const express = require('express');
const Room = require('../models/Room');
const adminAuth = require('../middleware/adminAuth');
const router = express.Router();

// Get all rooms (admin view - includes all rooms regardless of status)
router.get('/', adminAuth, async (req, res) => {
  try {
    console.log('🏨 Admin - Getting all rooms');
    const rooms = await Room.find().sort({ number: 1 });
    console.log(`✅ Found ${rooms.length} rooms`);
    res.json(rooms);
  } catch (err) {
    console.error('❌ Error getting rooms:', err);
    res.status(500).json({ message: 'Failed to fetch rooms', error: err.message });
  }
});

// Create new room (admin only)
router.post('/', adminAuth, async (req, res) => {
  try {
    console.log('🏨 Admin - Creating new room:', req.body);
    
    // Check if room number already exists
    const existingRoom = await Room.findOne({ number: req.body.number });
    if (existingRoom) {
      return res.status(400).json({ 
        message: 'Room number already exists',
        error: 'DUPLICATE_ROOM_NUMBER' 
      });
    }
    
    const room = new Room({
      number: req.body.number,
      type: req.body.type,
      price: req.body.price,
      status: req.body.status || 'available',
      description: req.body.description || '',
      capacity: req.body.capacity || 1,
      size: req.body.size || '20 sqm',
      bedType: req.body.bedType || 'Single Bed',
      amenities: req.body.amenities || ['WiFi', 'Air Conditioning', 'TV'],
      images: req.body.images || [],
      features: req.body.features || {
        wifi: true,
        airConditioning: true,
        minibar: false,
        balcony: false,
        cityView: false,
        oceanView: false
      }
    });
    
    await room.save();
    console.log('✅ Room created successfully:', room._id);
    res.status(201).json(room);
  } catch (err) {
    console.error('❌ Error creating room:', err);
    res.status(400).json({ 
      message: 'Failed to create room', 
      error: err.message 
    });
  }
});

// Update room (admin only)
router.put('/:id', adminAuth, async (req, res) => {
  try {
    console.log('🏨 Admin - Updating room:', req.params.id);
    
    // Check if trying to change room number to an existing one
    if (req.body.number) {
      const existingRoom = await Room.findOne({ 
        number: req.body.number,
        _id: { $ne: req.params.id }
      });
      if (existingRoom) {
        return res.status(400).json({ 
          message: 'Room number already exists',
          error: 'DUPLICATE_ROOM_NUMBER' 
        });
      }
    }
    
    const room = await Room.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true, runValidators: true }
    );
    
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }
    
    console.log('✅ Room updated successfully');
    res.json(room);
  } catch (err) {
    console.error('❌ Error updating room:', err);
    res.status(400).json({ 
      message: 'Failed to update room', 
      error: err.message 
    });
  }
});

// Delete room (admin only)
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    console.log('🏨 Admin - Deleting room:', req.params.id);
    
    // Check if room has active bookings
    const Booking = require('../models/Booking');
    const activeBookings = await Booking.countDocuments({
      room: req.params.id,
      status: { $in: ['pending', 'approved', 'booked', 'checked-in'] }
    });
    
    if (activeBookings > 0) {
      return res.status(400).json({ 
        message: 'Cannot delete room with active bookings',
        error: 'ACTIVE_BOOKINGS_EXIST' 
      });
    }
    
    const room = await Room.findByIdAndDelete(req.params.id);
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }
    
    console.log('✅ Room deleted successfully');
    res.json({ message: 'Room deleted successfully' });
  } catch (err) {
    console.error('❌ Error deleting room:', err);
    res.status(500).json({ 
      message: 'Failed to delete room', 
      error: err.message 
    });
  }
});

// Get room statistics (admin only)
router.get('/stats', adminAuth, async (req, res) => {
  try {
    const totalRooms = await Room.countDocuments();
    const availableRooms = await Room.countDocuments({ status: 'available' });
    const occupiedRooms = await Room.countDocuments({ status: 'occupied' });
    const maintenanceRooms = await Room.countDocuments({ status: 'maintenance' });
    
    // Group rooms by type
    const roomTypes = await Room.aggregate([
      { $group: { _id: '$type', count: { $sum: 1 } } }
    ]);
    
    res.json({
      total: totalRooms,
      available: availableRooms,
      occupied: occupiedRooms,
      maintenance: maintenanceRooms,
      occupancyRate: totalRooms > 0 ? ((occupiedRooms / totalRooms) * 100).toFixed(1) : 0,
      roomTypes
    });
  } catch (err) {
    console.error('❌ Error getting room stats:', err);
    res.status(500).json({ message: 'Failed to fetch room statistics' });
  }
});

module.exports = router;
