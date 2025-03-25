const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

// Get all products
router.get('/', async (req, res) => {
  try {
    const { sort } = req.query;
    let sortOption = {};

    if (sort === 'priceLowToHigh') {
      sortOption = { price: 1 };
    } else if (sort === 'priceHighToLow') {
      sortOption = { price: -1 };
    } else if (sort === 'ratingHighToLow') {
      sortOption = { rating: -1 };
    } else if (sort === 'ratingLowToHigh') {
      sortOption = { rating: 1 };
    }

    const products = await Product.find().sort(sortOption);
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get a single product by ID
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create a new product (admin only)
router.post('/', async (req, res) => {
  const product = new Product({
    name: req.body.name,
    description: req.body.description,
    price: req.body.price,
    category: req.body.category,
    images: req.body.images,
    rating: req.body.rating || 0,
  });

  try {
    const newProduct = await product.save();
    res.status(201).json(newProduct);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;