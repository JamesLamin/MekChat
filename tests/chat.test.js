const request = require('supertest');
const app = require('../app');
const Chat = require('../models/Chat');
const User = require('../models/User');
const { generateToken } = require('../utils/auth');

describe('Chat API', () => {
  let token;
  let user;

  beforeEach(async () => {
    // Create test user
    user = await User.create({
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123'
    });
    token = generateToken(user);
  });

  describe('GET /api/chats', () => {
    it('should return user chats', async () => {
      // Create a test chat
      await Chat.create({
        type: 'individual',
        participants: [user._id]
      });

      const response = await request(app)
        .get('/api/chats')
        .set('x-auth-token', token);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(1);
    });

    it('should return 401 if not authenticated', async () => {
      const response = await request(app)
        .get('/api/chats');

      expect(response.status).toBe(401);
    });
  });

  describe('POST /api/chat', () => {
    it('should create a new individual chat', async () => {
      const otherUser = await User.create({
        username: 'other',
        email: 'other@example.com',
        password: 'password123'
      });

      const response = await request(app)
        .post('/api/chat')
        .set('x-auth-token', token)
        .send({
          type: 'individual',
          participantId: otherUser._id
        });

      expect(response.status).toBe(201);
      expect(response.body.type).toBe('individual');
      expect(response.body.participants).toHaveLength(2);
    });
  });
});
