const winston = require('winston');
const Chat = require('../models/Chat');
const Message = require('../models/Message');

// Create logger instance
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'socket.log' }),
    new winston.transports.Console()
  ]
});

class SocketEventHandlers {
  constructor(io) {
    this.io = io;
    this.typingUsers = new Map(); // chatId -> Set of typing user ids
  }

  handleConnection(socket) {
    logger.info(`Client connected: ${socket.id}`);

    // Authenticate user and join their rooms
    const userId = socket.user.id;
    this.joinUserRooms(socket, userId);

    // Handle events
    socket.on('message', (data) => this.handleMessage(socket, data));
    socket.on('typing', (data) => this.handleTyping(socket, data));
    socket.on('reaction', (data) => this.handleReaction(socket, data));
    socket.on('disconnect', () => this.handleDisconnect(socket));
  }

  async joinUserRooms(socket, userId) {
    try {
      const userChats = await Chat.find({ participants: userId });
      userChats.forEach((chat) => {
        socket.join(`chat:${chat._id}`);
      });
    } catch (error) {
      logger.error('Error joining rooms:', error);
    }
  }

  async handleMessage(socket, {
    chatId, content, type = 'text', replyTo = null
  }) {
    try {
      const message = await Message.create({
        chat: chatId,
        sender: socket.user.id,
        content,
        type,
        replyTo
      });

      await message.populate('sender', 'username');

      // Emit to all users in the chat
      this.io.to(`chat:${chatId}`).emit('message', message);

      // Update chat's last message
      await Chat.findByIdAndUpdate(chatId, { lastMessage: message._id });

      logger.info(`Message sent in chat ${chatId} by user ${socket.user.id}`);
    } catch (error) {
      logger.error('Error sending message:', error);
      socket.emit('error', { message: 'Failed to send message' });
    }
  }

  handleTyping(socket, { chatId, isTyping }) {
    if (!this.typingUsers.has(chatId)) {
      this.typingUsers.set(chatId, new Set());
    }

    const typingSet = this.typingUsers.get(chatId);
    if (isTyping) {
      typingSet.add(socket.user.id);
    } else {
      typingSet.delete(socket.user.id);
    }

    // Emit typing status to all users in chat except sender
    socket.to(`chat:${chatId}`).emit('typing', {
      chatId,
      users: Array.from(typingSet)
    });
  }

  async handleReaction(socket, { messageId, reaction }) {
    try {
      const message = await Message.findById(messageId);
      if (!message) return;

      // Update message reactions
      if (!message.reactions) message.reactions = {};
      if (!message.reactions[reaction]) message.reactions[reaction] = new Set();

      const userReactions = message.reactions[reaction];
      if (userReactions.has(socket.user.id)) {
        userReactions.delete(socket.user.id);
      } else {
        userReactions.add(socket.user.id);
      }

      await message.save();

      // Emit reaction update to all users in chat
      this.io.to(`chat:${message.chat}`).emit('reaction', {
        messageId,
        reactions: message.reactions
      });
    } catch (error) {
      logger.error('Error handling reaction:', error);
      socket.emit('error', { message: 'Failed to update reaction' });
    }
  }

  handleDisconnect(socket) {
    logger.info(`Client disconnected: ${socket.id}`);
    // Clean up typing status
    this.typingUsers.forEach((users, chatId) => {
      users.delete(socket.user.id);
      if (users.size === 0) {
        this.typingUsers.delete(chatId);
      }
    });
  }
}

module.exports = SocketEventHandlers;
