const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/productRoutes');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/shophoria')
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

app.listen(5001, () => console.log('Server running on port 5001'));