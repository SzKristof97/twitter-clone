function isAuthenticated(req, res, next) {
    if (req.session.user) {
        return next();
    }
    return res.redirect('/login'); // Redirect to login if not authenticated
};

module.exports = isAuthenticated;