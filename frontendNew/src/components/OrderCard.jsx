import { vnd } from "../../ultis/ktsFunc";
// import { status } from "../../ultis/config";
import { toast } from "react-toastify";
import ktsRequest from "../../ultis/ktsrequest";
import { useState } from "react";
const Alert = ({ close, orderId, token }) => {
  const handleCancel = async () => {
    try {
      await ktsRequest.post(
        `/orders/${orderId}/cancel`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("Báo hủy đơn hàng thành công");
      close(false);
    } catch (error) {
      close(false);
      toast.error(error.response ? error.response.data : "Network error");
    }
  };
  return (
    <div className="absolute bg-black/50 h-screen w-screen top-0 left-0 flex justify-center items-center">
      <div className="bg-white rounded overflow-hidden pb-2">
        <h3 className="bg-red-500 text-white p-2">Cảnh báo!</h3>
        <p className="px-2 py-5">Bạn chắc chắn muốn hủy đơn hàng?</p>
        <div className="flex justify-end gap-2 px-2">
          <button
            className="border px-4 py-1 rounded bg-red-100 border-red-600 text-red-700 hover:border-red-600 hover:bg-red-600 hover:text-white"
            onClick={handleCancel}
          >
            Đúng
          </button>
          <button
            className="border px-4 py-1 border-blue-600 rounded bg-blue-600 text-white hover:bg-blue-700"
            onClick={() => close(false)}
          >
            Khoan đã
          </button>
        </div>
      </div>
    </div>
  );
};
const OrderCard = ({ data, openmodal, token, details }) => {
  const st = data.status;
  const orderDate = new Date(data.createdAt);
  const [openAlert, setOpenAlert] = useState(false);
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
  return (
    <div className="">
      {openAlert && (
        <Alert close={setOpenAlert} orderId={data._id} token={token} />
      )}
      <div className="hidden w-full md:flex p-1 gap-1 items-center">
        <div className="w-2/12 inline-block">
          <div className="font-semibold">{data.orderNumber}</div>
          <div className="">
            {orderDate.toLocaleTimeString() +
              " - " +
              orderDate.toLocaleDateString()}
          </div>
        </div>

        <div className="w-5/12">
          <ul className="space-y-1">
            {data.products.map((p, j) => {
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
                      <span className="font-semibold">{p.productName}</span>
                      <p className="text-red-500 italic text-xs">
                        {p.shopName}
                      </p>
                      <div className="">
                        <span>{vnd(p.currentPrice) + " * "}</span>
                        <span>{p.quantity + " = "}</span>
                        <span>{vnd(p.quantity * p.currentPrice)}</span>
                      </div>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
        <div className="w-2/12 font-semibold text-end pr-10">
          {vnd(data?.total)}
        </div>
        <div className="w-2/12 text-center text-xs">
          <span
            className={`${status[st].bgColor} ${status[st].textColor} px-1.5 py-0.5 font-semibold rounded`}
          >
            {status[st].name}
          </span>
        </div>
        <div className="w-1/12 flex gap-2">
          <button
            className={`p-1.5 rounded border bg-orange-100 border-orange-400 text-orange-600 hover:border-orange-400 hover:bg-orange-400 hover:text-white`}
            title="chi tiết đơn hàng"
            onClick={() => {
              details(data);
              openmodal(true);
            }}
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
                d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"
              />
            </svg>
          </button>
          <button
            className={`p-1.5 rounded border ${
              st > 0
                ? "bg-gray-300 border-gray-300"
                : "bg-white border-red-600 text-red-600 hover:border-red-600 hover:bg-red-600 hover:text-white"
            }`}
            disabled={st > 0}
            title="hủy đơn"
            onClick={() => setOpenAlert(!openAlert)}
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
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      </div>
      <div className="md:hidden p-2">
        <div className="flex justify-between">
          <span className="space-x-2">
            <span
              className={`${status[st].bgColor} ${status[st].textColor} px-1.5 py-0.5 font-semibold text-sm inline-block rounded`}
            >
              {status[st].name}
            </span>{" "}
            <span>{data.orderNumber}</span>
            <span>
              {" "}
              {orderDate.toLocaleDateString() +
                "-" +
                orderDate.toLocaleTimeString()}
            </span>
            <span className="font-semibold">{vnd(data.total)}</span>
          </span>
        </div>
        <div className="mt-3">
          <div className="font-semibold">Chi tiết</div>
          {data.products.map((p, j) => {
            return (
              <div key={j}>
                <span>{p.productName + "*" + p.quantity}</span>
              </div>
            );
          })}
        </div>
        <div className="flex gap-2 justify-end">
          <button
            className={`p-1.5 rounded border bg-orange-100 border-orange-400 text-orange-600 hover:border-orange-400 hover:bg-orange-400 hover:text-white`}
            // disabled={st > 1}
            title="chi tiết đơn hàng"
            onClick={() => {
              details(data);
              openmodal(true);
            }}
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
                d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"
              />
            </svg>
          </button>
          <button
            className={`p-1.5 rounded border ${
              st > 1
                ? "bg-gray-300 border-gray-300"
                : "bg-white border-red-600 text-red-600 hover:border-red-600 hover:bg-red-600 hover:text-white"
            }`}
            disabled={st > 1}
            title="hủy đơn"
            onClick={() => setOpenAlert(!openAlert)}
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
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderCard;
