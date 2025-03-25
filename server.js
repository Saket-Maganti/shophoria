require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

console.log('STRIPE_SECRET_KEY:', process.env.STRIPE_SECRET_KEY); // Debug: Log the key
if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is not defined in the .env file');
}
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
const authRoutes = require('./routes/auth');
console.log('authRoutes loaded:', !!authRoutes); // Debug
const productRoutes = require('./routes/products');
console.log('productRoutes loaded:', !!productRoutes); // Debug
const orderRoutes = require('./routes/orders');
console.log('orderRoutes loaded:', !!orderRoutes); // Debug
const wishlistRoutes = require('./routes/wishlist');
console.log('wishlistRoutes loaded:', !!wishlistRoutes); // Debug
const cartRoutes = require('./routes/cart');
console.log('cartRoutes loaded:', !!cartRoutes); // Debug

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/wishlist', wishlistRoutes); // Ensure this line is present
app.use('/api/cart', cartRoutes);

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log('MongoDB connection error:', err));

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});