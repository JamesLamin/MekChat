const mongoose = require('mongoose');
const Chat = require('../models/Chat');
const Message = require('../models/Message');

class ChatService {
  async createChat(type, participants, name = null, admin = null) {
    const chat = new Chat({
      type,
      participants,
      name: type === 'group' ? name : undefined,
      admin: type === 'group' ? admin : undefined
    });

    await chat.save();
    return chat.populate('participants', 'username email');
  }

  async getChat(chatId, userId) {
    const chat = await Chat.findOne({
      _id: chatId,
      participants: userId
    }).populate('participants', 'username email')
      .populate('lastMessage');

    if (!chat) {
      throw new Error('Chat not found or access denied');
    }

    return chat;
  }

  async getUserChats(userId) {
    return Chat.find({
      participants: userId
    })
      .populate('participants', 'username email')
      .populate('lastMessage')
      .sort({ updatedAt: -1 });
  }

  async addParticipants(chatId, userIds, adminId) {
    const chat = await Chat.findOne({
      _id: chatId,
      type: 'group',
      admin: adminId
    });

    if (!chat) {
      throw new Error('Chat not found or not authorized');
    }

    chat.participants.push(...userIds);
    await chat.save();
    return chat.populate('participants', 'username email');
  }

  async removeParticipant(chatId, userId, adminId) {
    const chat = await Chat.findOne({
      _id: chatId,
      type: 'group',
      admin: adminId
    });

    if (!chat) {
      throw new Error('Chat not found or not authorized');
    }

    chat.participants = chat.participants.filter(
      (p) => p.toString() !== userId.toString()
    );
    await chat.save();
    return chat.populate('participants', 'username email');
  }

  async searchMessages(chatId, userId, query, limit = 20) {
    // Verify user has access to chat
    const chat = await Chat.findOne({
      _id: chatId,
      participants: userId
    });

    if (!chat) {
      throw new Error('Chat not found or access denied');
    }

    return Message.find({
      chat: chatId,
      $text: { $search: query },
      deletedFor: { $ne: userId }
    })
      .sort({ score: { $meta: 'textScore' } })
      .limit(limit)
      .populate('sender', 'username email')
      .populate('replyTo');
  }

  async markMessagesAsRead(chatId, userId, messageIds) {
    await Message.updateMany(
      {
        _id: { $in: messageIds },
        chat: chatId,
        sender: { $ne: userId }
      },
      {
        $addToSet: {
          readBy: {
            user: userId,
            readAt: new Date()
          }
        }
      }
    );
  }

  async deleteMessage(messageId, userId) {
    const message = await Message.findById(messageId);

    if (!message) {
      throw new Error('Message not found');
    }

    if (message.sender.toString() === userId.toString()) {
      // If sender deletes, mark as deleted for everyone
      await Message.deleteOne({ _id: messageId });
    } else {
      // If recipient deletes, only mark as deleted for them
      await Message.findByIdAndUpdate(messageId, {
        $addToSet: { deletedFor: userId }
      });
    }
  }
}

module.exports = new ChatService();
