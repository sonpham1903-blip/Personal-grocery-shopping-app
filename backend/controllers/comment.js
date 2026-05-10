import Comment from '../models/Comment.js';
import { createError } from '../error.js';


export const createComment = async (req, res, next) => {
    try{
        if(!req.body.userId || !req.body.productId || !req.body.content || !req.body.rating || !req.body.userName ) {
            return next(createError(400, "Thiếu thông tin bắt buộc để tạo bình luận"));
        }

        if(req.body.rating < 1 || req.body.rating > 5) {
            return next(createError(400, "Đánh giá phải nằm trong khoảng từ 1 đến 5"));
        }
        const newComment = new Comment(req.body);
        await newComment.save();
        res.status(200).json(newComment);
    } catch (error) {
        next(error);
    }
}
export const getCommentsByProductID = async (req, res, next) => {
    try{
        const comments = await Comment.find({productId: req.params.productId});
        res.status(200).json(comments);
    } catch (error) {
        next(error);
    }
}
export const updateComment = async (req, res, next) => {
    try{
        const comment = await Comment.findById(req.params.id);
        if(!comment) {
            return next(createError(404, "Không tìm thấy bình luận"));
        }
        if(req.body.rating && (req.body.rating < 1 || req.body.rating > 5)) {
            return next(createError(400, "Đánh giá phải nằm trong khoảng từ 1 đến 5"));
        }
        const updatedComment = await Comment.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });
        res.status(200).json(updatedComment);
    } catch (error) {
        next(error);
    }
}



export const deleteComment = async (req, res, next) => {
    try{
        const comment = await Comment.findById(req.params.id);
        if(!comment) {
            return next(createError(404, "Không tìm thấy bình luận"));
        }
        await Comment.findByIdAndDelete(req.params.id);
        res.status(200).json("Xóa bình luận thành công");
    } catch (error) {
        next(error);
    }
}
