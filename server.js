const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcrypt');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors()); // Allow cross-origin requests
app.use(bodyParser.json()); // Parse JSON requests

// In-memory storage for users, forums, and messages
let users = [];
let forums = [];

// User Registration
app.post('/register', (req, res) => {
    const { username, password } = req.body;
    const hashedPassword = bcrypt.hashSync(password, 10);
    users.push({ username, password: hashedPassword });
    res.status(201).send('User registered');
});

// User Login
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    const user = users.find(user => user.username === username);
    if (user && bcrypt.compareSync(password, user.password)) {
        res.status(200).send('Login successful');
    } else {
        res.status(401).send('Invalid credentials');
    }
});

// Create a new forum
app.post('/forums', (req, res) => {
    const { title } = req.body;
    const newForum = { title, messages: [], timestamp: Date.now(), owner: req.body.username };
    forums.push(newForum);
    res.status(201).json(newForum);
});

// Get all forums
app.get('/forums', (req, res) => {
    res.json(forums);
});

// Post a message to a specific forum
app.post('/forums/:forumIndex/messages', (req, res) => {
    const forumIndex = req.params.forumIndex;
    const { username, text } = req.body;

    if (forums[forumIndex]) {
        const newMessage = { username, text, timestamp: Date.now() };
        forums[forumIndex].messages.push(newMessage);
        res.status(201).json(newMessage);
    } else {
        res.status(404).send('Forum not found');
    }
});

// Get messages from a specific forum
app.get('/forums/:forumIndex/messages', (req, res) => {
    const forumIndex = req.params.forumIndex;
    if (forums[forumIndex]) {
        res.json(forums[forumIndex].messages);
    } else {
        res.status(404).send('Forum not found');
    }
});

// Delete a forum
app.delete('/forums/:forumIndex', (req, res) => {
    const forumIndex = req.params.forumIndex;
    if (forums[forumIndex]) {
        forums.splice(forumIndex, 1);
        res.status(204).send();
    } else {
        res.status(404).send('Forum not found');
    }
});

// Edit a forum
app.put('/forums/:forumIndex', (req, res) => {
    const forumIndex = req.params.forumIndex;
    const { title } = req.body;

    if (forums[forumIndex]) {
        forums[forumIndex].title = title;
        res.json(forums[forumIndex]);
    } else {
        res.status(404).send('Forum not found');
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
