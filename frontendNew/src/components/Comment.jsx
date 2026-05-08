import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import ktsRequest from "../../ultis/ktsrequest";
import { ToastContainer, toast } from "react-toastify";
import { io } from "socket.io-client";
import { ktsSocket } from "../../ultis/config";

const CommentCard = ({ data }) => {
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
    <div className="flex p-3">
      {data.createdByImg ? (
        <img
          src={data.createdByImg}
          alt=""
          className="w-16 h-16 min-w-1/4 rounded-full "
        />
      ) : (
        <div>{textAvatar(data.createdByName)}</div>
      )}
      <div className="pl-4 w-3/4 flex-1">
        <div className="font-semibold">{data.createdByName}</div>
        <div className=" flex gap-1">
          {[1, 2, 3, 4, 5].map((s) => {
            return (
              <svg
                key={s}
                xmlns="http://www.w3.org/2000/svg"
                fill={s <= data.score ? "green" : "none"}
                viewBox="0 0 24 24"
                strokeWidth={1}
                stroke="green"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
                />
              </svg>
            );
          })}
        </div>
        <div className="py-2">
          {new Date(data.createdAt).toLocaleTimeString() +
            " - " +
            new Date(data.createdAt).toLocaleDateString()}
        </div>
        <div>
          <p>{data.description}</p>
        </div>
      </div>
    </div>
  );
};

const Comment = ({ productId, productName, userId, userName, userImg }) => {
  const { currentUser } = useSelector((state) => state.user);
  const [data, setData] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [score, setScore] = useState(0);
  const [desc, setDesc] = useState("");
  const scrollRef = useRef();
  const socket = useRef();
  useEffect(() => {
    socket.current = io(ktsSocket);
    socket.current.on("newComment", (data) => {
      data === productId && setRefresh(true);
    });
  }, []);
  useEffect(() => {
    socket.current.emit("newGuest");
  }, []);
  useEffect(() => {
    setRefresh(false);
    const fetchData = async () => {
      try {
        const res = await ktsRequest.get(`/comments/product/${productId}`);
        setData(res.data);
      } catch (err) {
        toast.error(err.response ? err.response.message : "Nét guộc Ê rô 1!");
      }
    };
    fetchData();
  }, [productId, refresh]);
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [data]);
  const handleClick = async () => {
    const { token } = currentUser;
    if (score < 1 || score > 5) {
      toast.warn("Điểm số đánh giá không hợp lệ!");
      return;
    }
    if (!desc) {
      toast.warn("Muốn bình loạn thì phải có vài chữ má ơi!");
      return;
    }
    try {
      const res = await ktsRequest.post(
        "/comments",
        {
          productId,
          productName,
          score,
          description: desc,
          createdById: userId,
          createdByName: userName,
          createdByImg: userImg,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success(res.data);
      socket.current.emit("addComment", productId);
      setRefresh(true);
      setDesc("");
      setScore(0);
    } catch (err) {
      console.log(err);
      toast.error(err.response ? err.response.message : "Nét guộc Ê rô 2!");
    }
  };
  return (
    <div className="">
      {data && data?.length > 0 ? (
        <div className="space-y-4 h-[80vh] overflow-y-auto divide-y divide-dashed divide-primary">
          <div ref={scrollRef}></div>
          {data.map((c, i) => {
            return <CommentCard key={i} data={c} />;
          })}
        </div>
      ) : (
        <div className="py-32 text-center">
          Chưa có đánh giá nào về sản phẩm này. Bạn hãy là người đầu tiên đánh
          giá sản phẩm!
        </div>
      )}
      <div className="min-h-[20vh] border-t-2 border-primary flex items-center justify-center">
        {currentUser ? (
          <div className="w-full space-y-2">
            <div className="w-full flex gap-2 items-center py-4">
              <span className="hidden md:block md:w-1/6 font-semibold">
                Đánh giá sản phẩm
              </span>
              <div className="flex gap-3 w-full md:w-5/6 justify-center md:justify-start">
                {[1, 2, 3, 4, 5].map((s) => {
                  return (
                    <button key={s} onClick={() => setScore(s)}>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill={score >= s ? "green" : "none"}
                        viewBox="0 0 24 24"
                        strokeWidth={1}
                        stroke="green"
                        className="w-10 h-10"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
                        />
                      </svg>
                    </button>
                  );
                })}
              </div>
            </div>
            <div className="flex gap-2">
              <span className="hidden md:block md:w-1/6 font-semibold">
                Nội dung đánh giá
              </span>
              <div className="w-full md:w-5/6 space-y-3">
                <textarea
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                  className="border border-primary outline-none w-full p-2 rounded-md bg-green-50"
                  placeholder="Vui lòng không nhập các nội dung liên quan tới chính trị, tôn giáo, tình dục hoặc các nội dung bị cấm theo pháp luật nhà nước Việt Nam"
                />
                <button
                  onClick={handleClick}
                  className="text-center px-4 py-2 rounded bg-green-700 border border-green-900 uppercase font-semibold text-white hover:bg-green-800 active:scale-90 duration-300"
                >
                  Gửi bình luận
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="">
            <h3 className="py-3">Đăng nhập để gửi bình luận!!!</h3>
            <div className="w-full grid grid-cols-2 gap-2">
              <Link
                to="/register"
                className="text-center px-4 py-2 rounded bg-primary uppercase font-semibold text-white hover:bg-green-700 active:scale-90 duration-300"
              >
                Đăng ký
              </Link>
              <Link
                to="/login"
                className="text-center px-4 py-2 rounded bg-primary uppercase font-semibold text-white border border-primary hover:bg-green-700 active:scale-90 duration-300"
              >
                Đăng nhập
              </Link>
            </div>
          </div>
        )}
      </div>
      {/* <ToastContainer /> */}
    </div>
  );
};

export default Comment;
