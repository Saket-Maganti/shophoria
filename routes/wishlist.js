// routes/wishlist.js
const express = require('express');
const router = express.Router();
const Wishlist = require('../models/Wishlist');
const { protect } = require('../middleware/authMiddleware');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

// Middleware to validate token
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

// Get wishlist items
router.get('/', verifyToken, async (req, res) => {
    try {
        const wishlist = await Wishlist.findOne({ userId: req.user.user.id }).populate('items.productId');
        res.status(200).json(wishlist || { userId: req.user.user.id, items: [] });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});

// Add item to wishlist
router.post('/add', verifyToken, async (req, res) => {
    try {
        const { productId } = req.body;
        if (!productId || !mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(400).json({ msg: 'Invalid product ID' });
        }

        let wishlist = await Wishlist.findOne({ userId: req.user.user.id });
        if (!wishlist) {
            wishlist = new Wishlist({ userId: req.user.user.id, items: [] });
        }

        if (wishlist.items.some(item => item.productId.toString() === productId)) {
            return res.status(400).json({ msg: 'Product already in wishlist' });
        }

        wishlist.items.push({ productId });
        await wishlist.save();
        res.status(200).json(wishlist);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});

// Remove item from wishlist
router.delete('/remove/:productId', verifyToken, async (req, res) => {
    try {
        const wishlist = await Wishlist.findOne({ userId: req.user.user.id });
        if (!wishlist) return res.status(404).json({ msg: 'Wishlist not found' });

        wishlist.items = wishlist.items.filter(item => item.productId.toString() !== req.params.productId);
        await wishlist.save();
        res.status(200).json(wishlist);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});

module.exports = router;