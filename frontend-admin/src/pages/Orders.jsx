import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import ktsRequest from "../../ultis/ktsrequest";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { vnd } from "../../ultis/ktsFunc";

const Orders = () => {
  const [data, setData] = useState([]);
  const { currentUser } = useSelector((state) => state.user);
  const { token } = currentUser;
  const [refresh, setRefresh] = useState(false);
  const status = [
    {
      id: 0,
      bgColor: "bg-blue-300",
      name: "Đơn mới",
      textColor: "text-blue-700",
    },
    {
      id: 1,
      bgColor: "border border-green-500",
      name: "Sẵn sàng thu gom",
      textColor: "text-green-700",
    },
    {
      id: 2,
      bgColor: "bg-green-300",
      name: "Giao xong",
      textColor: "text-green-700",
    },
    {
      id: 3,
      bgColor: "bg-orange-300",
      name: "Đang giao",
      textColor: "text-orange-700",
    },

    { id: 4, bgColor: "bg-red-300", name: "Đã hủy", textColor: "text-red-700" },
  ];
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
  return (
    <div className="w-full p-2">
      <div className="mb-3 flex justify-end">
        <button
          className="px-3 py-1.5 rounded bg-primary text-white hover:bg-green-700"
          onClick={() => setRefresh(true)}
        >
          Làm mới đơn hàng
        </button>
      </div>
      <div className="w-full mt-4 bg-white shadow-lg rounded-md overflow-hidden">
        <div className=" flex p-3 font-semibold items-center bg-primary text-white">
          <div className="w-1/4 flex">
            <div className="w-1/2">Ngày</div>
            <div className="w-1/2">Mã đơn hàng</div>
          </div>
          <div className="w-3/12">Chi tiết đơn hàng</div>
          <div className="w-1/12">Thành tiền</div>
          <div className="w-2/12 text-center">Khách hàng</div>
          <div className="w-2/12 text-center">Ghi chú</div>
          <div className="w-1/12">Trạng thái</div>
        </div>
        {data?.length > 0 ? (
          <div className="rounded divide-y divide-primary divide-dashed text-gray-800">
            {data.map((o, i) => {
              const st = o.status;
              return (
                <div className="w-full flex p-1 gap-1 items-center" key={i}>
                  <div className="w-1/4 flex">
                    <div className="w-1/2">
                      {new Date(o.createdAt).toLocaleString()}
                    </div>
                    <div className="w-1/2">{o.orderNumber}</div>
                  </div>
                  <div className="w-3/12">
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
                                <p className="font-semibold">{p.productName}</p>
                                <p className="text-xs italic text-red-500">
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
                  </div>
                  <div className="w-1/12 text-center font-semibold">
                    {vnd(subTotal(o.products))}
                  </div>
                  <div className="w-2/12 text-center">
                    <div>{o?.buyerName}</div>
                    <div>{o?.buyerPhone}</div>
                  </div>
                  <div className="w-2/12">{o?.note}</div>
                  <div className="w-1/12">
                    {" "}
                    <span
                      className={`${status[st].bgColor} ${status[st].textColor} px-1.5 py-0.5 text-xs font-semibold rounded`}
                    >
                      {status[st].name}
                    </span>
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

export default Orders;
