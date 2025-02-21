const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  chat: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Chat',
    required: true
  },
  content: {
    type: String,
    trim: true
  },
  messageType: {
    type: String,
    enum: ['text', 'image', 'video', 'audio', 'document', 'location', 'contact', 'sticker', 'gif'],
    default: 'text'
  },
  formatting: {
    bold: Boolean,
    italic: Boolean,
    strikethrough: Boolean,
    monospace: Boolean
  },
  media: {
    url: String,
    thumbnail: String,
    mimeType: String,
    fileName: String,
    fileSize: Number,
    duration: Number, // for audio/video
    dimensions: {
      width: Number,
      height: Number
    }
  },
  quotedMessage: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Message'
  },
  mentions: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  reactions: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    emoji: String,
    timestamp: {
      type: Date,
      default: Date.now
    }
  }],
  starred: {
    type: Boolean,
    default: false
  },
  forwarded: {
    type: Boolean,
    default: false
  },
  edited: {
    type: Boolean,
    default: false
  },
  editHistory: [{
    content: String,
    timestamp: Date
  }],
  disappearingTimer: {
    type: Number, // time in seconds
    default: 0
  },
  readBy: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    timestamp: {
      type: Date,
      default: Date.now
    }
  }],
  deliveredTo: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    timestamp: {
      type: Date,
      default: Date.now
    }
  }],
  status: {
    type: String,
    enum: ['sent', 'delivered', 'read', 'failed', 'deleted'],
    default: 'sent'
  }
}, {
  timestamps: true
});

// Indexes for better query performance
messageSchema.index({ chat: 1, createdAt: -1 });
messageSchema.index({ sender: 1, createdAt: -1 });

// Methods for message operations
messageSchema.methods.markAsRead = async function (userId) {
  if (!this.readBy.some((read) => read.user.equals(userId))) {
    this.readBy.push({ user: userId });
    await this.save();
  }
};

messageSchema.methods.addReaction = async function (userId, emoji) {
  const existingReaction = this.reactions.find((reaction) => reaction.user.equals(userId));

  if (existingReaction) {
    existingReaction.emoji = emoji;
    existingReaction.timestamp = new Date();
  } else {
    this.reactions.push({ user: userId, emoji });
  }

  await this.save();
};

messageSchema.methods.edit = async function (newContent) {
  this.editHistory.push({
    content: this.content,
    timestamp: new Date()
  });

  this.content = newContent;
  this.edited = true;
  await this.save();
};

messageSchema.methods.delete = async function () {
  this.status = 'deleted';
  this.content = null;
  this.media = null;
  await this.save();
};

const Message = mongoose.model('Message', messageSchema);
module.exports = Message;
