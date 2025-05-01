import express from "express";
import cors from "cors";
import "dotenv/config"; // Loading environment variables
import connectDB from "./config/mongodb.js";
import connectCloudinary from "./config/cloudinary.js";
import userRouter from "./routes/userRoute.js";
import doctorRouter from "./routes/doctorRoute.js";
import adminRouter from "./routes/adminRoute.js";
import pharmacistRouter from "./routes/pharmacistRoute.js";

// Initialize app
const app = express();
const port = process.env.PORT || 4000;

// Connect to MongoDB and Cloudinary
connectDB();
connectCloudinary();

// Middlewares
app.use(express.json()); // To parse incoming JSON requests
app.use(cors()); // To handle CORS (Cross-Origin Resource Sharing)

// API Routes
app.use("/api/user", userRouter); 
app.use("/api/admin", adminRouter);
app.use("/api/doctor", doctorRouter);
app.use("/api/pharmacists", pharmacistRouter);

// Root route
app.get("/", (req, res) => {
  res.send("API Working");
});

// Server start
app.listen(port, () => console.log(`Server started on PORT:${port}`));