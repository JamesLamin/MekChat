const express = require('express');

const router = express.Router();
const multer = require('multer');
const path = require('path');
const { body } = require('express-validator');
const auth = require('../middleware/auth');
const validate = require('../middleware/validate');
const chatService = require('../services/chatService');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
    cb(null, `${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`);
  }
});

const upload = multer({
  storage,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 5 * 1024 * 1024 // 5MB default
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = (process.env.ALLOWED_FILE_TYPES || '').split(',');
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type'));
    }
  }
});

// Get user's chats
router.get('/chats', auth, async (req, res) => {
  try {
    const chats = await chatService.getUserChats(req.user.id);
    res.json(chats);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Create new chat
router.post('/chat', [
  auth,
  body('type').isIn(['individual', 'group']),
  body('participantIds').isArray(),
  body('name').if(body('type').equals('group')).notEmpty(),
  validate
], async (req, res) => {
  try {
    const { type, participantIds, name } = req.body;
    const chat = await chatService.createChat(
      type,
      [req.user.id, ...participantIds],
      name,
      type === 'group' ? req.user.id : null
    );
    res.status(201).json(chat);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Add participants to group chat
router.post('/chat/:chatId/participants', [
  auth,
  body('participantIds').isArray(),
  validate
], async (req, res) => {
  try {
    const chat = await chatService.addParticipants(
      req.params.chatId,
      req.body.participantIds,
      req.user.id
    );
    res.json(chat);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Remove participant from group chat
router.delete('/chat/:chatId/participants/:userId', auth, async (req, res) => {
  try {
    const chat = await chatService.removeParticipant(
      req.params.chatId,
      req.params.userId,
      req.user.id
    );
    res.json(chat);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Send message
router.post('/chat/:chatId/message', [
  auth,
  body('content').notEmpty(),
  body('type').isIn(['text', 'image', 'video', 'file', 'voice']),
  validate
], async (req, res) => {
  try {
    const message = await chatService.sendMessage(
      req.params.chatId,
      req.user.id,
      req.body
    );
    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Upload file/media
router.post('/chat/:chatId/upload', [
  auth,
  upload.single('file')
], async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const fileData = {
      type: req.file.mimetype.startsWith('image/') ? 'image'
        : req.file.mimetype.startsWith('video/') ? 'video' : 'file',
      content: req.file.filename,
      fileMetadata: {
        originalName: req.file.originalname,
        size: req.file.size,
        mimeType: req.file.mimetype
      }
    };

    const message = await chatService.sendMessage(
      req.params.chatId,
      req.user.id,
      fileData
    );
    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Mark messages as read
router.post('/chat/:chatId/read', [
  auth,
  body('messageIds').isArray(),
  validate
], async (req, res) => {
  try {
    await chatService.markMessagesAsRead(
      req.params.chatId,
      req.user.id,
      req.body.messageIds
    );
    res.json({ message: 'Messages marked as read' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Search messages in chat
router.get('/chat/:chatId/search', [
  auth,
  body('query').notEmpty(),
  validate
], async (req, res) => {
  try {
    const messages = await chatService.searchMessages(
      req.params.chatId,
      req.user.id,
      req.query.q
    );
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete message
router.delete('/chat/:chatId/message/:messageId', auth, async (req, res) => {
  try {
    await chatService.deleteMessage(req.params.messageId, req.user.id);
    res.json({ message: 'Message deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
