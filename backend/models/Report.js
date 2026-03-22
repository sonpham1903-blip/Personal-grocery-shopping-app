import mongoose from "mongoose";

const ReportSchema = new mongoose.Schema(
  {
    visitorsCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    totalProducts: {
      type: Number,
      default: 0,
      min: 0,
    },
    newProducts: {
      type: Number,
      default: 0,
      min: 0,
    },
    totalShop: {
      type: Number,
      default: 0,
      min: 0,
    },
    newShop: {
      type: Number,
      default: 0,
      min: 0,
    },
    totalOrders: {
      type: Number,
      default: 0,
      min: 0,
    },
    successOrders: {
      type: Number,
      default: 0,
      min: 0,
    },
    failOrders: {
      type: Number,
      default: 0,
      min: 0,
    },
    successValue: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Report", ReportSchema);
