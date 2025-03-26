const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const auth = require('../middleware/auth');

// Create a new order
router.post('/', auth, async (req, res) => {
  const { items } = req.body;
  try {
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ msg: 'Invalid order items' });
    }

    const tempOrder = new Order({
      user: req.user.id,
      items,
    });
    await tempOrder.populate('items.productId');
    
    const total = tempOrder.items.reduce((sum, item) => {
      if (!item.productId) throw new Error('Product not found');
      return sum + (item.productId.price * item.quantity);
    }, 0);

    const order = new Order({
      user: req.user.id,
      items,
      total,
      status: 'Pending',
    });

    await order.save();
    await order.populate('items.productId');
    res.json(order);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Get all orders for the authenticated user
router.get('/', auth, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id }).populate('items.productId');
    res.json(orders);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Get a specific order by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('items.productId');
    if (!order) {
      return res.status(404).json({ msg: 'Order not found' });
    }
    if (order.user.toString() !== req.user.id) {
      return res.status(403).json({ msg: 'Unauthorized' });
    }
    res.json(order);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;