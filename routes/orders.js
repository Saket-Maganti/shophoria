const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Order = require('../models/Order');

// Factory function to create the router with the stripe instance
module.exports = (stripe) => {
  // Middleware to authenticate JWT token
  const auth = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ msg: 'No token, authorization denied' });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded.user;
      next();
    } catch (err) {
      res.status(401).json({ msg: 'Token is not valid' });
    }
  };

  // Create a new order with Stripe Payment Intent
  router.post('/', auth, async (req, res) => {
    const { items, shippingInfo, totalPrice } = req.body;

    try {
      // Create a Payment Intent with Stripe
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(totalPrice * 100), // Amount in cents
        currency: 'usd',
        payment_method_types: ['card'],
      });

      // Create the order
      const order = new Order({
        user: req.user.id,
        items,
        shippingInfo,
        totalPrice,
        paymentIntentId: paymentIntent.id,
      });

      await order.save();

      // Send the client secret to the frontend
      res.json({ order, clientSecret: paymentIntent.client_secret });
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  });

  // Get all orders for the logged-in user
  router.get('/', auth, async (req, res) => {
    try {
      const orders = await Order.find({ user: req.user.id }).populate('items.productId');
      res.json(orders);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  });

  return router;
};