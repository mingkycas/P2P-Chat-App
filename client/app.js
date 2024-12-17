const socket = io();

const startScreen = document.getElementById('start-screen');
const chatRoom = document.getElementById('chat-room');
const usernameInput = document.getElementById('username-input');
const startButton = document.getElementById('start-btn');
const messageInput = document.getElementById('message-input');
const sendButton = document.getElementById('send-btn');
const messagesContainer = document.getElementById('messages');
const typingIndicator = document.getElementById('typing-indicator');

let username = "";

// Start the chatroom
startButton.addEventListener('click', () => {
  username = usernameInput.value.trim();
  if (username) {
    socket.emit('join', username);
    startScreen.classList.remove('active');
    chatRoom.classList.add('active');
  } else {
    alert("Please enter your username.");
  }
});

// Typing indicator
let typingTimeout;

messageInput.addEventListener('input', () => {
  socket.emit('typing', username);
  clearTimeout(typingTimeout);
  typingTimeout = setTimeout(() => {
    socket.emit('stop-typing');
  }, 1000);
});

messageInput.addEventListener('blur', () => {
  socket.emit('stop-typing');
});

// Send a message
sendButton.addEventListener('click', () => {
  const message = messageInput.value.trim();
  if (message) {
    socket.emit('message', { username, message });
    displayMessage(`You: ${message}`, 'you');
    messageInput.value = '';
    socket.emit('stop-typing');
  }
});

// Receive Messages
socket.on('message', ({ username: sender, message }) => {
  displayMessage(`${sender}: ${message}`, 'peer');
});

// Display Typing Indicator
socket.on('typing', (user) => {
  typingIndicator.textContent = `${user} is typing...`;
});

socket.on('stop-typing', () => {
  typingIndicator.textContent = '';
});

// Display Messages
function displayMessage(message, type) {
  const msg = document.createElement('div');
  msg.textContent = message;
  msg.classList.add('message', type);
  messagesContainer.appendChild(msg);
  messagesContainer.scrollTop = messagesContainer.scrollHeight;
}
