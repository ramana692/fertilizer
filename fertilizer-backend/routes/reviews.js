const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const Review = require('../models/Review');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = './uploads/reviews';
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    cb(null, 'review-' + Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 1024 * 1024 * 5 }, // 5MB limit
  fileFilter: function (req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
      return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
  }
});

// @desc    Get all reviews for a product
// @route   GET /api/reviews/product/:productId
// @access  Public
router.get('/product/:productId', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    const reviews = await Review.find({ product: req.params.productId })
      .populate('user', 'name avatar')
      .sort('-createdAt')
      .skip(skip)
      .limit(limit);
    
    const total = await Review.countDocuments({ product: req.params.productId });
    
    res.json({
      success: true,
      count: reviews.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      data: reviews
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
});

// @desc    Create a review
// @route   POST /api/reviews
// @access  Private
router.post('/', protect, upload.array('images', 5), async (req, res) => {
  try {
    const { product, rating, title, comment } = req.body;
    
    // Validate required fields
    if (!product || !rating || !title || !comment) {
      return res.status(400).json({ 
        success: false, 
        error: 'Please provide product, rating, title, and comment' 
      });
    }
    
    // Check if rating is valid (1-5)
    if (rating < 1 || rating > 5) {
      return res.status(400).json({ 
        success: false, 
        error: 'Rating must be between 1 and 5' 
      });
    }
    
    // Check if user already reviewed the product
    const existingReview = await Review.findOne({
      user: req.user.userId,
      product: product
    });

    if (existingReview) {
      return res.status(400).json({ 
        success: false, 
        error: 'You have already reviewed this product' 
      });
    }
    
    // Handle file uploads
    const images = [];
    if (req.files && req.files.length > 0) {
      req.files.forEach(file => {
        images.push(file.filename);
      });
    }
    
    // Create review
    const review = await Review.create({
      user: req.user.userId,
      product,
      rating,
      title,
      comment,
      images,
      verifiedPurchase: req.body.verifiedPurchase || false
    });
    
    // Populate user data in the response
    const populatedReview = await Review.findById(review._id).populate('user', 'name avatar');
    
    res.status(201).json({
      success: true,
      data: populatedReview
    });
  } catch (err) {
    console.error(err);
    // Clean up uploaded files if there was an error
    if (req.files && req.files.length > 0) {
      req.files.forEach(file => {
        const filePath = path.join(__dirname, '..', 'uploads', 'reviews', file.filename);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      });
    }
    res.status(500).json({ 
      success: false, 
      error: err.message || 'Server Error' 
    });
  }
});

// @desc    Update a review
// @route   PUT /api/reviews/:id
// @access  Private
router.put('/:id', protect, upload.array('images', 5), async (req, res) => {
  try {
    const { rating, title, comment } = req.body;
    const reviewId = req.params.id;
    
    // Find the review
    let review = await Review.findById(reviewId);
    
    if (!review) {
      return res.status(404).json({
        success: false,
        error: 'Review not found'
      });
    }
    
    // Make sure user is the review owner
    if (review.user.toString() !== req.user.userId) {
      return res.status(401).json({
        success: false,
        error: 'Not authorized to update this review'
      });
    }
    
    // Handle file uploads
    let images = [...review.images];
    if (req.files && req.files.length > 0) {
      // Delete old images if new ones are uploaded
      review.images.forEach(image => {
        const filePath = path.join(__dirname, '..', 'uploads', 'reviews', image);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      });
      
      // Add new images
      images = [];
      req.files.forEach(file => {
        images.push(file.filename);
      });
    }
    
    // Update review
    const updatedReview = await Review.findByIdAndUpdate(
      reviewId,
      {
        rating,
        title,
        comment,
        images,
        verifiedPurchase: req.body.verifiedPurchase || false
      },
      { new: true, runValidators: true }
    ).populate('user', 'name avatar');
    
    res.json({
      success: true,
      data: updatedReview
    });
    
  } catch (err) {
    console.error(err);
    // Clean up uploaded files if there was an error
    if (req.files && req.files.length > 0) {
      req.files.forEach(file => {
        const filePath = path.join(__dirname, '..', 'uploads', 'reviews', file.filename);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      });
    }
    res.status(500).json({ 
      success: false, 
      error: err.message || 'Server Error' 
    });
  }
});

// @desc    Delete a review
// @route   DELETE /api/reviews/:id
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    
    if (!review) {
      return res.status(404).json({
        success: false,
        error: 'Review not found'
      });
    }
    
    // Make sure user is the review owner or admin
    // Only the review owner can delete their review (admin check omitted as JWT doesn't include role)
    if (review.user.toString() !== req.user.userId) {
      return res.status(401).json({
        success: false,
        error: 'Not authorized to delete this review'
      });
    }
    
    // Delete associated images
    if (review.images && review.images.length > 0) {
      review.images.forEach(image => {
        const filePath = path.join(__dirname, '..', 'uploads', 'reviews', image);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      });
    }
    
    // Delete the review
    await review.remove();
    
    res.json({
      success: true,
      data: {}
    });
    
  } catch (err) {
    console.error(err);
    res.status(500).json({ 
      success: false, 
      error: 'Server Error' 
    });
  }
});

// @desc    Like/Unlike a review
// @route   PUT /api/reviews/:id/like
// @access  Private
router.put('/:id/like', protect, async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    
    if (!review) {
      return res.status(404).json({
        success: false,
        error: 'Review not found'
      });
    }
    
    // Check if the review has already been liked
  const likeIndex = review.likes.findIndex(uid => uid.toString() === req.user.userId);
    
    if (likeIndex === -1) {
      // Like the review
  review.likes.push(req.user.userId);
    } else {
      // Unlike the review
      review.likes.splice(likeIndex, 1);
    }
    
    await review.save();
    
    res.json({
      success: true,
      data: {
        likes: review.likes,
        likesCount: review.likes.length
      }
    });
    
  } catch (err) {
    console.error(err);
    res.status(500).json({ 
      success: false, 
      error: 'Server Error' 
    });
  }
});

module.exports = router;
