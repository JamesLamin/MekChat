const express = require('express');

const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');
const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;
const bcrypt = require('bcryptjs');

// Configure multer for status media uploads
const storage = multer.diskStorage({
  destination(req, file, cb) {
    const type = file.mimetype.startsWith('image') ? 'images'
      : file.mimetype.startsWith('video') ? 'videos' : 'voice';
    cb(null, `uploads/status/${type}`);
  },
  filename(req, file, cb) {
    cb(null, `${req.user.userId}-${Date.now()}${path.extname(file.originalname)}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      'image/jpeg', 'image/png', 'image/gif',
      'video/mp4', 'video/mpeg',
      'audio/mpeg', 'audio/wav'
    ];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type'));
    }
  }
});

// Update privacy settings
router.put('/privacy', auth, async (req, res) => {
  try {
    const {
      lastSeen, profilePhoto, about, status, groups
    } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user.userId,
      {
        $set: {
          'privacySettings.lastSeen': lastSeen,
          'privacySettings.profilePhoto': profilePhoto,
          'privacySettings.about': about,
          'privacySettings.status': status,
          'privacySettings.groups': groups
        }
      },
      { new: true }
    ).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update security settings
router.put('/security', auth, async (req, res) => {
  try {
    const { twoFactorAuth, biometricLock, loginAlerts } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user.userId,
      {
        $set: {
          'securitySettings.twoFactorAuth': twoFactorAuth,
          'securitySettings.biometricLock': biometricLock,
          'securitySettings.loginAlerts': loginAlerts
        }
      },
      { new: true }
    ).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update notification settings
router.put('/notifications', auth, async (req, res) => {
  try {
    const settings = req.body;
    const user = await User.findByIdAndUpdate(
      req.user.userId,
      { $set: { notificationSettings: settings } },
      { new: true }
    ).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update storage settings
router.put('/storage', auth, async (req, res) => {
  try {
    const settings = req.body;
    const user = await User.findByIdAndUpdate(
      req.user.userId,
      { $set: { storageSettings: settings } },
      { new: true }
    ).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Post a new status
router.post('/status', auth, upload.single('media'), async (req, res) => {
  try {
    const { content, type = 'text' } = req.body;
    const status = {
      type,
      content,
      media: req.file ? `/uploads/status/${type}s/${req.file.filename}` : undefined,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours from now
    };

    const user = await User.findByIdAndUpdate(
      req.user.userId,
      { $push: { statuses: status } },
      { new: true }
    ).select('-password');

    res.json(user.statuses[user.statuses.length - 1]);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user's status list
router.get('/status', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId)
      .select('statuses')
      .populate('statuses.viewedBy', 'username avatar');
    res.json(user.statuses);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Mark status as viewed
router.post('/status/:statusId/view', auth, async (req, res) => {
  try {
    const { statusId } = req.params;
    await User.updateOne(
      { 'statuses._id': statusId },
      { $addToSet: { 'statuses.$.viewedBy': req.user.userId } }
    );
    res.json({ message: 'Status marked as viewed' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Block/Unblock user
router.post('/block/:userId', auth, async (req, res) => {
  try {
    const userToBlock = await User.findById(req.params.userId);
    if (!userToBlock) {
      return res.status(404).json({ message: 'User not found' });
    }

    const user = await User.findById(req.user.userId);
    const isBlocked = user.blockedUsers.some((b) => b.user.toString() === req.params.userId);

    if (isBlocked) {
      await User.findByIdAndUpdate(req.user.userId, {
        $pull: { blockedUsers: { user: req.params.userId } }
      });
      res.json({ message: 'User unblocked' });
    } else {
      await User.findByIdAndUpdate(req.user.userId, {
        $push: { blockedUsers: { user: req.params.userId } }
      });
      res.json({ message: 'User blocked' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Add/Update contact
router.post('/contacts', auth, async (req, res) => {
  try {
    const { userId, name } = req.body;
    const user = await User.findById(req.user.userId);

    const contactIndex = user.contacts.findIndex((c) => c.user.toString() === userId);
    if (contactIndex > -1) {
      user.contacts[contactIndex].name = name;
    } else {
      user.contacts.push({ user: userId, name });
    }

    await user.save();
    res.json(user.contacts);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get contacts list
router.get('/contacts', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId)
      .populate('contacts.user', 'username avatar status lastSeen');
    res.json(user.contacts);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Search users
router.get('/search', auth, async (req, res) => {
  try {
    const { query } = req.query;
    const users = await User.find({
      $or: [
        { username: { $regex: query, $options: 'i' } },
        { fullName: { $regex: query, $options: 'i' } },
        { phoneNumber: { $regex: query, $options: 'i' } }
      ]
    }).select('username fullName avatar status');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Change phone number
router.put('/phone', auth, async (req, res) => {
  try {
    const { phoneNumber } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user.userId,
      { $set: { phoneNumber } },
      { new: true }
    ).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete account
router.delete('/account', auth, async (req, res) => {
  try {
    const { password } = req.body;
    const user = await User.findById(req.user.userId);

    const isValid = await user.validatePassword(password);
    if (!isValid) {
      return res.status(400).json({ message: 'Invalid password' });
    }

    // Delete user's files
    const mediaTypes = ['avatars', 'status/images', 'status/videos', 'status/voice'];
    for (const type of mediaTypes) {
      const dir = path.join('uploads', type);
      try {
        const files = await fs.readdir(dir);
        for (const file of files) {
          if (file.startsWith(req.user.userId)) {
            await fs.unlink(path.join(dir, file));
          }
        }
      } catch (err) {
        console.error(`Error deleting files from ${dir}:`, err);
      }
    }

    // Delete user
    await User.findByIdAndDelete(req.user.userId);
    res.json({ message: 'Account deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Register device
router.post('/devices', auth, async (req, res) => {
  try {
    const {
      deviceId, deviceName, platform, browserInfo
    } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user.userId,
      {
        $push: {
          devices: {
            deviceId,
            deviceName,
            platform,
            browserInfo,
            lastActive: new Date()
          }
        }
      },
      { new: true }
    ).select('devices');
    res.json(user.devices);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get device list
router.get('/devices', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('devices');
    res.json(user.devices);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Logout device
router.post('/devices/:deviceId/logout', auth, async (req, res) => {
  try {
    await User.updateOne(
      { _id: req.user.userId, 'devices.deviceId': req.params.deviceId },
      { $set: { 'devices.$.isActive': false } }
    );
    res.json({ message: 'Device logged out' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
