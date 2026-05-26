import { useState, useEffect, useRef } from "react";
import { toast } from "react-toastify";
import ktsRequest from "../../ultis/ktsrequest";
import * as timeago from "timeago.js";
import vi from "timeago.js/lib/lang/vi";
import TimeAgo from "timeago-react";
import io from "socket.io-client";
import { ktsSocket } from "../../ultis/config";

// Register locale once
// Register vi locale (handle commonjs default export shape)
const viLocale = vi && vi.default ? vi.default : vi;
timeago.register("vi", viLocale);

const Chat = (props) => {
  const [chat, setChat] = useState({});
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [shop, setShop] = useState({});
  const [refresh, setRefresh] = useState(false);
  const [socket, setSocket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [socketError, setSocketError] = useState(null);
  const scrollRef = useRef();

  // Initialize socket connection once
  const socketRef = useRef(null);

  useEffect(() => {
    try {
      console.log("Connecting to Socket.io at:", ktsSocket);
      // create socket and store in ref to avoid double disconnects in Strict Mode
      const newSocket = io.connect(ktsSocket, {
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
        reconnectionAttempts: 5,
        transports: ["websocket", "polling"],
        autoConnect: true,
      });

      socketRef.current = newSocket;
      setSocket(newSocket);

      newSocket.on("connect", () => {
        console.log("Socket connected:", newSocket.id);
        setSocketError(null);
      });

      newSocket.on("connect_error", (error) => {
        console.error("Socket connection error:", error);
        setSocketError(`Lỗi kết nối Socket.io: ${error.message}`);
      });

      newSocket.on("disconnect", (reason) => {
        console.log("Socket disconnected:", reason);
      });

      newSocket.on("newNoti", () => {
        console.log("Received newNoti event");
        setRefresh((prev) => !prev);
      });

      return () => {
        try {
          // only disconnect if this ref still matches the socket
          if (socketRef.current === newSocket) {
            newSocket.disconnect();
            socketRef.current = null;
          }
        } catch (e) {
          console.warn("Socket cleanup error:", e);
        }
      };
    } catch (err) {
      console.error("Socket initialization error:", err);
      setSocketError("Không thể khởi tạo Socket.io");
    }
  }, []);

  // Emit newUser when component mounts or user changes
  useEffect(() => {
    if (!props.me || !socket) return;
    socket.emit("newUser", {
      uid: props.me._id,
      uname: props.me.username,
    });
  }, [props.me, socket]);

  // Close chat if user is not logged in
  useEffect(() => {
    if (!props.me) {
      props.onClose(false);
      return;
    }
  }, [props.me, props]);

  // Fetch chat and messages
  useEffect(() => {
    if (!props.me || !props.shop) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    const fetchData = async () => {
      try {
        const res = await ktsRequest.get(
          `/chat/find/${props.me._id}/${props.shop}`
        );
        setChat(res.data);
        setShop(res.data.shop || {});
        setMessages(res.data.messages || []);
      } catch (error) {
        console.error("Error fetching chat:", error);
        const errorMsg = error.response?.data?.message || error.message || "Network Error!";
        setError(errorMsg);
        toast.error(`Lỗi: ${errorMsg}`);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [refresh, props.me, props.shop]);

  const handleClick = async (text) => {
    if (!text.trim() || !chat._id) {
      toast.error("Không thể gửi tin nhắn trống hoặc chat ID không xác định");
      return;
    }

    try {
      await ktsRequest.post(`/messages`, {
        chatId: chat._id,
        sender: props.me._id,
        text: text.trim(),
      });
      setMessage("");
      setRefresh(prev => !prev);
      
      // Notify recipient
      if (socket) {
        socket.emit("refresh", {
          uid: props.shop,
        });
      }
      toast.success("Tin nhắn đã được gửi");
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error(
        `${error.response?.data?.message || "Lỗi gửi tin nhắn"}`
      );
    }
  };
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);
  return (
    <div className="bg-white max-w-md w-full shadow-md rounded fixed bottom-0 right-0 overflow-hidden z-30 flex flex-col">
      {/* Header */}
      <section className="">
        <div className="flex justify-between items-center bg-gradient-to-r from-primary to-green-600">
          <div className="px-3 py-3 text-white font-semibold flex-1">
            {loading ? (
              "Đang tải..."
            ) : shop?.displayName || shop?.username ? (
              shop.displayName || shop.username
            ) : (
              "Chat"
            )}
          </div>
          <button
            className="p-3 hover:bg-green-700 text-white transition"
            onClick={() => {
              props.onClose(false);
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      </section>

      {/* Error Messages */}
      {socketError && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-3 py-2 text-sm">
          ⚠️ {socketError}
        </div>
      )}
      {error && (
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-3 py-2 text-sm">
          ⚠️ {error}
        </div>
      )}

      {/* Messages Area */}
      <div className="h-96 py-2 px-2.5 bg-gray-100 flex-1 shadow-inner overflow-y-auto">
        {loading ? (
          <div className="flex items-center justify-center h-full text-gray-500">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
              Đang tải cuộc hội thoại...
            </div>
          </div>
        ) : messages?.length > 0 ? (
          <ul className="space-y-2">
            {props.me &&
              messages?.map((m, i) => {
                return (
                  <li
                    className={`px-3 ${
                      m.sender === props.me._id && "text-end"
                    }`}
                    key={i}
                  >
                    <div
                      ref={i === messages.length - 1 ? scrollRef : null}
                      className={`${
                        m.sender === props.me._id
                          ? "bg-green-500"
                          : "bg-blue-500"
                      } inline-block text-start px-3 py-1 rounded-md max-w-xs break-words`}
                    >
                      <div className="text-white text-sm">{m.text}</div>
                      <div className="text-xs text-gray-200">
                        <TimeAgo datetime={m.createdAt} locale="vi" />
                      </div>
                    </div>
                  </li>
                );
              })}
          </ul>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            Bạn chưa có tin nhắn nào. Hãy gửi tin nhắn đầu tiên!
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="flex justify-between px-4 gap-2 py-4 bg-white border-t">
        <input
          onChange={(e) => {
            setMessage(e.target.value);
          }}
          onKeyPress={(e) => {
            if (e.key === "Enter") {
              document.getElementById("myBtn").click();
            }
          }}
          id="myInput"
          value={message}
          type="text"
          placeholder="Nhập nội dung tại đây..."
          disabled={loading || !chat._id}
          className="block w-full rounded border border-gray-300 bg-gray-50 p-3 text-gray-900 focus:border-primary focus:outline-none focus:ring-primary sm:text-sm disabled:bg-gray-200 disabled:cursor-not-allowed"
        />
        <button
          className="w-14 outline-0 text-base bg-primary text-white rounded hover:bg-green-700 disabled:bg-gray-400 transition"
          onClick={() => handleClick(message)}
          id="myBtn"
          disabled={loading || !chat._id || !message.trim()}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6 mx-auto"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default Chat;
