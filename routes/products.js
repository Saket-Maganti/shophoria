const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Product = require('../models/Product');

// Middleware to check if user is admin
const isAdmin = async (req, res, next) => {
  try {
    const user = await require('../models/User').findById(req.user.id);
    if (user.role !== 'admin') {
      return res.status(403).json({ msg: 'Access denied: Admins only' });
    }
    next();
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};

// Get all products
router.get('/', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    console.error('Error in /api/products:', err);
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

// Add a new product (admin only)
router.post('/', auth, isAdmin, async (req, res) => {
  const { name, description, price, category, images } = req.body;

  if (!name || !description || !price || !category) {
    return res.status(400).json({ msg: 'Name, description, price, and category are required' });
  }

  try {
    const product = new Product({
      name,
      description,
      price,
      category,
      images: images || []
    });
    await product.save();
    res.status(201).json(product);
  } catch (err) {
    console.error('Error in /api/products POST:', err);
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

// Update a product (admin only)
router.put('/:id', auth, isAdmin, async (req, res) => {
  const { name, description, price, category, images } = req.body;

  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ msg: 'Product not found' });
    }

    product.name = name || product.name;
    product.description = description || product.description;
    product.price = price || product.price;
    product.category = category || product.category;
    product.images = images || product.images;

    await product.save();
    res.json(product);
  } catch (err) {
    console.error('Error in /api/products PUT:', err);
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

// Delete a product (admin only)
router.delete('/:id', auth, isAdmin, async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ msg: 'Product not found' });
    }
    res.json({ msg: 'Product deleted' });
  } catch (err) {
    console.error('Error in /api/products DELETE:', err);
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

module.exports = router;