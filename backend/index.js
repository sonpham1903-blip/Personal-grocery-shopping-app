import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import categoryRoute from "./routes/category.js";
import authRoute from "./routes/auth.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/dichoho_app";


// Middleware
app.use(express.json());


// Routes
app.use("/categories", categoryRoute);
app.use("/auth", authRoute);

async function startServer() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("MongoDB connected successfully");

    app.listen(PORT, () => {
      console.log(`Server is running at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  }
}

startServer();


