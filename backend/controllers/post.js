import Post from "../models/Post.js";
import { createError } from "../error.js";

export const createPost = async (req, res, next) => {
  try {
    if (!req.body.title || !req.body.thumbnail || !req.body.content) {
      return next(createError(400, "Thiếu thông tin bắt buộc để tạo bài viết"));
    }
    const newPost = new Post({
      ...req.body,
      userId: req.user.id,
      userName:
        req.body.userName || req.user.name || req.user.displayName || "User",
    });
    await newPost.save();
    res.status(200).json(newPost);
  } catch (error) {
    next(error);
  }
};
export const updatePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return next(createError(404, "Không tìm thấy bài viết"));
    }

    // Check authorization: user must be admin, shop, or post owner
    if (
      req.user?.role !== "admin" &&
      req.user?.role !== "shop" &&
      post.userId !== req.user?.id
    ) {
      return next(createError(403, "Bạn không có quyền sửa bài viết này"));
    }

    // Only admin can change approval status.
    if (
      Object.prototype.hasOwnProperty.call(req.body, "status") &&
      req.user?.role !== "admin"
    ) {
      return next(createError(403, "Chỉ admin mới có quyền duyệt bài viết"));
    }

    const updatedPost = await Post.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true },
    );
    res.status(200).json(updatedPost);
  } catch (error) {
    next(error);
  }
};
export const deletePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return next(createError(404, "Không tìm thấy bài viết"));
    }

    // Check authorization: user must be admin or post owner
    if (req.user?.role !== "admin" && post.userId !== req.user?.id) {
      return next(createError(403, "Bạn không có quyền xóa bài viết này"));
    }

    await Post.findByIdAndDelete(req.params.id);
    res.status(200).json("Bài viết đã được xóa");
  } catch (error) {
    next(error);
  }
};

export const getPostById = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return next(createError(404, "Không tìm thấy bài viết"));
    }
    res.status(200).json(post);
  } catch (error) {
    next(error);
  }
};

export const getPostsByUserId = async (req, res, next) => {
  try {
    const posts = await Post.find({ userId: req.params.userId });
    res.status(200).json(posts);
  } catch (error) {
    next(error);
  }
};
export const getAllPosts = async (req, res, next) => {
  try {
    const posts = await Post.find({ status: 1 });
    res.status(200).json(posts);
  } catch (error) {
    next(error);
  }
};

export const getPostsByRole = async (req, res, next) => {
  try {
    const userRole = req.user.role;
    const userId = req.user.id;

    let posts;
    if (userRole === "admin") {
      // Admin sees all posts
      posts = await Post.find();
    } else if (userRole === "shop") {
      // Shop sees only their own posts
      posts = await Post.find({ userId: userId });
    } else {
      // Other roles see nothing or can be customized
      posts = await Post.find({ userId: userId });
    }

    res.status(200).json(posts);
  } catch (error) {
    next(error);
  }
};
