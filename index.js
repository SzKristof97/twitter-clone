require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
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


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
const authRoutes = require('./routes/auth');
const tweetRoutes = require('./routes/tweets');
const errorHandler = require('./middleware/errorHandler'); // Import the error handler


app.use('/auth', authRoutes);
app.use('/tweets', tweetRoutes);

app.get('/', (req, res) => {
    res.send('Welcome to Twitter Clone!');
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