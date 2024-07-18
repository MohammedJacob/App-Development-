const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const app = express();
const port = 3000;

// Middleware to parse the body of the request
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files (HTML, CSS)
app.use(express.static('public'));

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/userDB', { useNewUrlParser: true, useUnifiedTopology: true });

// Define the User schema
const userSchema = new mongoose.Schema({
    username: String,
    password: String
});

const User = mongoose.model('User', userSchema);

// Route to handle GET request to the sign-up page
app.get('/signup', (req, res) => {
    res.sendFile(__dirname + '/public/signup.html');
});

// Route to handle POST request for sign-up
app.post('/signup', (req, res) => {
    const newUser = new User({
        username: req.body.username,
        password: req.body.password
    });

    newUser.save((err) => {
        if (err) {
            res.send('Error signing up.');
        } else {
            res.send('Sign up successful!');
        }
    });
});

// Route to handle GET request to the login page
app.get('/login', (req, res) => {
    res.sendFile(__dirname + '/public/login.html');
});

// Route to handle POST request for login
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    User.findOne({ username: username, password: password }, (err, foundUser) => {
        if (err) {
            res.send('Error logging in.');
        } else {
            if (foundUser) {
                res.send('Login successful!');
            } else {
                res.send('Invalid username or password.');
            }
        }
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
