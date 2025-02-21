const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
  chatType: {
    type: String,
    enum: ['individual', 'group', 'broadcast'],
    required: true
  },
  name: {
    type: String,
    trim: true,
    required() {
      return this.chatType === 'group' || this.chatType === 'broadcast';
    }
  },
  description: {
    type: String,
    trim: true
  },
  avatar: {
    type: String
  },
  participants: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    role: {
      type: String,
      enum: ['admin', 'member'],
      default: 'member'
    },
    joinedAt: {
      type: Date,
      default: Date.now
    },
    settings: {
      muted: {
        type: Boolean,
        default: false
      },
      muteExpiration: Date,
      pinned: {
        type: Boolean,
        default: false
      },
      customNotificationTone: String,
      disappearingMessages: {
        enabled: {
          type: Boolean,
          default: false
        },
        timer: {
          type: Number,
          default: 0 // time in seconds
        }
      }
    }
  }],
  groupSettings: {
    onlyAdminsCanSend: {
      type: Boolean,
      default: false
    },
    onlyAdminsCanEditInfo: {
      type: Boolean,
      default: true
    },
    onlyAdminsCanAddMembers: {
      type: Boolean,
      default: false
    },
    disappearingMessages: {
      enabled: {
        type: Boolean,
        default: false
      },
      timer: {
        type: Number,
        default: 0
      }
    },
    maxParticipants: {
      type: Number,
      default: 1024
    }
  },
  lastMessage: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Message'
  },
  pinnedMessages: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Message'
  }],
  mediaGallery: {
    photos: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Message'
    }],
    videos: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Message'
    }],
    documents: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Message'
    }]
  },
  callHistory: [{
    type: {
      type: String,
      enum: ['voice', 'video'],
      required: true
    },
    startTime: Date,
    endTime: Date,
    participants: [{
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      joinedAt: Date,
      leftAt: Date,
      status: {
        type: String,
        enum: ['joined', 'missed', 'declined', 'failed']
      }
    }]
  }],
  links: [{
    type: {
      type: String,
      enum: ['call', 'invite'],
      required: true
    },
    code: {
      type: String,
      required: true
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    expiresAt: Date,
    maxUses: Number,
    uses: {
      type: Number,
      default: 0
    }
  }],
  encryption: {
    enabled: {
      type: Boolean,
      default: true
    },
    publicKey: String,
    algorithm: {
      type: String,
      default: 'AES-256-GCM'
    }
  }
}, {
  timestamps: true
});

// Indexes for better query performance
chatSchema.index({ participants: 1 });
chatSchema.index({ 'participants.user': 1, updatedAt: -1 });
chatSchema.index({ chatType: 1 });

// Methods for chat operations
chatSchema.methods.addParticipant = async function (userId, role = 'member') {
  if (this.participants.length >= this.groupSettings.maxParticipants) {
    throw new Error('Maximum participants limit reached');
  }

  if (!this.participants.some((p) => p.user.equals(userId))) {
    this.participants.push({
      user: userId,
      role,
      joinedAt: new Date()
    });
    await this.save();
  }
};

chatSchema.methods.removeParticipant = async function (userId) {
  this.participants = this.participants.filter((p) => !p.user.equals(userId));
  await this.save();
};

chatSchema.methods.promoteToAdmin = async function (userId) {
  const participant = this.participants.find((p) => p.user.equals(userId));
  if (participant) {
    participant.role = 'admin';
    await this.save();
  }
};

chatSchema.methods.updateGroupSettings = async function (settings) {
  Object.assign(this.groupSettings, settings);
  await this.save();
};

chatSchema.methods.generateInviteLink = async function (createdBy, expiresIn = 86400, maxUses = 100) {
  const code = Math.random().toString(36).substring(2, 15);
  this.links.push({
    type: 'invite',
    code,
    createdBy,
    expiresAt: new Date(Date.now() + expiresIn * 1000),
    maxUses
  });
  await this.save();
  return code;
};

chatSchema.methods.generateCallLink = async function (createdBy) {
  const code = Math.random().toString(36).substring(2, 15);
  this.links.push({
    type: 'call',
    code,
    createdBy
  });
  await this.save();
  return code;
};

const Chat = mongoose.model('Chat', chatSchema);
module.exports = Chat;
