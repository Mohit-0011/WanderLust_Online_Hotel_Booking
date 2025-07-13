// Import the built-in Error class and extend it to create a custom error class
/**
 * Custom error class extending built-in Error class
 * @param {number} statusCode - HTTP status code
 * @param {string} message - Error message
 */
class ExpressError extends Error {
  // Constructor to initialize the custom error with status code and message
  constructor(statusCode, message) {
    super(); // Call the parent class (Error) constructor
    this.statusCode = statusCode; // Store the HTTP status code
    this.message = message; // Store the error message
  }
}

// Export the custom error class for use in other files
module.exports = ExpressError;
