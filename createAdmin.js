const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

mongoose.connect('mongodb://localhost:27017/shophoria', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.log('MongoDB connection error:', err));

const createAdmin = async () => {
  try {
    const email = 'admin@example.com';
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log('Admin user already exists');
      return;
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('admin123', salt);

    const admin = new User({
      name: 'Admin User',
      email,
      password: hashedPassword,
      role: 'admin'
    });

    await admin.save();
    console.log('Admin user created successfully!');
  } catch (err) {
    console.log('Error creating admin user:', err);
  } finally {
    mongoose.connection.close();
  }
};

createAdmin();