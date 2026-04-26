import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Footer, Header, Navbar, Promotion } from "../../components";
import { vnd } from "../../../ultis/ktsFunc";
import ktsRequest from "../../../ultis/ktsrequest";
import { removeItem, resetCart, updateQuantity } from "../../redux/cartReducer";

const shippingOptions = [
  { value: "ems", label: "EMS VIETNAM (Chuyển phát nhanh)" },
  { value: "vnpost", label: "VIETNAM POST (Bưu điện)" },
  { value: "best", label: "BEST EXPRESS" },
];

const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { products } = useSelector((state) => state.cart);
  const { currentUser } = useSelector((state) => state.user);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    buyerName: "",
    buyerPhone: "",
    toCity: "",
    toDistrict: "",
    toWard: "",
    toAddress: "",
    note: "",
    payment: "cod",
    shipMode: "ems",
  });

  useEffect(() => {
    if (!currentUser) {
      return;
    }

    setFormData((prev) => ({
      ...prev,
      buyerName: currentUser.fullname || currentUser.displayName || currentUser.username || "",
      buyerPhone: currentUser.phone || "",
      toAddress: currentUser.address || "",
    }));
  }, [currentUser]);

  const total = useMemo(() => {
    return products.reduce((sum, item) => sum + item.currentPrice * item.quantity, 0);
  }, [products]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!currentUser) {
      toast.warn("Vui lòng đăng nhập để đặt hàng");
      navigate("/login");
      return;
    }

    if (products.length === 0) {
      toast.warn("Giỏ hàng đang trống");
      return;
    }

    if (
      !formData.buyerName ||
      !formData.buyerPhone ||
      !formData.toCity ||
      !formData.toDistrict ||
      !formData.toWard ||
      !formData.toAddress
    ) {
      toast.warn("Vui lòng điền đầy đủ thông tin giao hàng");
      return;
    }

    try {
      setLoading(true);
      const payload = {
        buyerName: formData.buyerName,
        buyerPhone: formData.buyerPhone,
        toCity: formData.toCity,
        toDistrict: formData.toDistrict,
        toWard: formData.toWard,
        toAddress: formData.toAddress,
        note: formData.note,
        payment: formData.payment,
        shipMode: formData.shipMode,
        products: products.map((item) => ({
          id: item.id,
          quantity: item.quantity,
          shopID: item.shopID,
          price: item.currentPrice,
          currentPrice: item.currentPrice,
          img: item.img,
          shopName: item.shopName,
          productName: item.productName,
        })),
      };

      const res = await ktsRequest.post("/orders", payload, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${currentUser.token}`,
        },
      });

      toast.success(res.data?.message || "Tạo đơn hàng thành công");
      dispatch(resetCart());
      navigate("/products");
    } catch (error) {
      toast.error(error.response ? error.response.data : "Network Error!");
    } finally {
      setLoading(false);
    }
  };

  const handleQuantityChange = (id, quantity) => {
    dispatch(updateQuantity({ id, quantity }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Promotion />
      <Header />
      <Navbar />
      <div className="max-w-screen-xl mx-auto px-3 py-6">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Giỏ hàng</h1>
            <p className="text-sm text-gray-500">
              Kiểm tra sản phẩm và điền thông tin giao hàng để tạo đơn.
            </p>
          </div>
          <Link
            to="/products"
            className="rounded border border-primary px-4 py-2 text-primary hover:bg-primary hover:text-white"
          >
            Tiếp tục mua hàng
          </Link>
        </div>

        {!currentUser ? (
          <div className="rounded-lg border border-dashed border-primary bg-white p-6 text-center shadow-sm">
            <p className="mb-3 text-gray-700">Bạn cần đăng nhập để đặt hàng.</p>
            <Link
              to="/login"
              className="inline-flex rounded bg-primary px-4 py-2 font-semibold text-white hover:bg-green-700"
            >
              Đăng nhập ngay
            </Link>
          </div>
        ) : products.length === 0 ? (
          <div className="rounded-lg border border-dashed border-gray-300 bg-white p-8 text-center shadow-sm">
            <h2 className="text-xl font-semibold text-gray-800">Giỏ hàng trống</h2>
            <p className="mt-2 text-gray-500">
              Hãy thêm sản phẩm từ danh sách hàng hóa trước khi thanh toán.
            </p>
            <Link
              to="/products"
              className="mt-4 inline-flex rounded bg-primary px-4 py-2 font-semibold text-white hover:bg-green-700"
            >
              Xem sản phẩm
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-4">
              <div className="rounded-lg bg-white p-5 shadow-sm">
                <h2 className="mb-4 text-lg font-semibold text-gray-800">
                  Thông tin giao hàng
                </h2>
                <div className="grid gap-4 md:grid-cols-2">
                  <label className="space-y-1">
                    <span className="text-sm font-medium text-gray-700">Họ tên</span>
                    <input
                      name="buyerName"
                      value={formData.buyerName}
                      onChange={handleChange}
                      className="w-full rounded border border-gray-300 px-3 py-2 focus:border-primary focus:outline-none"
                      placeholder="Nguyễn Văn A"
                    />
                  </label>
                  <label className="space-y-1">
                    <span className="text-sm font-medium text-gray-700">Số điện thoại</span>
                    <input
                      name="buyerPhone"
                      value={formData.buyerPhone}
                      onChange={handleChange}
                      className="w-full rounded border border-gray-300 px-3 py-2 focus:border-primary focus:outline-none"
                      placeholder="09xxxxxxxx"
                    />
                  </label>
                  <label className="space-y-1">
                    <span className="text-sm font-medium text-gray-700">Tỉnh / Thành phố</span>
                    <input
                      name="toCity"
                      value={formData.toCity}
                      onChange={handleChange}
                      className="w-full rounded border border-gray-300 px-3 py-2 focus:border-primary focus:outline-none"
                      placeholder="TP. Hồ Chí Minh"
                    />
                  </label>
                  <label className="space-y-1">
                    <span className="text-sm font-medium text-gray-700">Quận / Huyện</span>
                    <input
                      name="toDistrict"
                      value={formData.toDistrict}
                      onChange={handleChange}
                      className="w-full rounded border border-gray-300 px-3 py-2 focus:border-primary focus:outline-none"
                      placeholder="Quận 1"
                    />
                  </label>
                  <label className="space-y-1">
                    <span className="text-sm font-medium text-gray-700">Phường / Xã</span>
                    <input
                      name="toWard"
                      value={formData.toWard}
                      onChange={handleChange}
                      className="w-full rounded border border-gray-300 px-3 py-2 focus:border-primary focus:outline-none"
                      placeholder="Phường Bến Nghé"
                    />
                  </label>
                  <label className="space-y-1">
                    <span className="text-sm font-medium text-gray-700">Địa chỉ chi tiết</span>
                    <input
                      name="toAddress"
                      value={formData.toAddress}
                      onChange={handleChange}
                      className="w-full rounded border border-gray-300 px-3 py-2 focus:border-primary focus:outline-none"
                      placeholder="Số nhà, tên đường..."
                    />
                  </label>
                  <label className="space-y-1 md:col-span-2">
                    <span className="text-sm font-medium text-gray-700">Ghi chú</span>
                    <textarea
                      name="note"
                      rows="4"
                      value={formData.note}
                      onChange={handleChange}
                      className="w-full rounded border border-gray-300 px-3 py-2 focus:border-primary focus:outline-none"
                      placeholder="Lưu ý cho người giao hàng..."
                    />
                  </label>
                  <label className="space-y-1 md:col-span-2">
                    <span className="text-sm font-medium text-gray-700">Thanh toán</span>
                    <select
                      name="payment"
                      value={formData.payment}
                      onChange={handleChange}
                      className="w-full rounded border border-gray-300 px-3 py-2 focus:border-primary focus:outline-none"
                    >
                      <option value="cod">Thanh toán khi nhận hàng</option>
                      <option value="bank">Chuyển khoản ngân hàng</option>
                    </select>
                  </label>
                  <label className="space-y-1 md:col-span-2">
                    <span className="text-sm font-medium text-gray-700">Phương thức vận chuyển</span>
                    <select
                      name="shipMode"
                      value={formData.shipMode}
                      onChange={handleChange}
                      className="w-full rounded border border-gray-300 px-3 py-2 focus:border-primary focus:outline-none"
                    >
                      {shippingOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>
              </div>

              <div className="rounded-lg bg-white p-5 shadow-sm">
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-800">Sản phẩm trong giỏ</h2>
                  <button
                    type="button"
                    className="text-sm font-medium text-red-600 hover:underline"
                    onClick={() => dispatch(resetCart())}
                  >
                    Xóa tất cả
                  </button>
                </div>
                <div className="divide-y divide-dashed divide-gray-200">
                  {products.map((item) => (
                    <div key={item.id} className="flex flex-col gap-3 py-4 md:flex-row md:items-center">
                      <img
                        src={item.img}
                        alt=""
                        className="h-20 w-20 rounded-lg object-cover"
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-800">{item.productName}</h3>
                        <p className="text-sm text-gray-500">{item.shopName}</p>
                        <p className="mt-1 text-primary font-semibold">{vnd(item.currentPrice)}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          className="h-9 w-9 rounded border border-gray-300 bg-gray-100 text-lg text-gray-700 hover:bg-gray-200"
                          onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                        >
                          -
                        </button>
                        <input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(event) => handleQuantityChange(item.id, event.target.value)}
                          className="w-16 rounded border border-gray-300 px-2 py-2 text-center focus:border-primary focus:outline-none"
                        />
                        <button
                          type="button"
                          className="h-9 w-9 rounded border border-gray-300 bg-gray-100 text-lg text-gray-700 hover:bg-gray-200"
                          onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                        >
                          +
                        </button>
                      </div>
                      <div className="min-w-32 text-right font-semibold text-gray-800">
                        {vnd(item.currentPrice * item.quantity)}
                      </div>
                      <button
                        type="button"
                        className="text-sm font-medium text-red-600 hover:underline md:pl-3"
                        onClick={() => dispatch(removeItem(item.id))}
                      >
                        Xóa
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="sticky top-4 rounded-lg bg-white p-5 shadow-sm">
                <h2 className="mb-4 text-lg font-semibold text-gray-800">Tổng đơn</h2>
                <div className="space-y-3 border-b border-dashed border-gray-200 pb-4">
                  {products.map((item) => (
                    <div key={item.id} className="flex items-start justify-between gap-3 text-sm text-gray-700">
                      <div>
                        <p className="font-medium">{item.productName}</p>
                        <p className="text-gray-500">x {item.quantity}</p>
                      </div>
                      <p className="font-semibold">{vnd(item.currentPrice * item.quantity)}</p>
                    </div>
                  ))}
                </div>
                <div className="flex items-center justify-between py-4 text-base font-semibold text-gray-800">
                  <span>Tạm tính</span>
                  <span>{vnd(total)}</span>
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded bg-green-700 px-4 py-3 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? "Đang xử lý..." : "Đặt hàng ngay"}
                </button>
                <p className="mt-3 text-xs text-gray-500">
                  Đơn hàng sẽ được tạo ngay sau khi bạn xác nhận thông tin.
                </p>
              </div>
            </div>
          </form>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Cart;
