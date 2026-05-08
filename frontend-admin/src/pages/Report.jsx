import React, { useState, useEffect } from "react";
import { vnd } from "../../ultis/ktsFunc";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import ktsRequest from "../../ultis/ktsrequest";
const Cart = (props) => {
  return (
    <div className="w-full bg-white rounded-md p-3 h-32 flex justify-center items-center flex-col gap-2">
      <div className="font-semibold">{props?.title}</div>
      <div className="text-3xl font-semibold">
        {props?.vnd ? vnd(props?.data) : props?.data}
      </div>
    </div>
  );
};

const Report = () => {
  const [repostData, setReportData] = useState({});
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);
  const { token } = currentUser;
  useEffect(() => {
    if (!["admin", "special"].includes(currentUser.role)) {
      return navigate("/login");
    }
    const fetchData = async () => {
      const res = await ktsRequest.post(
        "/reports",
        {},
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setReportData(res.data);
    };
    fetchData();
  }, []);
  return (
    <div className="w-full grid grid-cols-3 p-2 gap-3">
      <Cart title={"Tổng lượng truy cập"} data={repostData.visitorsCount} />
      <Cart title={"Tổng số sản phẩm"} data={repostData.totalProducts} />
      <Cart title={"Số sản phẩm mới"} data={repostData.newProducts} />
      <Cart title={"Số người bán"} data={repostData.totalShop} />
      <Cart title={"Số người bán mới"} data={repostData.newShop} />
      <Cart title={"Tổng số đơn hàng"} data={repostData.totalOrders} />
      <Cart
        title={"Tổng số đơn hàng thành công"}
        data={repostData.successOrders}
      />
      <Cart
        title={"Tổng số đơn hàng không thành công"}
        data={repostData.failOrders}
      />
      <Cart
        title={"Tổng giá trị giao dịch thành công"}
        data={repostData.successValue}
        vnd={true}
      />
    </div>
  );
};

export default Report;
