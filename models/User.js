const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const deviceSchema = new mongoose.Schema({
  deviceId: { type: String, required: true },
  deviceName: { type: String, required: true },
  lastActive: { type: Date, default: Date.now },
  platform: { type: String },
  browserInfo: { type: String },
  isActive: { type: Boolean, default: true }
});

const statusSchema = new mongoose.Schema({
  type: { type: String, enum: ['text', 'photo', 'video', 'voice'], default: 'text' },
  content: { type: String, required: true },
  media: { type: String },
  expiresAt: { type: Date },
  viewedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  createdAt: { type: Date, default: Date.now }
});

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  phoneNumber: {
    type: String,
    unique: true,
    sparse: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  fullName: {
    type: String,
    trim: true,
    default: ''
  },
  displayName: {
    type: String,
    trim: true
  },
  bio: {
    type: String,
    trim: true,
    maxLength: 500,
    default: ''
  },
  avatar: {
    type: String,
    default: ''
  },
  status: {
    type: String,
    enum: ['online', 'offline', 'away', 'busy'],
    default: 'offline'
  },
  lastSeen: {
    type: Date,
    default: Date.now
  },
  statuses: [statusSchema],
  contacts: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    name: String,
    blocked: { type: Boolean, default: false },
    addedAt: { type: Date, default: Date.now }
  }],
  blockedUsers: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    blockedAt: { type: Date, default: Date.now }
  }],
  devices: [deviceSchema],
  privacySettings: {
    lastSeen: { type: String, enum: ['everyone', 'contacts', 'nobody'], default: 'everyone' },
    profilePhoto: { type: String, enum: ['everyone', 'contacts', 'nobody'], default: 'everyone' },
    about: { type: String, enum: ['everyone', 'contacts', 'nobody'], default: 'everyone' },
    status: { type: String, enum: ['everyone', 'contacts', 'nobody'], default: 'everyone' },
    groups: { type: String, enum: ['everyone', 'contacts', 'nobody'], default: 'everyone' }
  },
  securitySettings: {
    twoFactorAuth: { type: Boolean, default: false },
    biometricLock: { type: Boolean, default: false },
    loginAlerts: { type: Boolean, default: true }
  },
  notificationSettings: {
    messageNotifications: { type: Boolean, default: true },
    groupNotifications: { type: Boolean, default: true },
    callNotifications: { type: Boolean, default: true },
    statusNotifications: { type: Boolean, default: true }
  },
  storageSettings: {
    autoDownloadMedia: {
      photos: { type: Boolean, default: true },
      videos: { type: Boolean, default: false },
      documents: { type: Boolean, default: true },
      audio: { type: Boolean, default: true }
    }
  },
  accountSettings: {
    language: { type: String, default: 'en' },
    theme: { type: String, enum: ['light', 'dark'], default: 'light' }
  }
}, {
  timestamps: true
});

// Pre-save middleware to hash password
userSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

// Method to validate password
userSchema.methods.validatePassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

module.exports = mongoose.model('User', userSchema);
