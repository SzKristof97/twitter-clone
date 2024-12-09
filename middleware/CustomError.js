class CustomError extends Error {
    constructor(message, statusCode, details = null) {
        super(message);
        this.statusCode = statusCode;
        this.details = details;
    }
}

module.exports = CustomError;