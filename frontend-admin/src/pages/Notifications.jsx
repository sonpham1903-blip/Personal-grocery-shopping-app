import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import ktsRequest from "../../ultis/ktsrequest";
import io from "socket.io-client";
import { ktsSocket } from "../../ultis/config";

const Notifications = () => {
  const [data, setData] = useState([]);
  const [refresh, setRefresh] = useState(false);

  const { currentUser } = useSelector((state) => state.user);
  const { token } = currentUser;
  const socket = io.connect(ktsSocket);

  socket.on("newNoti", () => {
    setRefresh(true);
  });
  useEffect(() => {
    socket.emit("newUser", {
      uid: currentUser._id,
      uname: currentUser.username,
    });
  }, []);
  useEffect(() => {
    setRefresh(false);
    const fetchData = async () => {
      const res = await ktsRequest.get("/notifications", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      setData(res.data);
    };
    fetchData();
  }, [refresh]);
  return (
    <div className="px-2">
      <div className="bg-white p-2 rounded-md">
        <ul className="divide-y divide-primary divide-dashed">
          {data?.map((n, i) => {
            const notiDate = new Date(n.createdAt);
            return (
              <li key={i} className="p-2">
                <Link
                  to={`/admin/thong-bao/${n._id}`}
                  className={`hover:text-red-500 hover:italic ${
                    n.status === 0 ? "font-semibold" : "text-gray-600"
                  }`}
                >
                  <span className="mr-2">{notiDate.toLocaleDateString()}</span>
                  <span className="mr-2">{notiDate.toLocaleTimeString()}</span>
                  <span>{n.title}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default Notifications;
