const mongoose = require('mongoose');
const User = require('./models/User');

mongoose.connect('mongodb://localhost:27017/shophoria', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.log('MongoDB connection error:', err));

const clearUsers = async () => {
  try {
    await User.deleteMany({});
    console.log('All users cleared from the database!');
  } catch (err) {
    console.log('Error clearing users:', err);
  } finally {
    mongoose.connection.close();
  }
};

clearUsers();