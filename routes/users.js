const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Get all registered users
router.get('/', async (req, res) => {
    try {
        const users = await User.find({}, 'name'); // Fetch only the 'name' field
        res.status(200).json({ users });
    } catch (err) {
        console.error('Error fetching users:', err);
        res.status(500).json({ error: 'Failed to fetch users' });
    }
});

module.exports = router;
