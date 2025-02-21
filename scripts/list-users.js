require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');

mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log('Connected to MongoDB');
    try {
      const users = await User.find({}, { username: 1, email: 1 });
      console.log('Registered Users:');
      console.log(JSON.stringify(users, null, 2));
    } catch (err) {
      console.error('Error fetching users:', err);
    }
    process.exit(0);
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });
