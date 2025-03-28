const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Cart = require('../models/Cart');
const Product = require('../models/Product');

// Add item to cart
router.post('/', auth, async (req, res) => {
  const { productId, quantity } = req.body;

  if (!productId || !quantity || quantity < 1) {
    return res.status(400).json({ msg: 'Product ID and quantity (minimum 1) are required' });
  }

  try {
    // Verify the product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ msg: 'Product not found' });
    }

    let cartItem = await Cart.findOne({ user: req.user.id, product: productId });
    if (cartItem) {
      cartItem.quantity += quantity;
    } else {
      cartItem = new Cart({
        user: req.user.id,
        product: productId,
        quantity,
      });
    }
    await cartItem.save();
    res.status(201).json(cartItem);
  } catch (err) {
    console.error('Error in /api/cart POST:', err.message, err.stack);
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

// Get user's cart
router.get('/', auth, async (req, res) => {
  try {
    const cart = await Cart.find({ user: req.user.id }).populate('product').lean();
    if (!cart) {
      return res.status(404).json({ msg: 'Cart not found' });
    }
    // Ensure populated product field is valid
    const sanitizedCart = cart.map(item => ({
      ...item,
      product: item.product || { _id: item.product, name: 'Product not found' }
    }));
    res.json(sanitizedCart);
  } catch (err) {
    console.error('Error in /api/cart GET:', err.message, err.stack);
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

// Update cart item quantity
router.put('/:id', auth, async (req, res) => {
  const { quantity } = req.body;
  try {
    let cartItem = await Cart.findOne({ _id: req.params.id, user: req.user.id });
    if (!cartItem) {
      return res.status(404).json({ msg: 'Cart item not found' });
    }
    cartItem.quantity = quantity;
    await cartItem.save();
    res.json(cartItem);
  } catch (err) {
    console.error('Error in /api/cart PUT:', err.message, err.stack);
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

// Remove item from cart
router.delete('/:id', auth, async (req, res) => {
  try {
    const cartItem = await Cart.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    if (!cartItem) {
      return res.status(404).json({ msg: 'Cart item not found' });
    }
    res.json({ msg: 'Cart item removed' });
  } catch (err) {
    console.error('Error in /api/cart DELETE:', err.message, err.stack);
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

module.exports = router;