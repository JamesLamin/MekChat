# MekChat

A modern real-time chat application with WhatsApp-like features.

## Features

- Real-time messaging with WebSocket
- Dark theme interface
- Message formatting and emoji support
- File sharing and media messages
- Voice messages
- Message reactions and replies
- Read receipts
- Online/offline status

## Tech Stack

- Frontend: HTML5, CSS3, JavaScript
- Backend: Node.js, Express
- Database: MongoDB
- Real-time: Socket.IO
- Authentication: JWT

## Prerequisites

- Node.js >= 14.0.0
- MongoDB
- npm or yarn

## Local Development

1. Clone the repository:
```bash
git clone https://github.com/yourusername/mekchat.git
cd mekchat
```

2. Install dependencies:
```bash
npm install
```

3. Create a .env file:
```
NODE_ENV=development
PORT=3000
MONGODB_URI=your-mongodb-uri
JWT_SECRET=your-jwt-secret
CORS_ORIGIN=http://localhost:3000
```

4. Start the development server:
```bash
npm run dev
```

5. Visit http://localhost:3000 in your browser

## Production Deployment

### Option 1: Deploy to Render

1. Create a new Web Service on Render
2. Connect your GitHub repository
3. Set the following:
   - Build Command: `npm install && npm run build`
   - Start Command: `npm start`
4. Add environment variables in Render dashboard
5. Deploy!

### Option 2: Deploy to Heroku

1. Install Heroku CLI
2. Login to Heroku:
```bash
heroku login
```

3. Create a new Heroku app:
```bash
heroku create mekchat-app
```

4. Set environment variables:
```bash
heroku config:set NODE_ENV=production
heroku config:set JWT_SECRET=your-production-secret
heroku config:set MONGODB_URI=your-production-mongodb-uri
```

5. Deploy:
```bash
git push heroku main
```

## Production Build

To create a production build:

```bash
npm run build
```

This will create optimized assets in the `public/dist` directory.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
