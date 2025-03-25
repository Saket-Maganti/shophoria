const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Wishlist = require('../models/Wishlist');
const mongoose = require('mongoose');

// Add item to wishlist (protected route)
router.post('/', async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret');
    const { productId } = req.body;

    if (!productId) {
      return res.status(400).json({ msg: 'Product ID is required' });
    }

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ msg: 'Invalid product ID' });
    }

    console.log('User ID:', decoded.user.id); // Debug
    console.log('Product ID:', productId); // Debug

    // Find or create the user's wishlist
    let wishlist = await Wishlist.findOne({ userId: decoded.user.id });
    console.log('Wishlist before update:', wishlist); // Debug
    if (!wishlist) {
      wishlist = new Wishlist({ userId: decoded.user.id, items: [] });
    }

    // Check if the product is already in the wishlist
    const itemExists = wishlist.items.some(item => item.productId.toString() === productId);
    if (itemExists) {
      return res.status(400).json({ msg: 'Product already in wishlist' });
    }

    // Add new product to wishlist
    wishlist.items.push({ productId });
    await wishlist.save();
    console.log('Wishlist after save:', wishlist); // Debug
    res.json(wishlist);
  } catch (err) {
    console.error('Error adding to wishlist:', err.message);
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ msg: 'Token expired, please log in again' });
    }
    res.status(500).json({ msg: 'Server error' });
  }
});

// Get user's wishlist (protected route)
router.get('/', async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret');
    console.log('Fetching wishlist for user:', decoded.user.id); // Debug
    if (!mongoose.Types.ObjectId.isValid(decoded.user.id)) {
      return res.status(400).json({ msg: 'Invalid user ID' });
    }
    const wishlist = await Wishlist.findOne({ userId: decoded.user.id }).populate('items.productId');
    console.log('Fetched wishlist:', wishlist); // Debug
    if (!wishlist) {
      return res.status(404).json({ msg: 'Wishlist not found' });
    }
    res.json(wishlist);
  } catch (err) {
    console.error('Error fetching wishlist:', err.message);
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ msg: 'Token expired, please log in again' });
    }
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;