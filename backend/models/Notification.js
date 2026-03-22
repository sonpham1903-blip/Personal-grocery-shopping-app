import mongoose from "mongoose";

const NotificationSchema = new mongoose.Schema(
  {
    buyerId: {
      type: String,
    },
    salerId: {
      type: String,
    },
    title: {
      type: String,
    },
    short: {
      type: String,
    },
    desc: {
      type: String,
    },
    read: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

NotificationSchema.index({ buyerId: 1, salerId: 1 });

export default mongoose.model("Notification", NotificationSchema);
