const mongoose = require('mongoose');

const TweetSchema = new mongoose.Schema({
    content: { type: String, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    createdAt: { type: Date, default: Date.now },
    likes: { type: Number, default: 0 },
    dislikes: { type: Number, default: 0 },
    likedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // Track users who liked
    dislikedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // Track users who disliked
    originalTweetId: { type: mongoose.Schema.Types.ObjectId, ref: 'Tweet', default: null }, // Original tweet for retweets
});

module.exports = mongoose.model('Tweet', TweetSchema);
