import Chat from "../models/Chat.js";
import Message from "../models/Message.js";
import User from "../models/User.js";

// Find or create chat room between two users
export const findOrCreateChat = async (req, res, next) => {
  try {
    const { user1Id, user2Id } = req.params;

    // Check if chat already exists
    let chat = await Chat.findOne({
      $or: [
        { customerId: user1Id, shopId: user2Id },
        { customerId: user2Id, shopId: user1Id },
      ],
    });

    // Create chat if it doesn't exist
    if (!chat) {
      chat = new Chat({
        customerId: user1Id,
        shopId: user2Id,
      });
      await chat.save();
    }

    // Get messages for this chat
    const messages = await Message.find({ chatId: chat._id });

    // Get shop info
    const shop = await User.findById(chat.shopId).select(
      "displayName img username"
    );

    res.status(200).json({
      ...chat.toObject(),
      shop,
      messages,
    });
  } catch (error) {
    next(error);
  }
};

// Get all chats for a user
export const getUserChats = async (req, res, next) => {
  try {
    const { userId } = req.params;

    const chats = await Chat.find({
      $or: [{ customerId: userId }, { shopId: userId }],
    }).sort({ lastMessageTime: -1 });

    // Populate partner info and last message for each chat
    const enrichedChats = await Promise.all(
      chats.map(async (chat) => {
        const partnerId = chat.customerId === userId ? chat.shopId : chat.customerId;
        const partner = await User.findById(partnerId).select(
          "displayName img username"
        );

        return {
          ...chat.toObject(),
          partner,
        };
      })
    );

    res.status(200).json(enrichedChats);
  } catch (error) {
    next(error);
  }
};
