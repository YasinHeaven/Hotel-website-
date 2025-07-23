const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  room: { type: mongoose.Schema.Types.ObjectId, ref: 'Room', required: true },
  checkIn: { type: Date, required: true },
  checkOut: { type: Date, required: true },
  guests: { type: Number, default: 1 },
  status: { 
    type: String, 
    enum: ['pending', 'approved', 'booked', 'checked-in', 'checked-out', 'cancelled', 'no-show', 'denied'], 
    default: 'pending' 
  },
  totalAmount: { type: Number },
  customerInfo: {
    name: String,
    email: String,
    phone: String
  },
  specialRequests: { type: String },
  paymentStatus: { type: String, enum: ['pending', 'paid', 'refunded'], default: 'pending' },
  adminNotes: { type: String },
  approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' },
  approvedAt: { type: Date },
  deniedReason: { type: String },
  contactHistory: [{
    date: { type: Date, default: Date.now },
    type: { type: String, enum: ['booking_confirmation', 'status_update', 'general_inquiry', 'payment_reminder'] },
    contactMethod: { type: String, enum: ['email', 'phone', 'sms'], default: 'email' },
    subject: String,
    message: String,
    sentBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' }
  }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Update the updatedAt field before saving
BookingSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Calculate total amount before saving
BookingSchema.pre('save', async function(next) {
  if (this.isNew || this.isModified('room') || this.isModified('checkIn') || this.isModified('checkOut')) {
    try {
      const Room = require('./Room');
      const room = await Room.findById(this.room);
      if (room) {
        const nights = Math.ceil((this.checkOut - this.checkIn) / (1000 * 60 * 60 * 24));
        this.totalAmount = room.price * nights;
      }
    } catch (error) {
      console.error('Error calculating total amount:', error);
    }
  }
  next();
});

module.exports = mongoose.model('Booking', BookingSchema);
