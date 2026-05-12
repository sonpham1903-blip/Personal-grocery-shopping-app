import { useEffect, useState, useRef } from "react";
import ktsRequest from "../../ultis/ktsrequest";
import { useSelector } from "react-redux";
import Message from "../components/Message";
import { io } from "socket.io-client";
import { ktsSocket } from "../../ultis/config";
import TimeAgo from "timeago-react";
import vi from "timeago.js/lib/lang/vi";
import * as timeago from "timeago.js";
timeago.register("vi", vi);

const Messages = () => {
  const [data, setData] = useState([]);
  const [msg, setMsg] = useState({});
  const [showChat, setShowChat] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [query, setQuery] = useState("");
  const { currentUser } = useSelector((state) => state.user);
  const { token } = currentUser;
  const socket = useRef();
  // socket.on("newNoti", () => {
  //   setRefresh(true);
  // });
  useEffect(() => {
    socket.current = io(ktsSocket);
    socket.current.on("newNoti", () => {
      setRefresh(true);
    });
  }, []);
  useEffect(() => {
    socket.current.emit("newUser", {
      uid: currentUser._id,
      uname: currentUser.username,
    });
  }, []);
  useEffect(() => {
    setRefresh(false);
    const fetchData = async () => {
      try {
        const res = await ktsRequest.get("/chat", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        setData(res.data);
      } catch (error) {
        console.log(error);
        // toast.error(
        //   `${error.response ? error.response.data : "Network Error!"}`
        // );
      }
    };
    fetchData();
  }, [refresh]);
  const search = (data) => {
    return data.filter((item) => item["title"].toLowerCase().includes(query));
  };
  const textAvatar = (text) => {
    let name = text.split(" ");
    if (name.length === 1) {
      return name[0].charAt().toUpperCase();
    } else {
      return (
        name[0].charAt(0).toUpperCase() +
        name[name.length - 1].charAt(0).toUpperCase()
      );
    }
  };
  return (
    <div className="w-full h-full p-2 md:grid md:auto-cols-fr md:grid-flow-col gap-2">
      <div
        className={`rounded ${
          showChat && "hidden"
        } md:block w-full max-h-full overflow-auto`}
      >
        <div className="flex w-full relative pb-2">
          <input
            type="text"
            name="name"
            className="block w-full rounded-lg border border-gray-300 bg-gray-50 py-3 pl-10 text-gray-900 focus:border-primary focus:outline-none focus:ring-primary-600 sm:text-sm"
            placeholder="Tìm kiếm shop ..."
            required="a-z"
            onChange={(e) => {
              setQuery(e.target.value);
            }}
          />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-6 h-6 absolute left-2 top-2.5 text-gray-500"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
            />
          </svg>
        </div>
        {search(data).length > 0 ? (
          <div className=" divide-y divide-primary divide-dashed rounded-md overflow-hidden">
            {search(data)?.map((c, i) => {
              return (
                <div
                  key={i}
                  className={`flex w-full bg-white p-2 justify-between cursor-pointer hover:bg-slate-200 `}
                  onClick={() => {
                    setMsg(c);
                    setShowChat(true);
                  }}
                >
                  <div className="flex flex-1">
                    <div className="rounded-full h-12 w-12 min-w-[3rem] bg-orange-500 flex justify-center items-center text-white overflow-hidden">
                      {c.otherImg ? (
                        <img
                          src={c.otherImg}
                          alt=""
                          className="w-full h-full object-cover object-center"
                        />
                      ) : (
                        textAvatar(c.title)
                      )}
                    </div>
                    <div
                      className={`${
                        c.status === 0 ? "" : "text-gray-700"
                      } text-start px-3`}
                    >
                      <p className="line-clamp-1">{c.title}</p>
                      <div
                        className={`text-sm ${
                          c.senderId === currentUser._id
                            ? "text-slate-500"
                            : "font-semibold"
                        }`}
                      >
                        {currentUser._id === c.senderId && <span>Bạn: </span>}{" "}
                        <span>{c.text}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-xs text-gray-800">
                    <TimeAgo datetime={c.time} locale="vi" />
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div
            className={`flex w-full bg-white p-3 justify-between hover:bg-slate-300 rounded `}
          >
            Không có dữ liệu phù hợp
          </div>
        )}
      </div>
      {showChat && (
        <Message
          onClose={setShowChat}
          msg={msg}
          me={currentUser}
          onRefresh={setRefresh}
        />
      )}
    </div>
  );
};

export default Messages;
