require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const session = require('express-session');
const path = require('path');
const Tweet = require('./models/Tweet');
const app = express();
const PORT = process.env.PORT || 3000;


if(process.env.NODE_ENV !== 'test') {
    // Connect to MongoDB
    mongoose
        .connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })
        .then(() => console.log('Connected to MongoDB'))
        .catch((err) => console.error('Error connecting to MongoDB:', err));
}

// Serve static files from public directory
app.use(express.static(path.join(__dirname, 'public')));


// Parsers
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
const authRoutes = require('./routes/auth');
const tweetRoutes = require('./routes/tweets');
const sessionRoutes = require('./routes/session');
const errorHandler = require('./middleware/errorHandler'); // Import the error handler

app.use(session({
    secret: process.env.SESSION_SECRET || 'your_secret_key',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }, // Set to true if using HTTPS
}));

app.use('/api/auth', authRoutes);
app.use('/api/tweets', tweetRoutes);
app.use('/api', sessionRoutes);

// Catch-all route to serve the index.html by default
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/views/index.html'));
});

// Login route
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/views/login.html'));
});

// Register route
app.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/views/register.html'));
});

// Catch-all route for unknown routes
app.use((req, res, next) => {
    const error = new Error('Not Found');
    error.status = 404;
    next(error);
});


// Error handler middleware (must be after routes)
app.use(errorHandler);

// Server
if(process.env.NODE_ENV !== 'test') {
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
}

module.exports = app; // Export the app for testing