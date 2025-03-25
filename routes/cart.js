const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Cart = require('../models/Cart');
const mongoose = require('mongoose');

// Add item to cart (protected route)
router.post('/', async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret');
    const { productId, quantity } = req.body;

    if (!productId || !quantity) {
      return res.status(400).json({ msg: 'Product ID and quantity are required' });
    }

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ msg: 'Invalid product ID' });
    }

    console.log('User ID:', decoded.user.id); // Debug
    console.log('Product ID:', productId, 'Quantity:', quantity); // Debug

    // Find or create the user's cart
    let cart = await Cart.findOne({ userId: decoded.user.id });
    console.log('Cart before update:', cart); // Debug
    if (!cart) {
      cart = new Cart({ userId: decoded.user.id, items: [] });
    }

    // Check if the product is already in the cart
    const itemIndex = cart.items.findIndex(item => item.productId.toString() === productId);
    if (itemIndex > -1) {
      // Update quantity if product exists
      cart.items[itemIndex].quantity += quantity;
    } else {
      // Add new product to cart
      cart.items.push({ productId, quantity });
    }

    await cart.save();
    console.log('Cart after save:', cart); // Debug
    res.json(cart);
  } catch (err) {
    console.error('Error adding to cart:', err.message);
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ msg: 'Token expired, please log in again' });
    }
    res.status(500).json({ msg: 'Server error' });
  }
});

// Get user's cart (protected route)
router.get('/', async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret');
    console.log('Fetching cart for user:', decoded.user.id); // Debug
    if (!mongoose.Types.ObjectId.isValid(decoded.user.id)) {
      return res.status(400).json({ msg: 'Invalid user ID' });
    }
    const cart = await Cart.findOne({ userId: decoded.user.id }).populate('items.productId');
    console.log('Fetched cart:', cart); // Debug
    if (!cart) {
      return res.status(404).json({ msg: 'Cart not found' });
    }
    res.json(cart);
  } catch (err) {
    console.error('Error fetching cart:', err.message);
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ msg: 'Token expired, please log in again' });
    }
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;