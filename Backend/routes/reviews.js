const express = require('express');
const router = express.Router();
const Review = require('../models/Review');
const adminAuth = require('../middleware/adminAuth');
const auth = require('../middleware/auth'); // Add user auth middleware

// @route   GET /api/reviews
// @desc    Get all approved and visible reviews
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { limit = 10, page = 1, sort = 'recent' } = req.query;
    const skip = (page - 1) * parseInt(limit);
    
    let sortOrder = { createdAt: -1 }; // Default: most recent first
    
    if (sort === 'rating') {
      sortOrder = { rating: -1, createdAt: -1 };
    } else if (sort === 'oldest') {
      sortOrder = { createdAt: 1 };
    }

    const reviews = await Review.find({ 
      isApproved: true, 
      isVisible: true 
    })
    .sort(sortOrder)
    .limit(parseInt(limit))
    .skip(skip)
    .select('-email'); // Don't send email to public

    const total = await Review.countDocuments({ 
      isApproved: true, 
      isVisible: true 
    });

    // Calculate average rating
    const avgRatingResult = await Review.aggregate([
      { $match: { isApproved: true, isVisible: true } },
      { $group: { _id: null, avgRating: { $avg: '$rating' }, totalReviews: { $sum: 1 } } }
    ]);

    const stats = avgRatingResult.length > 0 ? {
      averageRating: Math.round(avgRatingResult[0].avgRating * 10) / 10,
      totalReviews: avgRatingResult[0].totalReviews
    } : {
      averageRating: 0,
      totalReviews: 0
    };

    res.json({
      success: true,
      reviews,
      stats,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / parseInt(limit)),
        totalReviews: total,
        hasNext: skip + parseInt(limit) < total,
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error while fetching reviews' 
    });
  }
});

// @route   POST /api/reviews
// @desc    Submit a new review (requires user login OR allows guest)
// @access  Public with optional authentication
router.post('/', async (req, res) => {
  try {
    const { name, email, rating, title, comment, location } = req.body;
    
    // Get user ID from auth token if provided
    let userId = null;
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    
    if (token) {
      try {
        const jwt = require('jsonwebtoken');
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        userId = decoded.id || decoded.userId || decoded.adminId;
        console.log('📝 Review submission from authenticated user:', decoded.email);
      } catch (error) {
        console.log('⚠️ Invalid token provided, treating as guest review');
      }
    }

    console.log('🔍 Review data:', { name, email, rating, title, comment, location, userId });

    // Validation
    if (!name || !email || !rating || !title || !comment) {
      return res.status(400).json({
        success: false,
        message: 'Please fill in all required fields'
      });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: 'Rating must be between 1 and 5'
      });
    }

    // Check for duplicate review from same email within last 24 hours
    const existingReview = await Review.findOne({
      email: email.toLowerCase(),
      createdAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) }
    });

    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: 'You can only submit one review per day from this email. Please try again later.'
      });
    }

    const newReview = new Review({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      rating: parseInt(rating),
      title: title.trim(),
      comment: comment.trim(),
      location: location ? location.trim() : undefined,
      userId: userId, // Optional: Associate with user if authenticated
      isApproved: false // Reviews need admin approval
    });

    await newReview.save();

    res.status(201).json({
      success: true,
      message: 'Thank you for your review! It will be published after admin approval.',
      review: {
        name: newReview.name,
        rating: newReview.rating,
        title: newReview.title,
        comment: newReview.comment,
        location: newReview.location,
        createdAt: newReview.createdAt
      }
    });
  } catch (error) {
    console.error('Error submitting review:', error);
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error while submitting review'
    });
  }
});

// @route   GET /api/reviews/admin
// @desc    Get all reviews for admin (including pending)
// @access  Admin only
router.get('/admin', adminAuth, async (req, res) => {
  try {
    const { status = 'all', limit = 20, page = 1 } = req.query;
    const skip = (page - 1) * parseInt(limit);
    
    let filter = {};
    if (status === 'pending') {
      filter.isApproved = false;
    } else if (status === 'approved') {
      filter.isApproved = true;
    }

    const reviews = await Review.find(filter)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(skip);

    const total = await Review.countDocuments(filter);

    res.json({
      success: true,
      reviews,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / parseInt(limit)),
        total,
        hasNext: skip + parseInt(limit) < total,
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error('Error fetching admin reviews:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error while fetching reviews' 
    });
  }
});

// @route   PUT /api/reviews/:id/approve
// @desc    Approve a review
// @access  Admin only
router.put('/:id/approve', adminAuth, async (req, res) => {
  try {
    const review = await Review.findByIdAndUpdate(
      req.params.id,
      { isApproved: true },
      { new: true }
    );

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    res.json({
      success: true,
      message: 'Review approved successfully',
      review
    });
  } catch (error) {
    console.error('Error approving review:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while approving review'
    });
  }
});

// @route   PUT /api/reviews/:id/reject
// @desc    Reject/hide a review
// @access  Admin only
router.put('/:id/reject', adminAuth, async (req, res) => {
  try {
    const review = await Review.findByIdAndUpdate(
      req.params.id,
      { isApproved: false, isVisible: false },
      { new: true }
    );

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    res.json({
      success: true,
      message: 'Review rejected successfully',
      review
    });
  } catch (error) {
    console.error('Error rejecting review:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while rejecting review'
    });
  }
});

// @route   DELETE /api/reviews/:id
// @desc    Delete a review
// @access  Admin only
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    const review = await Review.findByIdAndDelete(req.params.id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    res.json({
      success: true,
      message: 'Review deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting review:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting review'
    });
  }
});

module.exports = router;
