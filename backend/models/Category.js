import mongoose from "mongoose";

const CategorySchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    status: {
      type: Number,
      default: 1,
      enum: [1, 0, -1],
    },
    createdBy: {
      type: String,
    },
    updatedBy: {
      type: String,
    },
  },
  { timestamps: true }
);

CategorySchema.index({ code: 1 }, { unique: true });

export default mongoose.model("Category", CategorySchema);
