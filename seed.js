const mongoose = require('mongoose');
const Product = require('./models/Product');
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

const products = [
  {
    name: 'Laptop',
    description: 'A high-performance laptop for work and gaming.',
    price: 999.99,
    category: 'Electronics',
    images: ['https://via.placeholder.com/300'],
  },
  {
    name: 'Headphones',
    description: 'Noise-cancelling over-ear headphones.',
    price: 199.99,
    category: 'Electronics',
    images: ['https://via.placeholder.com/300'],
  },
  {
    name: 'T-Shirt',
    description: 'Comfortable cotton t-shirt in black.',
    price: 29.99,
    category: 'Clothing',
    images: ['https://via.placeholder.com/300'],
  },
];

const seedProducts = async () => {
  try {
    await Product.deleteMany(); // Clear existing products
    await Product.insertMany(products);
    console.log('Products seeded successfully!');
    process.exit();
  } catch (err) {
    console.error('Error seeding products:', err);
    process.exit(1);
  }
};

seedProducts();