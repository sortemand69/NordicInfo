const socket = io();
let currentForumIndex = null; // Track the current forum index

// Load existing forums
function loadForums() {
    fetch('/forums')
        .then(response => response.json())
        .then(forums => {
            const forumsContainer = document.getElementById('forums');
            forumsContainer.innerHTML = ''; // Clear existing forums
            forums.forEach((forum, index) => {
                const forumElement = document.createElement('li');
                const creationTime = formatTime(forum.timestamp);
                forumElement.className = 'post';
                forumElement.innerHTML = `<span onclick="joinForum(${index})">${forum.title}</span>
                                          <div class="timestamp">Created: ${creationTime}</div>`;
                forumsContainer.appendChild(forumElement);
            });
        });
}

// Create a new forum
function createForum() {
    const title = document.getElementById('forum-title').value.trim();
    if (title) {
        fetch('/forums', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ title })
        });
        document.getElementById('forum-title').value = ''; // Clear input
    }
}

// Join a forum
function joinForum(index) {
    currentForumIndex = index;
    document.getElementById('chat').style.display = 'block';
    loadChatMessages();
}

// Load chat messages for the current forum
function loadChatMessages() {
    const chatMessagesContainer = document.getElementById('chat-messages');
    chatMessagesContainer.innerHTML = ''; // Clear previous messages
    const messages = forums[currentForumIndex].messages;
    messages.forEach(message => {
        const messageElement = document.createElement('div');
        messageElement.className = 'message';
        const messageTime = formatTime(message.timestamp);
        messageElement.textContent = `${message.username}: ${message.text}`;
        messageElement.innerHTML += `<div class="timestamp">Sent: ${messageTime}</div>`;
        chatMessagesContainer.appendChild(messageElement);
    });
}

// Send a message to the current forum
function sendMessage() {
    const messageInput = document.getElementById('chat-message');
    const text = messageInput.value.trim();
    if (text && currentForumIndex !== null) {
        const message = { username: 'User', text: text, timestamp: Date.now() };
        socket.emit('sendMessage', currentForumIndex, message);
        messageInput.value = ''; // Clear input
    }
}

// Listen for new forums
socket.on('forumCreated', (forum) => {
    loadForums(); // Reload forums when a new one is created
});

// Listen for new messages
socket.on('newMessage', (forumIndex, message) => {
    const chatMessagesContainer = document.getElementById('chat-messages');
    const messageElement = document.createElement('div');
    messageElement.className = 'message';
    const messageTime = formatTime(message.timestamp);
    messageElement.textContent = `${message.username}: ${message.text}`;
    messageElement.innerHTML += `<div class="timestamp">Sent: ${messageTime}</div>`;
    chatMessagesContainer.appendChild(messageElement);
});

// Format timestamp
function formatTime(timestamp) {
    const date = new Date(timestamp);
    return date.toLocaleString(); // Format date and time
}

// Initialize the forum
loadForums();
