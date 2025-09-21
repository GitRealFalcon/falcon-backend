// Import Mongoose for MongoDB connection and schema handling
import mongoose from "mongoose";

// Import database name constant from constants.js
import { DB_NAME } from "../constants.js";

// Async function to connect to MongoDB
const connectDB = async () => {
    try {
        // Try connecting to MongoDB using the URI from environment variables
        // and the database name defined in constants.js
        const connectionInstance = await mongoose.connect(
            `${process.env.MONGODB_URI}${DB_NAME}`
        )

        // Log a success message with the host info of the connected DB
        console.log(`\n✅ MongoDB connected !! DB HOST: ${connectionInstance.connection.host}`);
       
    } catch (error) {
        // If there is any connection error, log it
        console.error("❌ MONGODB CONNECTION ERROR ", error);

        // Exit the process with failure (1 = error code)
        process.exit(1);
    }
}

// Export the function so it can be used in other files (e.g., index.js)
export default connectDB;
