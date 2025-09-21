// Importing dotenv to load environment variables from .env file
import dotenv from "dotenv"
// Importing custom function to connect MongoDB database
import connectDB from "./db/connectDB.js";
// Importing the Express app instance
import { app } from "./app.js";

// Load environment variables from .env file
dotenv.config({ path: "./.env" });

// Connect to the database
connectDB()
.then(()=>{
    // If DB connection is successful, handle app events

    // Listen for any server-related errors
    app.on("error",(error)=>{
        console.log('error', error);
        throw error
    })
    
    // Start the server on given PORT or default 8000
    app.listen(process.env.PORT || 8000, ()=>{
        console.log(`Server is running port : ${process.env.PORT}`)
    })
})
.catch((err)=>{
    // If DB connection fails, log error
    console.log('MONGODB Connection Failed', err);
})


// --------------------------------------------
// Below is the alternative approach (commented out)
// using an async IIFE to connect MongoDB and start server
// --------------------------------------------

// const app = express();
// ( async () => {
//     try {
//       // Connect to MongoDB using Mongoose
//       await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)

//         // Handle errors while starting the app
//         app.on("error",(error)=>{
//             console.log("ERROR", error);
//             throw error  
//         })

//         // Start listening on PORT
//         app.listen(process.env.PORT, ()=>{
//             console.log(`App is listening on port ${process.env.PORT}`);
//         })

//     } catch (error) {
//         console.error("ERROR" ,error)
//         throw error  
//     }
// })()
