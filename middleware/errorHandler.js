module.exports = (err, req, res, next) => {
    console.error(err.stack); // Log the error stack trace (useful for debugging).

    const statusCode = err.statusCode || 500; // Default to HTTP 500 (Internal Server Error).
    const message = err.message || 'An unexpected error occurred.';

    res.status(statusCode).json({
        success: false,
        error: {
            message,
            details: err.details || null, // Optional: Include additional error details.
        },
    });
};
