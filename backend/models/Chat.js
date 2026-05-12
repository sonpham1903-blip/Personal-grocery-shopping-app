import mongoose from "mongoose";

const ChatSchema = new mongoose.Schema(
  {
    customerId: {
      type: String,
      required: true,
    },
    shopId: {
      type: String,
      required: true,
    },
    lastMessage: {
      type: String,
    },
    lastMessageTime: {
      type: Date,
    },
  },
  { timestamps: true }
);

ChatSchema.index({ customerId: 1, shopId: 1 });

export default mongoose.model("Chat", ChatSchema);
