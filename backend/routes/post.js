import express from "express";
import {createPost, updatePost, deletePost, getPostById, getPostsByUserId, getAllPosts, getPostsByRole} from '../controllers/post.js';
import { verifyToken } from "../verifyToken.js";

const router = express.Router();
router.post("/", verifyToken, createPost)
router.put("/:id", verifyToken, updatePost)
router.delete("/:id", verifyToken, deletePost)
router.get("/admin", verifyToken, getPostsByRole)
router.get("/", verifyToken, getAllPosts)
router.get("/:id", verifyToken, getPostById)
router.get("/user/:userId", verifyToken, getPostsByUserId)

export default router;