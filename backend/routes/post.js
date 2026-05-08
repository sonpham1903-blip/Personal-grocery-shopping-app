import express from "express";
import {
  adminGetPosts,
  createPost,
  deletePost,
  editPost,
  getPost,
  getPostByProductId,
  getPosts,
} from "../controllers/post.js";
import { verifyToken } from "../verifyToken.js";
const router = express.Router();
//lấy toàn bộ bài viết
router.get("/", getPosts);
//
router.get("/admin",verifyToken,adminGetPosts)
//lấy bài viết cụ thể theo id
router.get("/:id", getPost);
//lấy bài viết theo id sản phẩm
router.get("/product", getPostByProductId);
//tạo mới bài viết
router.post("/", verifyToken, createPost);
//cập nhật bài viết
router.put("/:id", verifyToken, editPost);
//xóa bài viết
router.delete("/:id", verifyToken, deletePost);

export default router;
