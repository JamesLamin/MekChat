class SimpleSocketEventHandlers {
  constructor(io) {
    this.io = io;
    this.connectedUsers = new Map(); // userId -> socket
  }

  handleConnection(socket) {
    console.log(`Client connected: ${socket.id}`);

    // Store user connection
    const { userId } = socket.user;
    this.connectedUsers.set(userId, socket);

    // Handle message event
    socket.on('message', (data) => {
      console.log('Message received:', data);
      // Broadcast to all clients except sender
      socket.broadcast.emit('message', {
        username: data.username,
        message: data.message
      });
    });

    // Handle disconnect
    socket.on('disconnect', () => {
      console.log(`Client disconnected: ${socket.id}`);
      this.connectedUsers.delete(userId);
    });
  }
}

module.exports = SimpleSocketEventHandlers;
