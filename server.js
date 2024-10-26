const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('public'));

// In-memory user storage
let users = {};

// Register route
app.post('/register', (req, res) => {
    const { username, password } = req.body;
    if (users[username]) {
        return res.status(400).send('User already exists');
    }
    users[username] = password;
    res.send('User registered successfully');
});

// Login route
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    if (users[username] && users[username] === password) {
        return res.send('Login successful');
    }
    res.status(401).send('Invalid username or password');
});

// Start server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
