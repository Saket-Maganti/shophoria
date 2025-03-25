const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Cart = require('../models/Cart');
const mongoose = require('mongoose');

// Middleware to verify token
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret');
    next();
  } catch (err) {
    return res.status(401).json({ msg: 'Invalid or expired token' });
  }
};

// Add item to cart
router.post('/', verifyToken, async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    if (!productId || !quantity) {
      return res.status(400).json({ msg: 'Product ID and quantity are required' });
    }
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ msg: 'Invalid product ID' });
    }

    let cart = await Cart.findOne({ userId: req.user.user.id });
    if (!cart) {
      cart = new Cart({ userId: req.user.user.id, items: [] });
    }

    const itemIndex = cart.items.findIndex(item => item.productId.toString() === productId);
    if (itemIndex > -1) {
      cart.items[itemIndex].quantity += quantity;
    } else {
      cart.items.push({ productId, quantity });
    }

    await cart.save();
    res.json(cart);
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

// Get user's cart
router.get('/', verifyToken, async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user.user.id }).populate('items.productId');
    if (!cart) return res.status(200).json({ userId: req.user.user.id, items: [], total: 0 });
    const total = cart.items.reduce((sum, item) => sum + item.productId.price * item.quantity, 0);
    res.json({ ...cart.toObject(), total });
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

// Update item quantity
router.put('/update/:productId', verifyToken, async (req, res) => {
  try {
    const { quantity } = req.body;
    if (!quantity || quantity < 1) {
      return res.status(400).json({ msg: 'Quantity must be at least 1' });
    }

    const cart = await Cart.findOne({ userId: req.user.user.id });
    if (!cart) return res.status(404).json({ msg: 'Cart not found' });

    const item = cart.items.find(item => item.productId.toString() === req.params.productId);
    if (item) item.quantity = quantity;

    await cart.save();
    res.json(cart);
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

// Remove item from cart
router.delete('/remove/:productId', verifyToken, async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user.user.id });
    if (!cart) return res.status(404).json({ msg: 'Cart not found' });

    cart.items = cart.items.filter(item => item.productId.toString() !== req.params.productId);
    await cart.save();
    res.json(cart);
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

module.exports = router;