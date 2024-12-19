const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static(path.join(__dirname, 'client')));

io.on('connection', (socket) => {
  console.log('A user connected.');

  // Handle when a user joins the chat
  socket.on('join', (username) => {
    console.log(`${username} has joined the chat.`);
    socket.broadcast.emit('join', username); // Notify others
  });

  // Handle messages
  socket.on('message', (data) => {
    io.emit('message', data); // Broadcast to all users
  });

  // Typing indicator
  socket.on('typing', (username) => {
    socket.broadcast.emit('typing', username);
  });

  socket.on('stop-typing', () => {
    socket.broadcast.emit('stop-typing');
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log('A user disconnected.');
  });
});

server.listen(8080, () => {
  console.log('Server is running on http://localhost:8080');
});
