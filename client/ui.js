// Function to update UI elements (can be expanded as needed)
function updateUI(status, message) {
    const messagesContainer = document.getElementById('messages');
    const callButton = document.getElementById('call-btn');
    const sendButton = document.getElementById('send-btn');
    const messageInput = document.getElementById('message-input');
    
    // Show status updates in the chat area
    if (status === 'connecting') {
        displayMessage('Connecting to peer...');
        callButton.disabled = true;  // Disable call button while connecting
        sendButton.disabled = true;  // Disable send button
    }
    else if (status === 'connected') {
        displayMessage('You are now connected!');
        callButton.disabled = true;  // Disable call button once connected
        sendButton.disabled = false;  // Enable send button once connected
    }
    else if (status === 'disconnected') {
        displayMessage('Disconnected from peer.');
        callButton.disabled = false; // Enable call button to reconnect
        sendButton.disabled = true;  // Disable send button once disconnected
    }
    else if (status === 'message') {
        displayMessage(message);
    }
    else if (status === 'error') {
        displayMessage('An error occurred. Please try again.');
    }
    else {
        displayMessage('Ready to chat!');
    }
    
    // Update the message input field
    if (messageInput.value.trim() !== "") {
        sendButton.disabled = false; // Enable send button when message is not empty
    } else {
        sendButton.disabled = true;  // Disable send button when message is empty
    }
}

// Helper function to display messages in the chat container
function displayMessage(message) {
    const messagesContainer = document.getElementById('messages');
    const messageElement = document.createElement('p');
    messageElement.textContent = message;
    messagesContainer.appendChild(messageElement);

    // Automatically scroll to the bottom when a new message is added
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// Function to clear chat messages
function clearMessages() {
    const messagesContainer = document.getElementById('messages');
    messagesContainer.innerHTML = '';  // Clear all messages
}

// Function to handle when a new message is received or sent
function handleNewMessage(message, isFromPeer = true) {
    if (isFromPeer) {
        updateUI('message', `Peer: ${message}`);
    } else {
        updateUI('message', `You: ${message}`);
    }
}
