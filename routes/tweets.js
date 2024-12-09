const express = require('express');
const router = express.Router();
const Tweet = require('../models/Tweet');
const isAuthenticated = require('../middleware/auth');

// Create a new tweet
router.post('/', isAuthenticated, async (req, res) => {
    try {
        const { content } = req.body;

        if (!content) {
            return res.status(400).json({ error: 'Content is required' });
        }

        const tweet = new Tweet({
            content,
            userId: req.session.user.id, // User ID from session
        });

        await tweet.save();
        res.status(201).json({ message: 'Tweet created successfully', tweet });
    } catch (err) {
        console.error('Error creating tweet:', err);
        res.status(500).json({ error: 'Failed to create tweet' });
    }
});

// Get all tweets
router.get('/', async (req, res) => {
    try {
        const tweets = await Tweet.find()
            .populate('userId', 'name email') // Fetch user details
            .sort({ createdAt: -1 }); // Latest tweets first
        res.status(200).json({ tweets });
    } catch (err) {
        console.error('Error fetching tweets:', err);
        res.status(500).json({ error: 'Failed to fetch tweets' });
    }
});

// Update a tweet
router.put('/:id', isAuthenticated, async (req, res) => {
    try {
        const { id } = req.params;
        const { content } = req.body;

        if (!content) {
            return res.status(400).json({ error: 'Content is required' });
        }

        const tweet = await Tweet.findById(id);
        if (!tweet) {
            return res.status(404).json({ error: 'Tweet not found' });
        }

        if (tweet.userId.toString() !== req.session.user.id) {
            return res.status(403).json({ error: 'You can only edit your own tweets' });
        }

        tweet.content = content;
        await tweet.save();

        res.status(200).json({ message: 'Tweet updated successfully', tweet });
    } catch (err) {
        console.error('Error updating tweet:', err);
        res.status(500).json({ error: 'Failed to update tweet' });
    }
});

// Delete a tweet
router.delete('/:id', isAuthenticated, async (req, res) => {
    try {
        const { id } = req.params;
        const tweet = await Tweet.findById(id);

        if (!tweet) {
            return res.status(404).json({ error: 'Tweet not found' });
        }

        if (tweet.userId.toString() !== req.session.user.id) {
            return res.status(403).json({ error: 'You can only delete your own tweets' });
        }

        await Tweet.deleteOne({ _id: id });
        res.status(200).json({ message: 'Tweet deleted successfully' });
    } catch (err) {
        console.error('Error deleting tweet:', err);
        res.status(500).json({ error: 'Failed to delete tweet' });
    }
});

// Like a tweet
router.post('/:id/like', isAuthenticated, async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.session.user.id; // User ID from the session

        const tweet = await Tweet.findById(id);

        if (!tweet) {
            return res.status(404).json({ error: 'Tweet not found' });
        }

        // Check if the user already liked the tweet, if yes remove the like
        if (tweet.likedBy.includes(userId)) {
            tweet.likes--;
            tweet.likedBy.pull(userId);
            await tweet.save();
            return res.status(200).json({ message: 'Tweet unliked', likes: tweet.likes, dislikes: tweet.dislikes });
        }

        // If the user disliked the tweet previously, remove the dislike
        if (tweet.dislikedBy.includes(userId)) {
            tweet.dislikes--;
            tweet.dislikedBy.pull(userId);
        }

        // Add the like
        tweet.likes++;
        tweet.likedBy.push(userId);

        await tweet.save();
        res.status(200).json({ message: 'Tweet liked', likes: tweet.likes, dislikes: tweet.dislikes });
    } catch (err) {
        console.error('Error liking tweet:', err);
        res.status(500).json({ error: 'Failed to like tweet' });
    }
});

// Dislike a tweet
router.post('/:id/dislike', isAuthenticated, async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.session.user.id; // User ID from the session

        const tweet = await Tweet.findById(id);

        if (!tweet) {
            return res.status(404).json({ error: 'Tweet not found' });
        }

        // Check if the user already disliked the tweet, if yes remove the dislike
        if (tweet.dislikedBy.includes(userId)) {
            tweet.dislikes--;
            tweet.dislikedBy.pull(userId);
            await tweet.save();
            return res.status(200).json({ message: 'Tweet undisliked', likes: tweet.likes, dislikes: tweet.dislikes });
        }

        // If the user liked the tweet previously, remove the like
        if (tweet.likedBy.includes(userId)) {
            tweet.likes--;
            tweet.likedBy.pull(userId);
        }

        // Add the dislike
        tweet.dislikes++;
        tweet.dislikedBy.push(userId);

        await tweet.save();
        res.status(200).json({ message: 'Tweet disliked', likes: tweet.likes, dislikes: tweet.dislikes });
    } catch (err) {
        console.error('Error disliking tweet:', err);
        res.status(500).json({ error: 'Failed to dislike tweet' });
    }
});



module.exports = router;
