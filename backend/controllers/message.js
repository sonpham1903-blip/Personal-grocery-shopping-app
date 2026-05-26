import Message from "../models/Message.js";
import Chat from "../models/Chat.js";

// Create a new message
export const createMessage = async (req, res, next) => {
  try {
    const { chatId, sender, text } = req.body;

    if (!chatId || !sender || !text) {
      return res.status(400).json({
        status: 400,
        message: "chatId, sender, and text are required",
      });
    }

    // Create message
    const newMessage = new Message({
      chatId,
      sender,
      text,
    });

    await newMessage.save();

    // Update chat's last message and time
    await Chat.findByIdAndUpdate(
      chatId,
      {
        lastMessage: text,
        lastMessageTime: new Date(),
      },
      { new: true }
    );

    res.status(201).json(newMessage);
  } catch (error) {
    next(error);
  }
};
