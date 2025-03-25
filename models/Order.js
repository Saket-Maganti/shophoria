const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  products: [{
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    name: String,
    price: Number,
    quantity: Number
  }],
  total: { type: Number, required: true },
  status: { type: String, default: 'Pending' }, // e.g., "Pending", "Shipped", "Delivered"
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', orderSchema);