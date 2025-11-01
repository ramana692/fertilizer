const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const User = require('../models/User');

// @desc    Get user's wishlist
// @route   GET /api/v1/wishlist
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId)
      .populate('wishlist')
      .select('wishlist');
    
    res.json({
      success: true,
      count: user.wishlist.length,
      data: user.wishlist
    });
  } catch (err) {
    console.error('Wishlist GET error:', err);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
});

// @desc    Add product to wishlist
// @route   POST /api/wishlist
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const { productId } = req.body;
    const user = await User.findById(req.user.userId);
    
    // Check if product is already in wishlist
    if (user.wishlist.includes(productId)) {
      return res.status(400).json({ 
        success: false, 
        error: 'Product already in wishlist' 
      });
    }

    await user.addToWishlist(productId);
    
    res.status(201).json({
      success: true,
      message: 'Product added to wishlist',
      data: user.wishlist
    });
  } catch (err) {
    console.error('Add to wishlist error:', err);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
});

// @desc    Remove product from wishlist
// @route   DELETE /api/v1/wishlist/:productId
// @access  Private
router.delete('/:productId', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    
    // Check if product is in wishlist
    if (!user.wishlist.includes(req.params.productId)) {
      return res.status(400).json({ 
        success: false, 
        error: 'Product not in wishlist' 
      });
    }

    await user.removeFromWishlist(req.params.productId);
    
    res.json({
      success: true,
      message: 'Product removed from wishlist',
      data: user.wishlist
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
});

// @desc    Check if product is in wishlist
// @route   GET /api/v1/wishlist/check/:productId
// @access  Private
router.get('/check/:productId', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    const isInWishlist = user.isInWishlist(req.params.productId);
    
    res.json({
      success: true,
      inWishlist: isInWishlist
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
});

module.exports = router;
