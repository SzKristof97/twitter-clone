const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const CustomError = require('../middleware/CustomError');
const SECRET_KEY = 'your_secret_key';

// Login and Register Logic
router.post('/login', async (req, res, next) => {
    try {
        const { email, password } = req.body;

        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            const error = new CustomError('Invalid email or password', 400);
            throw error; // Throw error to be caught by the error handler
        }

        // Check password
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            const error = new CustomError('Invalid email or password', 400);
            throw error;
        }

        // Generate JWT token
        const token = jwt.sign({ userId: user._id }, SECRET_KEY, { expiresIn: '1h' });
        res.status(200).json({ token, message: 'Login successful' });
    } catch (err) {
        next(err); // Pass error to the error handler middleware
    }
});

router.post('/register', async (req, res, next) => {
    try {
        const { name, email, password } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            const error = new CustomError('User already exists', 400);
            throw error;
        }

        // Create new user
        const newUser = new User({ name, email, password });
        await newUser.save();
        const token = jwt.sign({ userId: newUser._id }, SECRET_KEY, { expiresIn: '1h' });
        res.status(201).json({ token, message: 'User registered successfully' });
    } catch (error) {
        next(error);
    }
});


module.exports = router;
