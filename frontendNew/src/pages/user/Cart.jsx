import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Footer, Header, Navbar, Promotion } from "../../components";
import QRCodeImage from "../../assets/imgs/QR_CodeFull1.jpg";
import { vnd } from "../../../ultis/ktsFunc";
import ktsRequest from "../../../ultis/ktsrequest";
import {
  setCart,
  resetCart,
  updateQuantityLocal,
  removeItemLocal,
} from "../../redux/cartReducer";

const shippingOptions = [
  { value: "ems", label: "EMS VIETNAM (Chuyển phát nhanh)" },
  { value: "vnpost", label: "VIETNAM POST (Bưu điện)" },
  { value: "best", label: "BEST EXPRESS" },
  { value: "be", label: "BE (Giao trong ngày - tươi sống)" },
  { value: "grab", label: "GRAB (Giao trong ngày - tức thời)" },
];

const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { products } = useSelector((state) => state.cart);
  const { currentUser } = useSelector((state) => state.user);
  const [loading, setLoading] = useState(false);
  const [showBankPaymentPopup, setShowBankPaymentPopup] = useState(false);
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
    const userId = currentUser._id || currentUser.id;

    setFormData((prev) => ({
      ...prev,
      buyerName:
        currentUser.fullname ||
        currentUser.displayName ||
        currentUser.username ||
        "",
      buyerPhone: currentUser.phone || "",
      toAddress: currentUser.address || "",
      toCity: currentUser.cityName || "",
      toDistrict: currentUser.districtName || "",
      toWard: currentUser.wardName || "",
    }));
    // load server cart via direct request
    (async () => {
      try {
        const res = await ktsRequest.get(`/carts/${userId}`, {
          headers: { Authorization: `Bearer ${currentUser.token}` },
        });
        // log res.data for debugging
        console.log("Cart data from server:", res.data);
        dispatch(setCart(res.data?.products || []));
      } catch (err) {
        // ignore
      }
    })();
  }, [currentUser]);

  const total = useMemo(() => {
    return products.reduce(
      (sum, item) => sum + item.currentPrice * item.quantity,
      0,
    );
  }, [products]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === "payment" && value !== "bank") {
      setShowBankPaymentPopup(false);
    }
  };

  const submitOrder = async () => {
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

      console.log("[Cart] submit order payload:", payload);

      const res = await ktsRequest.post("/orders", payload, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${currentUser.token}`,
        },
      });

      console.log("[Cart] order response:", res.data);

      toast.success(res.data?.message || "Tạo đơn hàng thành công");
      try {
        await ktsRequest.post(
          "/carts/clear",
          {},
          { headers: { Authorization: `Bearer ${currentUser.token}` } },
        );
      } catch (err) {
        // ignore
      }
      dispatch(resetCart());
      setShowBankPaymentPopup(false);
      navigate("/products");
    } catch (error) {
      console.error("[Cart] order submit failed:", {
        message: error?.message,
        status: error?.response?.status,
        data: error?.response?.data,
      });
      toast.error(error.response ? error.response.data : "Network Error!");
    } finally {
      setLoading(false);
    }
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

    if (formData.payment === "bank" && !showBankPaymentPopup) {
      setShowBankPaymentPopup(true);
      toast.info(
        "Vui lòng quét QR trong pop-up, sau đó bấm Hoàn thành để tạo đơn hàng.",
      );
      return;
    }

    await submitOrder();
  };

  const handleCompleteBankPayment = async () => {
    if (loading) {
      return;
    }

    await submitOrder();
  };

  const handleCancelBankPayment = () => {
    if (loading) {
      return;
    }

    setShowBankPaymentPopup(false);
  };

  const handleQuantityChange = (id, quantity) => {
    if (!currentUser) {
      dispatch(updateQuantityLocal({ id, quantity }));
      return;
    }
    (async () => {
      try {
        await ktsRequest.post(
          "/carts/update",
          { productId: id, quantity },
          { headers: { Authorization: `Bearer ${currentUser.token}` } },
        );
        dispatch(updateQuantityLocal({ id, quantity }));
      } catch (err) {
        // ignore
      }
    })();
  };

  return (
    <div>
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
            <h2 className="text-xl font-semibold text-gray-800">
              Giỏ hàng trống
            </h2>
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
                    <span className="text-sm font-medium text-gray-700">
                      Họ tên
                    </span>
                    <input
                      name="buyerName"
                      value={formData.buyerName}
                      onChange={handleChange}
                      className="w-full rounded border border-gray-300 px-3 py-2 focus:border-primary focus:outline-none"
                      placeholder="Nguyễn Văn A"
                    />
                  </label>
                  <label className="space-y-1">
                    <span className="text-sm font-medium text-gray-700">
                      Số điện thoại
                    </span>
                    <input
                      name="buyerPhone"
                      value={formData.buyerPhone}
                      onChange={handleChange}
                      className="w-full rounded border border-gray-300 px-3 py-2 focus:border-primary focus:outline-none"
                      placeholder="09xxxxxxxx"
                    />
                  </label>
                  <label className="space-y-1">
                    <span className="text-sm font-medium text-gray-700">
                      Tỉnh / Thành phố
                    </span>
                    <input
                      name="toCity"
                      value={formData.toCity}
                      onChange={handleChange}
                      className="w-full rounded border border-gray-300 px-3 py-2 focus:border-primary focus:outline-none"
                      placeholder="TP. Hồ Chí Minh"
                    />
                  </label>
                  <label className="space-y-1">
                    <span className="text-sm font-medium text-gray-700">
                      Quận / Huyện
                    </span>
                    <input
                      name="toDistrict"
                      value={formData.toDistrict}
                      onChange={handleChange}
                      className="w-full rounded border border-gray-300 px-3 py-2 focus:border-primary focus:outline-none"
                      placeholder="Quận 1"
                    />
                  </label>
                  <label className="space-y-1">
                    <span className="text-sm font-medium text-gray-700">
                      Phường / Xã
                    </span>
                    <input
                      name="toWard"
                      value={formData.toWard}
                      onChange={handleChange}
                      className="w-full rounded border border-gray-300 px-3 py-2 focus:border-primary focus:outline-none"
                      placeholder="Phường Bến Nghé"
                    />
                  </label>
                  <label className="space-y-1">
                    <span className="text-sm font-medium text-gray-700">
                      Địa chỉ chi tiết
                    </span>
                    <input
                      name="toAddress"
                      value={formData.toAddress}
                      onChange={handleChange}
                      className="w-full rounded border border-gray-300 px-3 py-2 focus:border-primary focus:outline-none"
                      placeholder="Số nhà, tên đường..."
                    />
                  </label>
                  <label className="space-y-1 md:col-span-2">
                    <span className="text-sm font-medium text-gray-700">
                      Ghi chú
                    </span>
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
                    <span className="text-sm font-medium text-gray-700">
                      Thanh toán
                    </span>
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
                    <span className="text-sm font-medium text-gray-700">
                      Phương thức vận chuyển
                    </span>
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
                  <h2 className="text-lg font-semibold text-gray-800">
                    Sản phẩm trong giỏ
                  </h2>
                  <button
                    type="button"
                    className="text-sm font-medium text-red-600 hover:underline"
                    onClick={() => {
                      if (!currentUser) {
                        dispatch(resetCart());
                        return;
                      }
                      (async () => {
                        try {
                          await ktsRequest.post(
                            "/carts/clear",
                            {},
                            {
                              headers: {
                                Authorization: `Bearer ${currentUser.token}`,
                              },
                            },
                          );
                          dispatch(resetCart());
                        } catch (err) {
                          // ignore
                        }
                      })();
                    }}
                  >
                    Xóa tất cả
                  </button>
                </div>
                <div className="divide-y divide-dashed divide-gray-200">
                  {products.map((item) => (
                    <div
                      key={item.id}
                      className="flex flex-col gap-3 py-4 md:flex-row md:items-center"
                    >
                      <img
                        src={item.img}
                        alt=""
                        className="h-20 w-20 rounded-lg object-cover"
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-800">
                          {item.productName}
                        </h3>
                        <p className="text-sm text-gray-500">{item.shopName}</p>
                        <p className="mt-1 text-primary font-semibold">
                          {vnd(item.currentPrice)}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          className="h-9 w-9 rounded border border-gray-300 bg-gray-100 text-lg text-gray-700 hover:bg-gray-200"
                          onClick={() =>
                            handleQuantityChange(item.id, item.quantity - 1)
                          }
                          disabled={item.quantity <= 1}
                        >
                          -
                        </button>
                        <input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(event) =>
                            handleQuantityChange(item.id, event.target.value)
                          }
                          className="w-16 rounded border border-gray-300 px-2 py-2 text-center focus:border-primary focus:outline-none"
                        />
                        <button
                          type="button"
                          className="h-9 w-9 rounded border border-gray-300 bg-gray-100 text-lg text-gray-700 hover:bg-gray-200"
                          onClick={() =>
                            handleQuantityChange(item.id, item.quantity + 1)
                          }
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
                        onClick={() => {
                          if (!currentUser) {
                            dispatch(removeItemLocal(item.id));
                            return;
                          }
                          (async () => {
                            try {
                              await ktsRequest.delete("/carts/remove", {
                                headers: {
                                  Authorization: `Bearer ${currentUser.token}`,
                                },
                                data: { productId: item.id },
                              });
                              dispatch(removeItemLocal(item.id));
                            } catch (err) {
                              // ignore
                            }
                          })();
                        }}
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
                <h2 className="mb-4 text-lg font-semibold text-gray-800">
                  Tổng đơn
                </h2>
                <div className="space-y-3 border-b border-dashed border-gray-200 pb-4">
                  {products.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-start justify-between gap-3 text-sm text-gray-700"
                    >
                      <div>
                        <p className="font-medium">{item.productName}</p>
                        <p className="text-gray-500">x {item.quantity}</p>
                      </div>
                      <p className="font-semibold">
                        {vnd(item.currentPrice * item.quantity)}
                      </p>
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
      {showBankPaymentPopup && formData.payment === "bank" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
          <div className="w-full max-w-2xl rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Thanh toán chuyển khoản
                </h3>
                <p className="text-sm text-gray-500">
                  Quét QR và bấm Hoàn thành để tạo đơn hàng.
                </p>
              </div>
              <button
                type="button"
                onClick={handleCancelBankPayment}
                className="rounded-full px-3 py-1 text-sm font-semibold text-gray-500 hover:bg-gray-100 hover:text-gray-800"
                aria-label="Đóng pop-up"
              >
                x
              </button>
            </div>
            <div className="grid gap-6 px-5 py-5 md:grid-cols-[220px_1fr] md:items-center">
              <div className="mx-auto flex h-52 w-52 items-center justify-center rounded-2xl bg-green-50 p-3 shadow-inner">
                <img
                  src={QRCodeImage}
                  alt="QR thanh toán chuyển khoản"
                  className="h-full w-full rounded-xl bg-white object-contain p-2"
                />
              </div>
              <div className="space-y-3">
                <div className="rounded-xl bg-gray-50 p-4 text-sm text-gray-700">
                  <p className="font-semibold text-gray-900">
                    Hướng dẫn thanh toán
                  </p>
                  <p className="mt-2">1. Mở app ngân hàng và quét mã QR.</p>
                  <p>2. Kiểm tra lại số tiền và nội dung chuyển khoản.</p>
                  <p>3. Khi đã chuyển xong, bấm Hoàn thành để tạo đơn hàng.</p>
                </div>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <button
                    type="button"
                    onClick={handleCompleteBankPayment}
                    disabled={loading}
                    className="inline-flex flex-1 items-center justify-center rounded-lg bg-green-700 px-4 py-3 font-semibold text-white hover:bg-green-800 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {loading ? "Đang xử lý..." : "Hoàn thành"}
                  </button>
                  <button
                    type="button"
                    onClick={handleCancelBankPayment}
                    disabled={loading}
                    className="inline-flex flex-1 items-center justify-center rounded-lg border border-gray-300 bg-white px-4 py-3 font-semibold text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    Hủy
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
};

export default Cart;
