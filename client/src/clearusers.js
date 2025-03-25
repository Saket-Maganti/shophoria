const mongoose = require('mongoose');
const User = require('./models/User');

mongoose.connect('mongodb+srv://admin:mypassword123@cluster0.ezhdj.mongodb.net/shophoria?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const clearUsers = async () => {
  try {
    await User.deleteMany({});
    console.log('All users deleted');
    mongoose.connection.close();
  } catch (err) {
    console.error('Error deleting users:', err);
  }
};

clearUsers();