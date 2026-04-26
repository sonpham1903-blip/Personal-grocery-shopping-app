import { createError } from "../error.js";
import Post from "../models/Post.js";
const permission = ["admin", "staff"];
export const createPost = async (req, res, next) => {
  console.log("create Post");
  try {
    const newPost = new Post({
      ...req.body,
      createdBy: req.user.id,
    });
    await newPost.save();
    res.status(200).json("Đăng ký bài viết thành công");
  } catch (error) {
    console.log(error);
    next(error);
  }
};
export const getPosts = async (req, res, next) => {
  try {
    const posts = await Post.find({ status: 1 });
    res.status(200).json(posts);
  } catch (error) {
    next(error);
  }
};
export const adminGetPosts = async (req, res, next) => {
  try {
    if (!permission.includes(req.user.role)) {
      return res.status(403).json("Bạn không được cấp quyền truy cập");
    }
    const posts = await Post.find();
    const list = posts.sort((a, b) => b.createdAt - a.createdAt);
    res.status(200).json(list);
  } catch (error) {
    next(error);
  }
};
export const getPost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post)
      return next(createError(403, "Không tìm thấy thông tin bài viết"));
    res.status(200).json(post);
  } catch (error) {
    next(error);
  }
};
export const getPostByProductId = async (req, res, next) => {
  try {
    const post = await Post.findOne({ productId: req.body.productId });
    if (!post)
      return next(createError(403, "Không tìm thấy thông tin bài viết"));
    res.status(200).json(post);
  } catch (error) {
    next(error);
  }
};
export const editPost = async (req, res, next) => {
  try {
    const post = Post.findById(req.params.id);
    if (!post) {
      return next(createError(404, "Không tìm thấy thông tin sản phẩm"));
    } else {
      if (
        post.createdBy === req.user.id ||
        permission.includes(req.user.role)
      ) {
        await Post.findByIdAndUpdate(
          req.params.id,
          { $set: req.body },
          { new: true }
        );
        res.status(200).json("Cập nhật bài viết thành công");
      } else {
        return next(
          createError(403, "Bạn không được phép thực hiện chức năng này")
        );
      }
    }
  } catch (error) {
    next(error);
  }
};
export const deletePost = async (req, res, next) => {
  try {
    const post = Post.findById(req.params.id);
    if (!post) {
      return next(createError(404, "Không tìm thấy bài viết"));
    } else {
      if (
        post.createdBy === req.user.id ||
        permission.includes(req.user.role)
      ) {
        await Post.findByIdAndUpdate(
          req.params.id,
          { $set: { status: 2 } },
          { new: true }
        );
        res.status(200).json("Xóa bài viết thành công");
      } else {
        return next(
          createError(403, "Bạn không được phép thực hiện chức năng này")
        );
      }
    }
  } catch (error) {
    next(error);
  }
};
