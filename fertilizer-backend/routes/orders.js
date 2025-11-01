const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const User = require('../models/User');
const { protect } = require('../middleware/auth');

// Create new order
router.post('/', protect, async (req, res) => {
  try {
    const { items, totalAmount, shippingAddress, paymentMethod } = req.body;
    
    console.log('Creating order:', { items, totalAmount, shippingAddress, paymentMethod });
    
    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'No items in order' });
    }
    
    // Normalize payment method to uppercase
    const normalizedPaymentMethod = paymentMethod ? paymentMethod.toUpperCase() : 'CARD';
    
    const order = new Order({
      user: req.user.userId,
      items,
      totalAmount,
      shippingAddress,
      paymentMethod: normalizedPaymentMethod,
      orderStatus: 'PROCESSING',
      paymentStatus: 'PAID' // Automatically mark as paid for demo purposes
    });

    await order.save();

    // Update user's orders array
    await User.findByIdAndUpdate(
      req.user.userId,
      { $push: { orders: order._id } }
    );

    res.status(201).json({ order, message: 'Order placed successfully' });
  } catch (error) {
    console.error('Order creation error:', error);
    res.status(500).json({ message: error.message || 'Server error' });
  }
});

// Get all user's orders
router.get('/', protect, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.userId })
      .populate('items.product')
      .sort('-createdAt');
    res.json({ orders });
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user's orders (alternative route)
router.get('/my-orders', protect, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.userId })
      .populate('items.product')
      .sort('-createdAt');
    res.json({ orders });
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get specific order
router.get('/:id', protect, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('items.product');
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order.user.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Cancel order
router.put('/:id/cancel', protect, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order.user.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    if (order.orderStatus !== 'PLACED') {
      return res.status(400).json({ message: 'Order cannot be cancelled' });
    }

    order.orderStatus = 'CANCELLED';
    await order.save();

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Check if user purchased a specific product
router.get('/check-purchase/:productId', protect, async (req, res) => {
  try {
    const { productId } = req.params;
    const userId = req.user.userId;

    const order = await Order.findOne({
      user: userId,
      'items.product': productId,
    });

    res.json({ hasPurchased: !!order });
  } catch (error) {
    console.error('Check purchase error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});
 
module.exports = router;