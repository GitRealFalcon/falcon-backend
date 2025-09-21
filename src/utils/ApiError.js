// Custom Error class for handling API errors consistently
class ApiError extends Error {
    /**
     * @param {number} statusCode - HTTP status code (e.g., 400, 404, 500)
     * @param {string} message - Error message (default: "Something went wrong")
     * @param {Array} errors - Extra error details (optional, default: [])
     * @param {string} stack - Custom stack trace (optional)
     */
    constructor(
        statusCode,
        message = "Something went wrong",
        errors = [],
        stack = ""
    ) {
        // Call parent Error constructor with the message
        super(message);

        this.statusCode = statusCode;  // HTTP status code
        this.data = null;              // No data on error
        this.message = message;        // Error message
        this.success = false;          // Always false for errors
        this.errors = errors;          // Additional error info (validation, etc.)

        // Preserve stack trace for debugging
        if (stack) {
            this.stack = stack;
        } else {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}

export { ApiError };
