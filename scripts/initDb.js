const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Chat = require('../models/Chat');
const Message = require('../models/Message');

const initializeDb = async () => {
  try {
    // Create test users
    const password = await bcrypt.hash('password123', 10);
    const users = await User.create([
      {
        username: 'john_doe',
        email: 'john@example.com',
        password,
        status: 'online'
      },
      {
        username: 'jane_smith',
        email: 'jane@example.com',
        password,
        status: 'online'
      },
      {
        username: 'bob_wilson',
        email: 'bob@example.com',
        password,
        status: 'offline'
      }
    ]);

    // Create individual chat
    const individualChat = await Chat.create({
      type: 'individual',
      participants: [users[0]._id, users[1]._id]
    });

    // Create group chat
    const groupChat = await Chat.create({
      type: 'group',
      name: 'Test Group',
      participants: users.map((user) => user._id),
      admin: users[0]._id
    });

    // Create some messages
    const messages = await Message.create([
      {
        chat: individualChat._id,
        sender: users[0]._id,
        content: 'Hey Jane!',
        status: 'read',
        readBy: [{
          user: users[1]._id,
          readAt: new Date()
        }]
      },
      {
        chat: individualChat._id,
        sender: users[1]._id,
        content: 'Hi John! How are you?',
        status: 'read',
        readBy: [{
          user: users[0]._id,
          readAt: new Date()
        }]
      },
      {
        chat: groupChat._id,
        sender: users[0]._id,
        content: 'Welcome to the group chat!',
        status: 'delivered',
        readBy: [
          {
            user: users[1]._id,
            readAt: new Date()
          }
        ]
      }
    ]);

    // Update chats with last message
    await Chat.findByIdAndUpdate(individualChat._id, {
      lastMessage: messages[1]._id
    });

    await Chat.findByIdAndUpdate(groupChat._id, {
      lastMessage: messages[2]._id
    });

    console.log('Database initialized with test data');
    process.exit(0);
  } catch (error) {
    console.error('Error initializing database:', error);
    process.exit(1);
  }
};

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/mekchat', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => {
    console.log('Connected to MongoDB');
    return initializeDb();
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });
