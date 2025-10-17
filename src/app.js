// Importing required dependencies
import express from "express";         // Framework for building server and APIs
import cors from "cors";               // Middleware for handling cross-origin requests
import cookieParser from "cookie-parser"; // Middleware for parsing cookies

// Create an Express app instance
const app = express();
// Enable CORS (Cross-Origin Resource Sharing)
app.use(cors({
    origin: process.env.CORS_ORIGIN, // Allow requests only from this origin (set in .env)
    credentials: true                // Allow sending cookies and authentication headers
}))
// Middleware to parse JSON data from request body
app.use(express.json({ limit: "16kb" })) // Limit JSON payload to 16kb
// Middleware to parse URL-encoded data (e.g., form submissions)
app.use(express.urlencoded({ extended: true, limit: "16kb" }))
// Middleware to serve static files from "public" folder (images, CSS, JS, etc.)
app.use(express.static("public"))
// Middleware to parse cookies from the request
app.use(cookieParser())

//routes import
import userRouter from "./routes/user.routes.js"
import videoRouter from "./routes/video.routes.js"
import playlistRoutes from "./routes/playlist.routes.js"
import CommentRouter from "./routes/comment.routes.js";


//routes declaration
app.use("/api/v1/users", userRouter) //http://localhost:8000/api/v1/users/
app.use("/api/v1/videos", videoRouter) //http://localhost:8000/api/v1/videos/
app.use("/api/v1/playlists", playlistRoutes) //http://localhost:8000/api/v1/playlists/
app.use("/api/v1/comments", CommentRouter) //http://localhost:8000/api/v1/comments/


// Export the app instance so it can be used in other files
export { app }
