import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema(
  {
    productName: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    shopID: {
      type: String,
      required: true,
    },
    shopName: {
      type: String,
      default: "Shop",
    },
    thumbnail: {
      type: String,
    },
    imgs: {
      type: [String],
      default: [],
    },
    stockPrice: {
      type: Number,
      default: 0,
      min: 0,
    },
    currentPrice: {
      type: Number,
      default: 0,
      min: 0,
    },
    inStock: {
      type: Number,
      default: 0,
      min: 0,
    },
    outStock: {
      type: Number,
      default: 0,
      min: 0,
    },
    available: {
      type: Boolean,
      default: true,
    },
    active: {
      type: Boolean,
      default: true,
    },
    like: {
      type: Number,
      default: 0,
      min: 0,
    },
    likedBy: {
      type: [String],
      default: [],
    },
    dislikeBy: {
      type: [String],
      default: [],
    },
    tags: {
      type: [String],
      default: [],
    },
    cat: {
      type: String,
    },
    updatedBy: {
      type: String,
    },
  },
  { timestamps: true }
);

ProductSchema.index({ shopID: 1, cat: 1 });
ProductSchema.index({ productName: 1 });

export default mongoose.model("Product", ProductSchema);
