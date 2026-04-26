import React, { useState, useEffect, useRef } from "react";
import { toast } from "react-toastify";
import ktsRequest from "../../ultis/ktsrequest";
import TimeAgo from "timeago-react";
import vi from "timeago.js/lib/lang/vi";
import * as timeago from "timeago.js";
import io from "socket.io-client";
import { ktsSocket } from "../../ultis/config";
const Message = (props) => {
  const [chat, setChat] = useState({});
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [shop, setShop] = useState({});
  const [resfresh, setRefresh] = useState(false);
  const scrollRef = useRef();

  timeago.register("vi", vi);
  const socket = io.connect(ktsSocket);

  socket.on("newNoti", () => {
    setRefresh(true);
  });
  useEffect(() => {
    socket.emit("newUser", {
      uid: props.me._id,
      uname: props.me.username,
    });
  }, []);
  useEffect(() => {
    setRefresh(false);
    const fetchData = async () => {
      try {
        const res = await ktsRequest.get(
          `/chat/find/${props.me._id}/${props.msg.other}`
        );
        setChat(res.data);
        setShop(res.data.shop);
        setMessages(res.data.messages);
      } catch (error) {
        toast.error(
          `${error.response ? error.response.data : "Network Error!"}`
        );
      }
    };
    fetchData();
  }, [resfresh, props]);

  const handleClick = async (text) => {
    if (text) {
      try {
        const res = await ktsRequest.post(`/messages`, {
          chatId: chat.chatId,
          sender: props.me,
          text: text,
        });
        setRefresh(true);
        setMessage("");
        props.onRefresh(true);
        socket.emit("refresh", {
          uid: props.msg.other,
        });
      } catch (error) {
        toast.error(
          `${error.response ? error.response.data : "Network Error!"}`
        );
      }
    } else {
      return;
    }
  };
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  return (
    <div className="w-full h-full rounded-md overflow-hidden bg-white">
      <div className="h-[10%]">
        <div className="h-full px-3 flex items-center font-semibold">
          <button
            className="pr-3"
            onClick={() => {
              props.onClose(false);
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-5 h-5 mt-0.5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 19.5L8.25 12l7.5-7.5"
              />
            </svg>
          </button>
          <span> {props.msg.title}</span>
        </div>
      </div>
      <div className="h-[80%]">
        <div className="h-full px-2.5 bg-orange-100 my-auto shadow-inner overflow-y-auto">
          {messages?.length > 0 ? (
            <ul className="space-y-2">
              {messages?.map((m, i) => {
                return (
                  <li
                    className={`px-3 ${
                      m.sender === props.me._id && "text-end"
                    }`}
                    key={i}
                  >
                    <div
                      className={`${
                        m.sender === props.me._id
                          ? "bg-green-500"
                          : "bg-blue-500"
                      } inline-block text-start px-3 py-1 rounded-md`}
                    >
                      <div className="text-white">{m.text}</div>
                      <div className="text-xs text-gray-800">
                        <TimeAgo datetime={m.createdAt} locale="vi" />
                      </div>
                    </div>
                  </li>
                );
              })}
              <li ref={scrollRef}></li>
            </ul>
          ) : (
            "Bạn chưa có tin nhắn nào."
          )}
        </div>
      </div>
      <div className="h-[10%]">
        <div className="h-full flex justify-between px-4 gap-2 py-2 items-center overflow-hidden">
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
            className="block w-full rounded border border-gray-300 bg-gray-50 p-3 text-gray-900 focus:border-primary focus:outline-none focus:ring-primary sm:text-sm"
          />
          <button
            id="myBtn"
            className="p-2.5 outline-0 text-base bg-primary text-white rounded"
            onClick={() => handleClick(message)}
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
    </div>
  );
};

export default Message;
