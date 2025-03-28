const mongoose = require('mongoose');
const Product = require('./models/Product');

mongoose.connect('mongodb://localhost:27017/shophoria', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.log('MongoDB connection error:', err));

const products = [
  // Smartphones (5 products)
  { name: 'iPhone 14', description: 'Latest iPhone model with A16 Bionic chip and advanced camera system.', price: 999, category: 'Smartphones', images: ['https://images.pexels.com/photos/1092644/pexels-photo-1092644.jpeg?auto=compress&cs=tinysrgb&w=600'] },
  { name: 'Samsung Galaxy S23', description: 'Flagship Samsung phone with Snapdragon 8 Gen 2.', price: 899, category: 'Smartphones', images: ['https://images.pexels.com/photos/788946/pexels-photo-788946.jpeg?auto=compress&cs=tinysrgb&w=600'] },
  { name: 'Google Pixel 7', description: 'Best camera phone with Google Tensor G2.', price: 799, category: 'Smartphones', images: ['https://images.pexels.com/photos/607812/pexels-photo-607812.jpeg?auto=compress&cs=tinysrgb&w=600'] },
  { name: 'OnePlus 11', description: 'Fast and affordable with Hasselblad camera.', price: 699, category: 'Smartphones', images: ['https://images.pexels.com/photos/47261/pexels-photo-47261.jpeg?auto=compress&cs=tinysrgb&w=600'] },
  { name: 'Xiaomi 13', description: 'High performance with Leica optics.', price: 649, category: 'Smartphones', images: ['https://images.pexels.com/photos/1092644/pexels-photo-1092644.jpeg?auto=compress&cs=tinysrgb&w=600'] },

  // Laptops (5 products)
  { name: 'MacBook Pro', description: 'High-performance laptop with M2 Max chip.', price: 1999, category: 'Laptops', images: ['https://images.pexels.com/photos/1229861/pexels-photo-1229861.jpeg?auto=compress&cs=tinysrgb&w=600'] },
  { name: 'Dell XPS 13', description: 'Compact and powerful laptop with 13.4-inch display.', price: 1299, category: 'Laptops', images: ['https://images.pexels.com/photos/18105/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=600'] },
  { name: 'HP Spectre x360', description: 'Convertible laptop with OLED display.', price: 1499, category: 'Laptops', images: ['https://images.pexels.com/photos/2047905/pexels-photo-2047905.jpeg?auto=compress&cs=tinysrgb&w=600'] },
  { name: 'Lenovo ThinkPad X1', description: 'Business laptop with robust security features.', price: 1599, category: 'Laptops', images: ['https://images.pexels.com/photos/374016/pexels-photo-374016.jpeg?auto=compress&cs=tinysrgb&w=600'] },
  { name: 'Asus ROG Zephyrus', description: 'Gaming laptop with RTX 4080 GPU.', price: 1799, category: 'Laptops', images: ['https://images.pexels.com/photos/2582937/pexels-photo-2582937.jpeg?auto=compress&cs=tinysrgb&w=600'] },

  // Sneakers (4 products)
  { name: 'Nike Air Max', description: 'Stylish running shoes with Air cushioning.', price: 120, category: 'Sneakers', images: ['https://images.pexels.com/photos/1598505/pexels-photo-1598505.jpeg?auto=compress&cs=tinysrgb&w=600'] },
  { name: 'Adidas Ultraboost', description: 'Comfortable sneakers with Boost technology.', price: 150, category: 'Sneakers', images: ['https://images.pexels.com/photos/1456706/pexels-photo-1456706.jpeg?auto=compress&cs=tinysrgb&w=600'] },
  { name: 'Puma RS-X', description: 'Retro sneakers with bold design.', price: 110, category: 'Sneakers', images: ['https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=600'] },
  { name: 'New Balance 990', description: 'Classic sneakers with premium comfort.', price: 130, category: 'Sneakers', images: ['https://images.pexels.com/photos/1598508/pexels-photo-1598508.jpeg?auto=compress&cs=tinysrgb&w=600'] },

  // Headphones (4 products)
  { name: 'Sony WH-1000XM5', description: 'Noise-canceling headphones with 30-hour battery life.', price: 349, category: 'Headphones', images: ['https://images.pexels.com/photos/205926/pexels-photo-205926.jpeg?auto=compress&cs=tinysrgb&w=600'] },
  { name: 'Bose QuietComfort 45', description: 'Premium headphones with superior sound.', price: 329, category: 'Headphones', images: ['https://images.pexels.com/photos/577769/pexels-photo-577769.jpeg?auto=compress&cs=tinysrgb&w=600'] },
  { name: 'Apple AirPods Pro', description: 'Wireless earbuds with active noise cancellation.', price: 249, category: 'Headphones', images: ['https://images.pexels.com/photos/3780681/pexels-photo-3780681.jpeg?auto=compress&cs=tinysrgb&w=600'] },
  { name: 'JBL Live 660NC', description: 'Affordable noise-canceling headphones.', price: 199, category: 'Headphones', images: ['https://images.pexels.com/photos/3586187/pexels-photo-3586187.jpeg?auto=compress&cs=tinysrgb&w=600'] },

  // Home Appliances (4 products)
  { name: 'Dyson Vacuum', description: 'Powerful vacuum cleaner with cyclone technology.', price: 499, category: 'Home Appliances', images: ['https://images.pexels.com/photos/38325/vacuum-cleaner-carpet-cleaner-housework-housekeeping-38325.jpeg?auto=compress&cs=tinysrgb&w=600'] },
  { name: 'Instant Pot', description: 'Multi-function cooker with 7-in-1 functionality.', price: 89, category: 'Home Appliances', images: ['https://images.pexels.com/photos/4394135/pexels-photo-4394135.jpeg?auto=compress&cs=tinysrgb&w=600'] },
  { name: 'Nespresso Machine', description: 'Coffee maker for espresso lovers.', price: 199, category: 'Home Appliances', images: ['https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg?auto=compress&cs=tinysrgb&w=600'] },
  { name: 'Philips Air Fryer', description: 'Healthy cooking with air frying technology.', price: 149, category: 'Home Appliances', images: ['https://images.pexels.com/photos/6214477/pexels-photo-6214477.jpeg?auto=compress&cs=tinysrgb&w=600'] },

  // Clothing (5 products)
  { name: 'Levi’s Jeans', description: 'Classic denim jeans with a modern fit.', price: 59, category: 'Clothing', images: ['https://images.pexels.com/photos/996329/pexels-photo-996329.jpeg?auto=compress&cs=tinysrgb&w=600'] },
  { name: 'Uniqlo T-Shirt', description: 'Comfortable cotton tee for everyday wear.', price: 19, category: 'Clothing', images: ['https://images.pexels.com/photos/428338/pexels-photo-428338.jpeg?auto=compress&cs=tinysrgb&w=600'] },
  { name: 'Zara Jacket', description: 'Stylish winter jacket with a sleek design.', price: 89, category: 'Clothing', images: ['https://images.pexels.com/photos/7679720/pexels-photo-7679720.jpeg?auto=compress&cs=tinysrgb&w=600'] },
  { name: 'H&M Sweater', description: 'Cozy sweater for cold days.', price: 39, category: 'Clothing', images: ['https://images.pexels.com/photos/45982/pexels-photo-45982.jpeg?auto=compress&cs=tinysrgb&w=600'] },
  { name: 'Gap Hoodie', description: 'Casual hoodie with a soft feel.', price: 49, category: 'Clothing', images: ['https://images.pexels.com/photos/6311391/pexels-photo-6311391.jpeg?auto=compress&cs=tinysrgb&w=600'] },

  // Books (4 products)
  { name: 'To Kill a Mockingbird', description: 'Classic novel by Harper Lee.', price: 15, category: 'Books', images: ['https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg?auto=compress&cs=tinysrgb&w=600'] },
  { name: '1984 by George Orwell', description: 'Dystopian novel about surveillance.', price: 12, category: 'Books', images: ['https://images.pexels.com/photos/256450/pexels-photo-256450.jpeg?auto=compress&cs=tinysrgb&w=600'] },
  { name: 'The Great Gatsby', description: 'American classic by F. Scott Fitzgerald.', price: 10, category: 'Books', images: ['https://images.pexels.com/photos/261857/pexels-photo-261857.jpeg?auto=compress&cs=tinysrgb&w=600'] },
  { name: 'Pride and Prejudice', description: 'Romantic novel by Jane Austen.', price: 14, category: 'Books', images: ['https://images.pexels.com/photos/137666/pexels-photo-137666.jpeg?auto=compress&cs=tinysrgb&w=600'] },
];

const seedProducts = async () => {
  try {
    await Product.deleteMany({});
    await Product.insertMany(products);
    console.log('Products seeded successfully!');
  } catch (err) {
    console.log('Error seeding products:', err);
  } finally {
    mongoose.connection.close();
  }
};

seedProducts();

// Note: Run this script to re-seed the database with updated image URLs:
// cd D:\shophoria\shophoria
// node seed.js