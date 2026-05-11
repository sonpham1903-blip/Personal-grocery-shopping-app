import mongoose from "mongoose";

const PostSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    thumbnail: { type: String, required: true },
    content: { type: String, required: true },
    image: { type: String },
    userId: { type: String, required: true },
    userName: { type: String, required: true },
    productId: { type: String },
    postType: { type: Boolean, default: true },
    status: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model("Post", PostSchema);
