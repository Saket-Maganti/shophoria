// models/Wishlist.js
const mongoose = require('mongoose');

const wishlistSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    products: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
    }]
}, { timestamps: true });

module.exports = mongoose.model('Wishlist', wishlistSchema);

// routes/wishlistRoutes.js
const express = require('express');
const router = express.Router();
const Wishlist = require('../models/Wishlist');
const { protect } = require('../middleware/authMiddleware');

// Add to wishlist
router.post('/add', protect, async (req, res) => {
    try {
        let wishlist = await Wishlist.findOne({ user: req.user._id });
        if (!wishlist) {
            wishlist = new Wishlist({ user: req.user._id, products: [] });
        }
        if (!wishlist.products.includes(req.body.productId)) {
            wishlist.products.push(req.body.productId);
        }
        await wishlist.save();
        res.status(200).json(wishlist);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Remove from wishlist
router.delete('/remove/:productId', protect, async (req, res) => {
    try {
        const wishlist = await Wishlist.findOne({ user: req.user._id });
        if (wishlist) {
            wishlist.products = wishlist.products.filter(
                (id) => id.toString() !== req.params.productId
            );
            await wishlist.save();
        }
        res.status(200).json(wishlist);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Get user wishlist
router.get('/', protect, async (req, res) => {
    try {
        const wishlist = await Wishlist.findOne({ user: req.user._id }).populate('products');
        res.status(200).json(wishlist);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
