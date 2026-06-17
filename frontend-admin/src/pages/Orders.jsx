import React, { useEffect, useMemo, useState } from "react";
import ktsRequest from "../../ultis/ktsrequest";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { vnd } from "../../ultis/ktsFunc";

const formatReceiptLabelDate = (value) => {
  const date = value ? new Date(value) : null;

  if (!date || Number.isNaN(date.getTime())) {
    return "-";
  }

  return date.toLocaleDateString("vi-VN");
};

const Orders = () => {
  const [data, setData] = useState([]);
  const [receipts, setReceipts] = useState([]);
  const [handoverDrafts, setHandoverDrafts] = useState({});
  const { currentUser } = useSelector((state) => state.user);
  const { token } = currentUser;
  const [refresh, setRefresh] = useState(false);
  const status = [
    {
      id: 0,
      bgColor: "bg-blue-300",
      name: "Chờ xác nhận",
      textColor: "text-blue-700",
    },
    {
      id: 1,
      bgColor: "border border-green-500",
      name: "Hàng đang chuẩn bị",
      textColor: "text-green-700",
    },
    {
      id: 2,
      bgColor: "bg-orange-300",
      name: "Đang giao",
      textColor: "text-orange-700",
    },
    {
      id: 3,
      bgColor: "bg-green-300",
      name: "Giao xong",
      textColor: "text-green-700",
    },
    { id: 4, bgColor: "bg-red-300", name: "Đã hủy", textColor: "text-red-700" },
  ];

  const receiptLabelMap = useMemo(() => {
    const dayCounters = {};
    const sortedReceipts = [...receipts].sort((left, right) => {
      const leftTime = new Date(left.importedDate || left.createdAt || 0).getTime();
      const rightTime = new Date(right.importedDate || right.createdAt || 0).getTime();

      if (leftTime !== rightTime) {
        return leftTime - rightTime;
      }

      return new Date(left.createdAt || 0).getTime() - new Date(right.createdAt || 0).getTime();
    });

    return sortedReceipts.reduce((accumulator, receipt) => {
      const dayKey = receipt.importedDate
        ? new Date(receipt.importedDate).toISOString().slice(0, 10)
        : "unknown";

      dayCounters[dayKey] = (dayCounters[dayKey] || 0) + 1;
      accumulator[receipt._id] = receipt.name || `${formatReceiptLabelDate(receipt.importedDate)} nhập kho lần ${dayCounters[dayKey]}`;
      return accumulator;
    }, {});
  }, [receipts]);

  const receiptMap = useMemo(() => {
    return receipts.reduce((accumulator, receipt) => {
      accumulator[receipt._id] = receipt;
      return accumulator;
    }, {});
  }, [receipts]);

  useEffect(() => {
    setRefresh(false);
    const fetchData = async () => {
      try {
        const requestConfig = {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        };

        const ordersPath = currentUser?.role === "admin" ? "/orders" : "/orders/my-orders";
        const [ordersResult, receiptsResult] = await Promise.allSettled([
          ktsRequest.get(ordersPath, requestConfig),
          currentUser?.role === "shop"
            ? ktsRequest.get(`/good-receipts/shop/${currentUser._id}`)
            : ktsRequest.get("/good-receipts"),
        ]);

        if (ordersResult.status === "rejected") {
          throw ordersResult.reason;
        }

        setData(ordersResult.value.data || []);

        if (receiptsResult.status === "fulfilled") {
          setReceipts(receiptsResult.value.data || []);
        } else {
          setReceipts([]);
        }
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

  const handleUpdateStatus = async (id, newStatus) => {
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

  const handleDraftChange = (orderId, field, value) => {
    setHandoverDrafts((prev) => ({
      ...prev,
      [orderId]: {
        ...(prev[orderId] || {}),
        [field]: value,
      },
    }));
  };

  const handleHandover = async (orderId) => {
    const draft = handoverDrafts[orderId] || {};

    try {
      const res = await ktsRequest.post(
        `/orders/${orderId}/handover`,
        {
          carrierName: draft.carrierName || "",
          trackingCode: draft.trackingCode || "",
          shippingOrderCode: draft.shippingOrderCode || "",
          note: draft.note || "",
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

  const handleCancel = async (orderId) => {
    try {
      const res = await ktsRequest.post(
        `/orders/${orderId}/cancel`,
        {},
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
          <div className="w-1/12 text-center">Ghi chú</div>
          <div className="w-1/12">Trạng thái</div>
          <div className="w-1/12">Thao tác</div>
        </div>
        {data?.length > 0 ? (
          <div className="rounded divide-y divide-primary divide-dashed text-gray-800">
            {data.map((o, i) => {
              const st = o.status;
              const handoverData = handoverDrafts[o._id] || o.shippingInfo || {};
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
                                {Array.isArray(p.receiptAllocations) && p.receiptAllocations.length > 0 && (
                                  <div className="mt-1 space-y-1 rounded bg-gray-50 px-2 py-1 text-[11px] text-gray-600">
                                    {p.receiptAllocations.map((allocation, allocationIndex) => {
                                      const receipt = receiptMap[allocation.goodReceiptId];
                                      const receiptName = receiptLabelMap[allocation.goodReceiptId] || "Phiếu nhập";
                                      const importedDate = receipt?.importedDate
                                        ? new Date(receipt.importedDate).toLocaleDateString("vi-VN")
                                        : "-";
                                      const expirationDate = receipt?.expirationDate
                                        ? new Date(receipt.expirationDate).toLocaleDateString("vi-VN")
                                        : "-";

                                      return (
                                        <div
                                          key={`${allocation.goodReceiptId}-${allocationIndex}`}
                                          className="flex flex-col gap-0.5 rounded border border-gray-100 bg-white px-2 py-1"
                                        >
                                          <div className="flex items-center justify-between gap-2">
                                            <span className="font-medium text-gray-700">
                                              {receiptName}
                                            </span>
                                            <span className="whitespace-nowrap font-semibold text-gray-800">
                                              x {allocation.quantity}
                                            </span>
                                          </div>
                                          <div className="text-[10px] text-gray-500">
                                            {`Nhập kho: ${importedDate} | HSD: ${expirationDate}`}
                                          </div>
                                        </div>
                                      );
                                    })}
                                  </div>
                                )}
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
                  <div className="w-1/12">{o?.note}</div>
                  <div className="w-1/12">
                    {" "}
                    <span
                      className={`${status[st].bgColor} ${status[st].textColor} px-1.5 py-0.5 text-xs font-semibold rounded`}
                    >
                      {status[st].name}
                    </span>
                  </div>
                  <div className="w-1/12 text-xs space-y-1">
                    {st === 0 && (
                      <button
                        className="w-full rounded border border-blue-600 bg-blue-50 px-2 py-1 text-blue-700 hover:bg-blue-600 hover:text-white"
                        onClick={() => handleUpdateStatus(o._id, 1)}
                      >
                        Xác nhận đơn hàng
                      </button>
                    )}

                    {currentUser?.role === "admin" && st < 3 && (
                      <button
                        className="w-full rounded border border-red-600 bg-red-50 px-2 py-1 text-red-700 hover:bg-red-600 hover:text-white"
                        onClick={() => handleCancel(o._id)}
                      >
                        Hủy đơn hàng
                      </button>
                    )}

                    {st === 1 && (
                      <div className="space-y-1">
                        <input
                          className="w-full rounded border px-2 py-1"
                          placeholder="Đơn vị vận chuyển"
                          value={handoverData.carrierName || ""}
                          onChange={(e) =>
                            handleDraftChange(o._id, "carrierName", e.target.value)
                          }
                        />
                        <input
                          className="w-full rounded border px-2 py-1"
                          placeholder="Mã vận đơn"
                          value={handoverData.trackingCode || ""}
                          onChange={(e) =>
                            handleDraftChange(o._id, "trackingCode", e.target.value)
                          }
                        />
                        <input
                          className="w-full rounded border px-2 py-1"
                          placeholder="Mã đơn vận chuyển (tuỳ chọn)"
                          value={handoverData.shippingOrderCode || ""}
                          onChange={(e) =>
                            handleDraftChange(o._id, "shippingOrderCode", e.target.value)
                          }
                        />
                        <button
                          className="w-full rounded border border-orange-600 bg-orange-50 px-2 py-1 text-orange-700 hover:bg-orange-500 hover:text-white"
                          onClick={() => handleHandover(o._id)}
                        >
                          Bàn giao vận chuyển
                        </button>
                      </div>
                    )}

                    {st >= 2 && (
                      <div className="text-gray-600">
                        {o?.shippingInfo?.carrierName && (
                          <div>{`DVVC: ${o.shippingInfo.carrierName}`}</div>
                        )}
                        {o?.shippingInfo?.trackingCode && (
                          <div>{`Mã vận đơn: ${o.shippingInfo.trackingCode}`}</div>
                        )}
                      </div>
                    )}
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
