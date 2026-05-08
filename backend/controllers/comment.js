import Comment from "../models/Comment.js";
import {createError} from "../error.js";



export const create = async (req, res, next) => {
    try{
        const normalizedComment = {
            productId: req.body.productId,
            productName: req.body.productName || "",
            userId: req.body.userId || req.body.createdById,
            createdById: req.body.createdById || req.body.userId || "",
            createdByName: req.body.createdByName || "",
            createdByImg: req.body.createdByImg || "",
            content: req.body.content || req.body.description,
            description: req.body.description || req.body.content || "",
            rating: req.body.rating || req.body.score,
            score: req.body.score || req.body.rating || 0,
        };

        if (!normalizedComment.productId || !normalizedComment.userId || !normalizedComment.content || !normalizedComment.rating) {
            return next(createError(400, "Thiếu thông tin bình luận"));
        }

        const newComment = new Comment(normalizedComment);
        await newComment.save();
        res.status(201).json(newComment);
    }
    catch(err){
        next(err);
    }
}


export const getByProductId = async (req, res, next) => {
    try{
        const comments = await Comment.find({productId: req.params.productId});
        res.status(200).json(comments);
    }catch(err){
        next(err);
    }
}