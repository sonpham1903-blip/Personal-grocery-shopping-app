import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import { Server } from "socket.io";
import { createServer } from "http";
// import multer from "multer";
// import path from "path";
import categoryRoute from "./routes/category.js";
import authRoute from "./routes/auth.js";
import productRoute from "./routes/product.js";
import orderRoute from "./routes/order.js";
import userRoute from "./routes/user.js";
import postRoute from "./routes/post.js";
import commentRoute from "./routes/comment.js";
import cartRoute from "./routes/cart.js";
import shopRoute from "./routes/shop.js";
import goodReceiptRoute from "./routes/goodReceipt.js";
import {
  processExpiredReceipts,
  startReceiptExpiryScheduler,
  syncAllProductStocks,
} from "./utils/inventory.js";
import chatRoute from "./routes/chat.js";
import messageRoute from "./routes/message.js";
import assistantRoute from "./routes/assistant.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/dichoho_app";


// Middleware
app.use(express.json());
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Serve static files
// app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// Multer config
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, 'uploads/posts/');
//   },
//   filename: (req, file, cb) => {
//     cb(null, Date.now() + '-' + file.originalname);
//   }
// });
// const upload = multer({ storage });


// Routes
app.use("/categories", categoryRoute);
app.use("/auth", authRoute);
app.use("/products", productRoute);
app.use("/orders", orderRoute);
app.use("/users", userRoute);
app.use("/posts", postRoute);
app.use("/comments", commentRoute);
app.use("/carts", cartRoute);
app.use("/shops", shopRoute);
app.use("/good-receipts", goodReceiptRoute);
app.use("/chat", chatRoute);
app.use("/messages", messageRoute);
app.use("/assistant", assistantRoute);

// Simple visitor count endpoint (used by frontend to record page visits)
app.get("/count", async (req, res) => {
  try {
    // For now just return success. Can be extended to persist counts.
    return res.json({ success: true, message: "count recorded" });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Server error" });
  }
});



app.use((err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || "Đã xảy ra lỗi máy chủ";
  res.status(status).json({ status, message });
});

// Socket.io setup
const userMap = new Map(); // Map userId to socketId

async function startServer() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("MongoDB connected successfully");

    await processExpiredReceipts();
    await syncAllProductStocks();
    startReceiptExpiryScheduler();

    app.listen(PORT, () => {
      console.log(`Server is running at http://localhost:${PORT}`);
    });

    // Start Socket.io server on port 9200
    const httpServer = createServer();
    const io = new Server(httpServer, {
      cors: {
        origin: "*",
        methods: ["GET", "POST"],
        credentials: true,
      },
      transports: ["websocket", "polling"],
    });

    io.on("connection", (socket) => {
      console.log("New user connected:", socket.id);

      // Map user to socket when they connect
      socket.on("newUser", (data) => {
        const { uid } = data;
        userMap.set(uid, socket.id);
        console.log(`User ${uid} mapped to socket ${socket.id}`);
      });

      // Notify recipient when new message is received
      socket.on("refresh", (data) => {
        const { uid } = data;
        const recipientSocketId = userMap.get(uid);
        if (recipientSocketId) {
          io.to(recipientSocketId).emit("newNoti");
          console.log(`Notification sent to user ${uid}`);
        }
      });

      // Clean up when user disconnects
      socket.on("disconnect", () => {
        // Remove user from map
        for (const [userId, socketId] of userMap.entries()) {
          if (socketId === socket.id) {
            userMap.delete(userId);
            console.log(`User ${userId} disconnected`);
            break;
          }
        }
      });
    });

    httpServer.listen(9200, () => {
      console.log("Socket.io server is running on port 9200");
    });
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  }
}

startServer();


