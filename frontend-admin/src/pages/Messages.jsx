import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import ktsRequest from "../../ultis/ktsrequest";
import Message from "../components/Message";

const Messages = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [loading, setLoading] = useState(false);
  const [refreshChats, setRefreshChats] = useState(false);

  // Fetch chats for the shop
  useEffect(() => {
    const fetchChats = async () => {
      if (!currentUser) return;
      setLoading(true);
      try {
        const res = await ktsRequest.get(
          `/chat/user/${currentUser._id}`,
          {
            headers: {
              Authorization: `Bearer ${currentUser.token}`,
            },
          }
        );
        setChats(res.data);
      } catch (error) {
        console.error("Error fetching chats:", error);
        toast.error("Failed to load chats");
      } finally {
        setLoading(false);
      }
    };

    fetchChats();
  }, [currentUser, refreshChats]);

  const handleChatSelect = (partnerId, partnerName) => {
    setSelectedChat({
      other: partnerId,
      title: partnerName,
    });
  };

  const handleRefresh = () => {
    setRefreshChats(!refreshChats);
  };

  return (
    <div className="flex h-full gap-4 p-4 bg-gray-100">
      {/* Left Column: Chat List */}
      <div className="w-1/4 bg-white rounded-lg shadow overflow-hidden flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-bold text-gray-800">Tin nhắn</h2>
        </div>
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="p-4 text-center text-gray-500">Đang tải...</div>
          ) : chats.length > 0 ? (
            <div className="divide-y divide-gray-200">
              {chats.map((chat) => (
                <button
                  key={chat._id}
                  onClick={() =>
                    handleChatSelect(
                      chat.partner._id,
                      chat.partner.displayName || chat.partner.username
                    )
                  }
                  className={`w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors flex items-center gap-3 ${
                    selectedChat?.other === chat.partner._id
                      ? "bg-blue-50 border-l-4 border-blue-500"
                      : ""
                  }`}
                >
                  <img
                    src={chat.partner.img || "https://via.placeholder.com/40"}
                    alt={chat.partner.displayName}
                    className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm text-gray-800">
                      {chat.partner.displayName || chat.partner.username}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {chat.lastMessage || "Không có tin nhắn"}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="p-4 text-center text-gray-500">
              Không có cuộc hội thoại
            </div>
          )}
        </div>
      </div>

      {/* Right Column: Message Component */}
      <div className="flex-1 bg-white rounded-lg shadow overflow-hidden">
        {selectedChat ? (
          <Message
            me={currentUser}
            msg={selectedChat}
            onClose={() => setSelectedChat(null)}
            onRefresh={handleRefresh}
          />
        ) : (
          <div className="h-full flex items-center justify-center text-gray-500">
            <p>Chọn một cuộc hội thoại để bắt đầu nhắn tin</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Messages;
