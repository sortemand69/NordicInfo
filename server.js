// server.js
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

let forums = []; // Array to store forums

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

// Endpoint to get forums
app.get('/forums', (req, res) => {
    res.json(forums);
});

// Endpoint to create a forum
app.post('/forums', (req, res) => {
    const newForum = {
        title: req.body.title,
        messages: [],
        timestamp: Date.now()
    };
    forums.push(newForum);
    io.emit('forumCreated', newForum); // Emit event to all clients
    res.status(201).json(newForum);
});

// Socket connection
io.on('connection', (socket) => {
    console.log('A user connected');

    // Handle new messages
    socket.on('sendMessage', (forumIndex, message) => {
        forums[forumIndex].messages.push(message);
        io.emit('newMessage', forumIndex, message); // Broadcast new message
    });

    socket.on('disconnect', () => {
        console.log('A user disconnected');
    });
});

// Start server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
