// Display a message in the chat
function displayMessage(message, type = 'peer') {
    const messagesContainer = document.getElementById('messages');
    const messageContainer = document.createElement('div');
    messageContainer.classList.add('message', type);
  
    // Message text
    const messageText = document.createElement('div');
    messageText.textContent = message;
  
    // Timestamp
    const timestamp = document.createElement('div');
    const now = new Date();
    const hours = now.getHours() % 12 || 12; // 12-hour format
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const ampm = now.getHours() >= 12 ? 'PM' : 'AM';
    timestamp.textContent = `${hours}:${minutes} ${ampm}`;
    timestamp.classList.add('timestamp');
  
    // Append text and timestamp
    messageContainer.appendChild(messageText);
    messageContainer.appendChild(timestamp);
    messagesContainer.appendChild(messageContainer);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }
  
  // Display a welcome announcement
  function displayAnnouncement(message) {
    const announcementsContainer = document.getElementById('announcements');
    announcementsContainer.textContent = message;
  }
  
  // Display system notifications
  function displayNotification(message) {
    const notificationsContainer = document.getElementById('notifications');
    notificationsContainer.textContent = message;
    notificationsContainer.style.display = 'block';
  
    // Remove notification after 5 seconds
    setTimeout(() => {
      notificationsContainer.style.display = 'none';
      notificationsContainer.textContent = '';
    }, 5000);
  }
  
  // Update UI state (optional helper)
  function updateUI(status) {
    const sendButton = document.getElementById('send-btn');
    const messageInput = document.getElementById('message-input');
    if (status === 'connected') {
      sendButton.disabled = false;
      messageInput.disabled = false;
    } else {
      sendButton.disabled = true;
      messageInput.disabled = true;
    }
  }
  