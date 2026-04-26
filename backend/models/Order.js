import mongoose from "mongoose";

const OrderProductSchema = new mongoose.Schema(
  {
    productId: {
      type: String,
    },
    productName: {
      type: String,
    },
    img: {
      type: String,
      default: "",
    },
    shopName: {
      type: String,
      default: "Shop",
    },
    shopID: {
      type: String,
    },
    quantity: {
      type: Number,
      default: 0,
      min: 0,
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

const OrderTrackingSchema = new mongoose.Schema(
  {
    status: {
      type: Number,
      default: 0,
    },
    desc: {
      type: String,
    },
    time: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false }
);

const OrderSchema = new mongoose.Schema(
  {
    orderNumber: {
      type: String,
      required: true,
    },
    buyerId: {
      type: String,
      required: true,
    },
    buyerName: {
      type: String,
      required: true,
    },
    buyerPhone: {
      type: String,
      required: true,
    },
    note: {
      type: String,
    },
    toCity: {
      type: String,
      required: true,
    },
    toDistrict: {
      type: String,
      required: true,
    },
    toWard: {
      type: String,
      required: true,
    },
    toAddress: {
      type: String,
      required: true,
    },
    products: {
      type: [OrderProductSchema],
      default: [],
    },
    total: {
      type: Number,
      default: 0,
      min: 0,
    },
    shipMode: {
      type: String,
      default: "ems",
      enum: ["ems", "vnpost", "best"],
    },
    payment: {
      type: String,
      enum: ["cod", "bank"],
      default: "cod",
    },
    payCode: {
      type: String,
    },
    status: {
      type: Number,
      default: 0,
      enum: [0, 1, 2, 3, 4],
    },
    shipperId: {
      type: String,
      default: null,
    },
    tracking: {
      type: [OrderTrackingSchema],
      default: [],
    },
  },
  { timestamps: true }
);

OrderSchema.index({ orderNumber: 1 });
OrderSchema.index({ buyerId: 1 });
OrderSchema.index({ status: 1 });

export default mongoose.model("Order", OrderSchema);
