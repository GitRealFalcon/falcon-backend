// Utility class to standardize API responses
class ApiResponse {
    /**
     * @param {number} statusCode - HTTP status code (e.g., 200, 404, 500)
     * @param {any} data - The actual response payload (object, array, etc.)
     * @param {string} message - Optional message (default: "Success")
     */
    constructor(statusCode, data, message = "Success") {
        this.statusCode = statusCode;     // HTTP status code
        this.data = data;                 // Response payload
        this.message = message;           // Message (default "Success")
        this.success = statusCode < 400;  // Boolean flag (true if status < 400)
    }
}

// Example usage:
// return new ApiResponse(200, { user }, "User fetched successfully");

export { ApiResponse };
