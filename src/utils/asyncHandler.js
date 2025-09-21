// Higher-order function to handle async errors in Express routes
// It wraps route handlers and automatically forwards errors to Express error middleware
const asyncHandler = (requestHandler) => {
    return (req, res, next) => {
        // Ensure that any rejected promise is caught and passed to "next()"
        Promise.resolve(requestHandler(req, res, next))
               .catch((err) => next(err));
    }
}

// Exporting so it can be reused in routes/controllers
export { asyncHandler };


// --------------------------------------------
// Alternative approach (commented out)
// This version directly handles errors by sending a JSON response
// instead of forwarding them to centralized error middleware
// --------------------------------------------

// const asyncHandler = (fn) => async (req, res, next) => {
//     try {
//         await fn(req, res, next);
//     } catch (error) {
//         res.status(error.code || 500).json({
//             success: false,
//             message: error.message
//         })
//     }
// }
