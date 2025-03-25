const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Order = require('../models/Order');
const Cart = require('../models/Cart');
const mongoose = require('mongoose');

// Get all orders for a user (protected route)
router.get('/', async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret');
    console.log('Fetching orders for user:', decoded.user.id); // Debug
    if (!mongoose.Types.ObjectId.isValid(decoded.user.id)) {
      return res.status(400).json({ msg: 'Invalid user ID' });
    }
    const orders = await Order.find({ userId: decoded.user.id }).populate('items.productId');
    console.log('Fetched orders:', orders); // Debug
    res.json(orders);
  } catch (err) {
    console.error('Error fetching orders:', err.message);
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ msg: 'Token expired, please log in again' });
    }
    res.status(500).json({ msg: 'Server error' });
  }
});

// Get a specific order by ID (protected route)
router.get('/:id', async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret');
    const orderId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      return res.status(400).json({ msg: 'Invalid order ID' });
    }

    if (!mongoose.Types.ObjectId.isValid(decoded.user.id)) {
      return res.status(400).json({ msg: 'Invalid user ID' });
    }

    console.log('Fetching order:', orderId, 'for user:', decoded.user.id); // Debug
    const order = await Order.findOne({ _id: orderId, userId: decoded.user.id }).populate('items.productId');
    if (!order) {
      return res.status(404).json({ msg: 'Order not found' });
    }
    console.log('Fetched order:', order); // Debug
    res.json(order);
  } catch (err) {
    console.error('Error fetching order:', err.message);
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ msg: 'Token expired, please log in again' });
    }
    res.status(500).json({ msg: 'Server error' });
  }
});

// Create a new order from the cart (protected route)
router.post('/', async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret');
    const userId = decoded.user.id;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ msg: 'Invalid user ID' });
    }

    // Fetch the user's cart
    const cart = await Cart.findOne({ userId }).populate('items.productId');
    console.log('Fetched cart for order:', cart); // Debug
    if (!cart || !cart.items || cart.items.length === 0) {
      return res.status(400).json({ msg: 'Cart is empty' });
    }

    // Calculate the total
    const total = cart.items.reduce((sum, item) => {
      return sum + (item.quantity * item.productId.price);
    }, 0);

    // Create a new order
    const order = new Order({
      userId,
      items: cart.items.map(item => ({
        productId: item.productId._id,
        quantity: item.quantity
      })),
      total,
      status: 'Pending'
    });

    await order.save();
    console.log('Created order:', order); // Debug

    // Clear the cart
    cart.items = [];
    await cart.save();
    console.log('Cart cleared after order:', cart); // Debug

    res.json(order);
  } catch (err) {
    console.error('Error creating order:', err.message);
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ msg: 'Token expired, please log in again' });
    }
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;