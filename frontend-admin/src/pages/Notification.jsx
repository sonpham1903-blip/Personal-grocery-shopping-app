import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ktsRequest from "../../ultis/ktsrequest";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import io from "socket.io-client";
import { ktsSocket } from "../../ultis/config";
const Notification = () => {
  const socket = io.connect(ktsSocket);
  const [data, setData] = useState({});
  const { notificationId } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);
  const { token } = currentUser;
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await ktsRequest.get(`/notifications/${notificationId}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        setData(res.data);
      } catch (err) {
        err.response ? navigate("/notfound") : toast.error("Network Error!");
      }
    };
    fetchData();
  }, [window.location.pathname]);
  useEffect(() => {
    socket.emit("refresh", {
      uid: currentUser._id,
    });
  }, []);
  return (
    <div>
      <div className="flex justify-between">
        {/* <span>{data.title}</span> */}
        <span className="italic underline">
          {new Date(data.createdAt).toLocaleString()}
        </span>
      </div>
      <div>
        <p>{data.desc}</p>
      </div>
      <div></div>
    </div>
  );
};

export default Notification;
