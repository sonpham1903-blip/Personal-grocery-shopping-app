import express from "express";
import {
  createPost,
  updatePost,
  deletePost,
  getPostById,
  getPostsByUserId,
  getAllPosts,
  getPostsByRole,
} from "../controllers/post.js";
import { verifyToken } from "../verifyToken.js";

const router = express.Router();
router.post("/", verifyToken, createPost);
router.put("/:id", verifyToken, updatePost);
router.delete("/:id", verifyToken, deletePost);
router.get("/admin", verifyToken, getPostsByRole);
router.get("/user/:userId", verifyToken, getPostsByUserId);
router.get("/:id", getPostById);
router.get("/", getAllPosts);

export default router;
