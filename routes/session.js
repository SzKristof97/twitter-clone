const express = require('express');
const router = express.Router();

router.get('/session', (req, res) => {
    if (req.session && req.session.user) {
        return res.json({ user: req.session.user });
    }
    res.status(401).json({ error: 'Unauthorized' });
});

module.exports = router;