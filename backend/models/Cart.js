import mongoose from "mongoose";

const CartItemSchema = new mongoose.Schema(
  {
    productId: {
      type: String,
      required: true,
    },
    productName: {
      type: String,
    },
    shopID: {
      type: String,
    },
    quantity: {
      type: Number,
      required: true,
      min: 0,
      default: 1,
    },
    unitPrice: {
      type: Number,
      default: 0,
      min: 0,
    },
    currentPrice: {
      type: Number,
      default: 0,
      min: 0,
    },
    lineTotal: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  { _id: false }
);

const CartSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      unique: true,
    },
    items: {
      type: [CartItemSchema],
      default: [],
    },
    total: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  { timestamps: true }
);

CartSchema.index({ userId: 1 }, { unique: true });

export default mongoose.model("Cart", CartSchema);
