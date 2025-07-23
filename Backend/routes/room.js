const express = require('express');
const Room = require('../models/Room');
const auth = require('../middleware/auth');
const router = express.Router();

// Create Room
router.post('/', auth, async (req, res) => {
  try {
    const room = new Room(req.body);
    await room.save();
    res.status(201).json(room);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get all Rooms (public access for users to view available rooms)
router.get('/', async (req, res) => {
  try {
    const { checkIn, checkOut } = req.query;
    
    // If dates provided, filter for available rooms
    if (checkIn && checkOut) {
      // Find rooms that are not booked during the requested period
      const Booking = require('../models/Booking');
      const bookedRoomIds = await Booking.distinct('room', {
        $or: [
          {
            checkIn: { $lte: new Date(checkOut) },
            checkOut: { $gte: new Date(checkIn) }
          }
        ],
        status: { $ne: 'cancelled' }
      });
      
      const availableRooms = await Room.find({
        _id: { $nin: bookedRoomIds },
        status: 'available'
      });
      
      res.json(availableRooms);
    } else {
      // Return all available rooms
      const rooms = await Room.find({ status: 'available' });
      res.json(rooms);
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get Room by ID (public access)
router.get('/:id', async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);
    if (!room) return res.status(404).json({ message: 'Room not found' });
    res.json(room);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update Room
router.put('/:id', auth, async (req, res) => {
  try {
    const room = await Room.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!room) return res.status(404).json({ message: 'Room not found' });
    res.json(room);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete Room
router.delete('/:id', auth, async (req, res) => {
  try {
    const room = await Room.findByIdAndDelete(req.params.id);
    if (!room) return res.status(404).json({ message: 'Room not found' });
    res.json({ message: 'Room deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router; 