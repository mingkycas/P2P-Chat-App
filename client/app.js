const socket = io();

// DOM Elements
const startScreen = document.getElementById('start-screen');
const chatRoom = document.getElementById('chat-room');
const usernameInput = document.getElementById('username-input');
const startButton = document.getElementById('start-btn');
const messageInput = document.getElementById('message-input');
const sendButton = document.getElementById('send-btn');

let username = "";

// Start the chatroom
startButton.addEventListener('click', () => {
  if (!username) {
    username = usernameInput.value.trim();
    if (username) {
      socket.emit('join', username); // Notify the server about the username
      startScreen.classList.remove('active'); // Hide start screen
      chatRoom.classList.add('active'); // Show chatroom
      displayAnnouncement(`Welcome, ${username}!`); // Show welcome message
    } else {
      alert('Please enter a username.');
    }
  }
});

// Handle 'join' event from the server
socket.on('join', (newUser) => {
  if (newUser !== username) { // Avoid duplicating your own "has joined" notification
    displayNotification(`${newUser} has joined the chat.`);
  }
});

// Send a message
sendButton.addEventListener('click', () => {
  const message = messageInput.value.trim();
  if (message) {
    socket.emit('message', { username, message }); // Send message to the server
    displayMessage(`${username}: ${message}`, 'you'); // Display your message as 'you'
    messageInput.value = ''; // Clear the input field
    socket.emit('stop-typing'); // Stop the typing indicator
  }
});

// Handle incoming messages
socket.on('message', ({ username: sender, message }) => {
  // Only display messages from others, not your own
  if (sender !== username) {
    displayMessage(`${sender}: ${message}`, 'peer'); // Display the message as a peer message
  }
});

// Typing indicator
messageInput.addEventListener('input', () => {
  socket.emit('typing', username);
});

messageInput.addEventListener('blur', () => {
  socket.emit('stop-typing');
});

// Handle typing events
socket.on('typing', (user) => {
  const typingIndicator = document.getElementById('typing-indicator');
  typingIndicator.textContent = `${user} is typing...`;
});

socket.on('stop-typing', () => {
  const typingIndicator = document.getElementById('typing-indicator');
  typingIndicator.textContent = '';
});
