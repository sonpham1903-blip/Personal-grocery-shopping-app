import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
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

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGODB_URI || "mongodb+srv://dorason1903_db_user:71QWZ3Y5uirBZfpQ@cluster0.cm5hwjn.mongodb.net/";


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



app.use((err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || "Đã xảy ra lỗi máy chủ";
  res.status(status).json({ status, message });
});

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


