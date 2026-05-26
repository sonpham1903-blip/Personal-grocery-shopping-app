import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema(
  {
    chatId: {
      type: String,
      required: true,
    },
    sender: {
      type: String,
      required: true,
    },
    text: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

MessageSchema.index({ chatId: 1 });

export default mongoose.model("Message", MessageSchema);
