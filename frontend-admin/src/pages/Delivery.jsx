import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import io from "socket.io-client";
import { ktsSocket } from "../../ultis/config";
import { toast } from "react-toastify";
import ktsRequest from "../../ultis/ktsrequest";
import { vnd } from "../../ultis/ktsFunc";

const Delivery = () => {
  const [data, setData] = useState([]);
  const { currentUser } = useSelector((state) => state.user);
  const { token } = currentUser;
  const [refresh, setRefresh] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [orderId, setOrderId] = useState("");
  const [openSearch, setOpenSearch] = useState(false);
  const [query, setQuery] = useState("");
  const socket = io.connect(ktsSocket);
  const status = [
    {
      id: 0,
      bgColor: "bg-blue-300",
      name: "Đơn mới",
      textColor: "text-blue-700",
    },
    {
      id: 1,
      bgColor: "bg-orange-300",
      name: "Đang giao",
      textColor: "text-orange-700",
    },
    {
      id: 2,
      bgColor: "bg-green-300",
      name: "Giao xong",
      textColor: "text-green-700",
    },
    { id: 3, bgColor: "bg-red-300", name: "Đã hủy", textColor: "text-red-700" },
  ];
  useEffect(() => {
    const socket = io.connect(ktsSocket);
    socket.on("newNoti", () => {
      setRefresh(true);
      toast.success;
    });
  }, []);
  useEffect(() => {
    currentUser &&
      socket.emit("newUser", {
        uid: currentUser._id,
        uname: currentUser.username,
      });
  }, []);
  useEffect(() => {
    setRefresh(false);
    const fetchData = async () => {
      try {
        const res = await ktsRequest.get(
          "/orders/my-orders",
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setData(res.data);
      } catch (err) {
        err.response
          ? toast.error(err.response.data)
          : toast.error("Network Error!");
      }
    };
    fetchData();
  }, [refresh]);
  const subTotal = (products) => {
    const total = 0;
    return products.reduce(
      (total, i) => total + i.currentPrice * i.quantity,
      total
    );
  };
  const handleClick1 = async (id, newStatus) => {
    try {
      const res = await ktsRequest.put(
        `/orders/${id}`,
        {
          status: newStatus,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success(res.data);
      setRefresh(true);
    } catch (err) {
      err.response
        ? toast.error(err.response.data)
        : toast.error("Network Error!");
    }
  };
  const search = (data) => {
    return data.filter((item) =>
      ["orderNumber"].some((key) => item[key].toLowerCase().includes(query))
    );
  };
  return (
    <div className="w-full h-full p-2">
      <div className="w-full bg-white shadow-lg rounded-md overflow-hidden">
        <div className=" flex p-3 font-semibold items-center bg-primary text-white">
          <div className="w-2/12">
            {openSearch ? (
              <div className="w-full pr-2 relative text-gray-900 font-normal">
                <input
                  placeholder="mã đơn hàng..."
                  className="w-full rounded focus:border-primary focus:outline-none focus:ring-primary-600"
                  onChange={(e) => setQuery(e.target.value)}
                />
                <button
                  className="absolute right-2.5 top-0.5 hover:bg-red-500 p-0.5 rounded hover:text-white bg-white"
                  onClick={() => setOpenSearch(false)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1}
                    stroke="currentColor"
                    className="w-4 h-4"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            ) : (
              <div className="flex">
                <button
                  className="border hover:border-white px-1 rounded border-primary mt-0.5 mr-2"
                  onClick={() => setOpenSearch(true)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-4 h-4"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                    />
                  </svg>
                </button>
                <span>Đơn hàng</span>
              </div>
            )}
          </div>
          <div className="w-5/12">Chi tiết đơn hàng</div>
          <div className="w-3/12 flex">Khách hàng</div>
          <div className="w-2/12">Thao tác</div>
        </div>
        {search(data)?.length > 0 ? (
          <div className="rounded divide-y divide-primary divide-dashed text-sm text-gray-800">
            {search(data).map((o, i) => {
              const st = o.status;
              return (
                <div className="w-full flex p-1 gap-1 items-center" key={i}>
                  <div className="w-2/12 space-x-2">
                    <span
                      className={`${status[st].bgColor} ${status[st].textColor} px-1.5 py-0.5 text-xs font-semibold rounded inline`}
                    >
                      {status[st].name + " "}
                    </span>
                    <span>{o.orderNumber}</span>
                    <p>{new Date(o.createdAt).toLocaleString()}</p>
                  </div>
                  <div className="w-5/12">
                    <ul className="space-y-1">
                      {o.products.map((p, j) => {
                        return (
                          <li key={j} className="">
                            <div className="flex gap-2">
                              <div>
                                <img
                                  src={p.img}
                                  alt=""
                                  className="w-12 h-12 rounded object-cover object-center"
                                />
                              </div>
                              <div>
                                <span className="font-semibold">
                                  {p.productName}
                                </span>
                                <p className="text-xs text-red-500">
                                  {p.shopName}
                                </p>
                                <div className="">
                                  <span>{vnd(p.currentPrice) + " * "}</span>
                                  <span>{p.quantity + " = "}</span>
                                  <span>
                                    {vnd(p.quantity * p.currentPrice)}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </li>
                        );
                      })}
                    </ul>

                    <div className="text-sm pl-14">
                      <span className="font-semibold">Ghi chú: </span>
                      {o?.note}
                    </div>
                    <span className="pl-14 font-semibold">
                      Tổng thu: {vnd(subTotal(o.products))}
                    </span>
                  </div>
                  <div className="w-3/12">
                    <div>{o?.buyerName}</div>
                    <div>{o?.buyerPhone}</div>
                    <div>
                      {o?.toAddress +
                        ", " +
                        o?.toWard +
                        ", " +
                        o?.toDistrict +
                        ", " +
                        o?.toCity}
                    </div>
                  </div>
                  <div className="w-2/12">
                    <button
                      className="block p-2 hover:bg-primary rounded hover:text-white"
                      onClick={() => handleClick1(o?._id, 2)}
                    >
                      Xác nhận giao xong
                    </button>
                    <button
                      className="block p-2 hover:bg-blue-500 rounded hover:text-white"
                      onClick={() => handleClick1(o?._id, 1)}
                    >
                      Điều giao nhận
                    </button>
                    <button
                      className="block p-2 hover:bg-red-500 rounded hover:text-white"
                      onClick={() => handleClick1(o?._id, 3)}
                    >
                      Hủy giao nhận
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-2 text-center text-gray-700">Không có dữ liệu</div>
        )}
      </div>
    </div>
  );
};

export default Delivery;
