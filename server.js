const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static(path.join(__dirname, 'client')));

io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('join', (username) => {
    console.log(`${username} has joined.`);
  });

  socket.on('message', (data) => {
    socket.broadcast.emit('message', data);
  });

  socket.on('typing', (username) => {
    socket.broadcast.emit('typing', username);
  });

  socket.on('stop-typing', () => {
    socket.broadcast.emit('stop-typing');
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});

server.listen(8080, () => {
  console.log('Server running on http://localhost:8080');
});
