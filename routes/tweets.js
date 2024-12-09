const express = require('express');
const router = express.Router();
const Tweet = require('../models/Tweet');
const authMiddleware = require('../middleware/auth');

// Create a new tweet
router.post('/', authMiddleware, async (req, res, next) => {
    try {
        const { content } = req.body;

        if (!content) {
            return res.status(400).json({ message: 'Content is required' });
        }

        const tweet = new Tweet({
            content,
            userId: req.user.userId, // User ID from the token (authMiddleware)
        });

        await tweet.save();
        res.status(201).json({ message: 'Tweet created successfully', tweet });
    } catch (err) {
        next(err);
    }
});

// Get all tweets
router.get('/', async (req, res, next) => {
    try {
        const tweets = await Tweet.find().populate('userId', 'name email'); // Fetch user details
        res.status(200).json({ tweets });
    } catch (err) {
        next(err);
    }
});

// Update a tweet
router.put('/:id', authMiddleware, async (req, res, next) => {
    try {
        const { id } = req.params;
        const { content } = req.body;

        if (!content) {
            return res.status(400).json({ message: 'Content is required' });
        }

        // Find the tweet by ID
        const tweet = await Tweet.findById(id);
        if (!tweet) {
            return res.status(404).json({ message: 'Tweet not found' });
        }

        // Check if the user is the owner of the tweet
        if (tweet.userId.toString() !== req.user.userId) {
            return res.status(403).json({ message: 'You can only edit your own tweets' });
        }

        // Update the tweet
        tweet.content = content;
        await tweet.save();

        res.status(200).json({ message: 'Tweet updated successfully', tweet });
    } catch (err) {
        next(err);
    }
});

// Delete a tweet
router.delete('/:id', authMiddleware, async (req, res, next) => {
    try {
        const { id } = req.params;

        // Find the tweet by ID
        const tweet = await Tweet.findById(id);
        if (!tweet) {
            return res.status(404).json({ message: 'Tweet not found' });
        }

        // Check if the user is the owner of the tweet
        if (tweet.userId.toString() !== req.user.userId) {
            return res.status(403).json({ message: 'You can only delete your own tweets' });
        }

        // Delete the tweet
        await Tweet.deleteOne({ _id: id });

        res.status(200).json({ message: 'Tweet deleted successfully' });
    } catch (err) {
        next(err);
    }
});

module.exports = router;
