import express from "express";
import mongoose from "mongoose";
import categoryRoute from "./routes/category.js";

const app = express();
const PORT = 3000;
const MONGO_URI = "mongodb://localhost:27017/dichoho_app";

// Middleware
app.use(express.json());

// Routes
app.use("/categories", categoryRoute);

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


