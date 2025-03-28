const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Wishlist = require('../models/Wishlist');
const Product = require('../models/Product');

// Add product to wishlist
router.post('/', auth, async (req, res) => {
  const { productId } = req.body;

  try {
    console.log('POST /api/wishlist - Request body:', req.body);
    console.log('POST /api/wishlist - User ID:', req.user.id);

    if (!productId) {
      return res.status(400).json({ msg: 'Product ID is required' });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ msg: 'Product not found' });
    }

    let wishlist = await Wishlist.findOne({ user: req.user.id });
    if (!wishlist) {
      wishlist = new Wishlist({ user: req.user.id, items: [] });
    }

    if (wishlist.items.some(item => item.product.toString() === productId)) {
      return res.status(400).json({ msg: 'Product already in wishlist' });
    }

    wishlist.items.push({ product: productId });
    await wishlist.save();

    res.json(wishlist.items);
  } catch (err) {
    console.error('POST /api/wishlist - Error:', err.message);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Get wishlist
router.get('/', auth, async (req, res) => {
  try {
    console.log('GET /api/wishlist - User ID:', req.user.id);
    let wishlist = await Wishlist.findOne({ user: req.user.id }).populate('items.product');
    if (!wishlist) {
      console.log('GET /api/wishlist - No wishlist found, returning empty array');
      return res.json([]);
    }

    // Filter out items where the product is null (e.g., deleted products)
    const originalItemCount = wishlist.items.length;
    wishlist.items = wishlist.items.filter(item => item.product);
    if (wishlist.items.length !== originalItemCount) {
      console.log('GET /api/wishlist - Filtered out invalid items, saving updated wishlist');
      await wishlist.save();
    }

    console.log('GET /api/wishlist - Returning items:', wishlist.items);
    res.json(wishlist.items);
  } catch (err) {
    console.error('GET /api/wishlist - Error:', err.message);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Remove product from wishlist
router.delete('/:productId', auth, async (req, res) => {
  try {
    console.log('DELETE /api/wishlist - Product ID:', req.params.productId);
    const wishlist = await Wishlist.findOne({ user: req.user.id });
    if (!wishlist) {
      return res.status(404).json({ msg: 'Wishlist not found' });
    }

    wishlist.items = wishlist.items.filter(item => item.product.toString() !== req.params.productId);
    await wishlist.save();

    res.json(wishlist.items);
  } catch (err) {
    console.error('DELETE /api/wishlist - Error:', err.message);
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;