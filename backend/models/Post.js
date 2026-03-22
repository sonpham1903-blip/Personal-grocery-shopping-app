import mongoose from "mongoose";

const PostSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    content: {
      type: String,
      required: true,
    },
    thumbnail: {
      type: String,
    },
    image: {
      type: String,
    },
    createdBy: {
      type: String,
    },
    updatedBy: {
      type: String,
    },
    status: {
      type: Number,
      default: 1,
      enum: [1, 0, -1],
    },
  },
  { timestamps: true }
);

export default mongoose.model("Post", PostSchema);
