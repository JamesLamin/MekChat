const mongoose = require('mongoose');

const statusSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  content: {
    type: String,
    trim: true
  },
  mediaType: {
    type: String,
    enum: ['text', 'image', 'video', 'gif'],
    default: 'text'
  },
  media: {
    url: String,
    thumbnail: String,
    mimeType: String,
    duration: Number, // for videos
    dimensions: {
      width: Number,
      height: Number
    }
  },
  background: {
    color: String,
    gradient: String,
    fontColor: String
  },
  caption: String,
  mentions: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number],
      default: [0, 0]
    },
    name: String
  },
  privacy: {
    type: String,
    enum: ['all_contacts', 'selected_contacts', 'hide_from'],
    default: 'all_contacts'
  },
  visibleTo: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  hiddenFrom: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  seenBy: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    seenAt: {
      type: Date,
      default: Date.now
    }
  }],
  replies: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    content: String,
    timestamp: {
      type: Date,
      default: Date.now
    },
    emoji: String
  }],
  expiresAt: {
    type: Date,
    default() {
      return new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours from now
    }
  }
}, {
  timestamps: true
});

// Indexes for better query performance
statusSchema.index({ user: 1, createdAt: -1 });
statusSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Methods for status operations
statusSchema.methods.markAsSeen = async function (userId) {
  if (!this.seenBy.some((seen) => seen.user.equals(userId))) {
    this.seenBy.push({ user: userId });
    await this.save();
  }
};

statusSchema.methods.addReply = async function (userId, content, emoji) {
  this.replies.push({
    user: userId,
    content,
    emoji
  });
  await this.save();
};

statusSchema.methods.updatePrivacy = async function (privacy, visibleTo = [], hiddenFrom = []) {
  this.privacy = privacy;
  if (privacy === 'selected_contacts') {
    this.visibleTo = visibleTo;
  } else if (privacy === 'hide_from') {
    this.hiddenFrom = hiddenFrom;
  }
  await this.save();
};

const Status = mongoose.model('Status', statusSchema);
module.exports = Status;
