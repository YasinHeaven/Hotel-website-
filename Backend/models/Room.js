const mongoose = require('mongoose');

const RoomSchema = new mongoose.Schema({
  number: { type: String, required: true, unique: true },
  type: { type: String, required: true },
  price: { type: Number, required: true },
  status: { type: String, enum: ['available', 'booked', 'maintenance'], default: 'available' },
  description: { type: String },
  capacity: { type: Number, default: 2 },
  amenities: [String],
  images: [String],
  size: String, // e.g., "25 sqm"
  bedType: String, // e.g., "King Size", "Twin Beds"
  features: {
    wifi: { type: Boolean, default: true },
    airConditioning: { type: Boolean, default: true },
    minibar: { type: Boolean, default: false },
    balcony: { type: Boolean, default: false },
    cityView: { type: Boolean, default: false },
    oceanView: { type: Boolean, default: false }
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Room', RoomSchema);
