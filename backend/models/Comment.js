import mongoose from "mongoose";

const CommentSchema = new mongoose.Schema(
  {
    productName: {
      type: String,
      default: "",
    },
    userId: {
      type: String,
      required: true,
    },
    createdById: {
      type: String,
      default: "",
    },
    createdByName: {
      type: String,
      default: "",
      trim: true,
    },
    createdByImg: {
      type: String,
      default: "",
      trim: true,
    },
    productId: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      default: "",
      trim: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    score: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
  },
  { timestamps: true }
);

CommentSchema.index({ productId: 1 });
CommentSchema.index({ userId: 1 });

export default mongoose.model("Comment", CommentSchema);
