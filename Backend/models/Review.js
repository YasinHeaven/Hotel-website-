const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false // Make optional to allow guest reviews
  },
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 150
  },
  comment: {
    type: String,
    required: true,
    trim: true,
    maxlength: 1000
  },
  isApproved: {
    type: Boolean,
    default: false
  },
  isVisible: {
    type: Boolean,
    default: true
  },
  location: {
    type: String,
    trim: true,
    maxlength: 100
  }
}, {
  timestamps: true
});

// Index for efficient queries
reviewSchema.index({ isApproved: 1, isVisible: 1, createdAt: -1 });
reviewSchema.index({ rating: -1 });

module.exports = mongoose.model('Review', reviewSchema);
