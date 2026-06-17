import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Footer, Header, Navbar, Promotion } from "../../components";
import { vnd } from "../../../ultis/ktsFunc";
import ktsRequest from "../../../ultis/ktsrequest";
import { useDispatch, useSelector } from "react-redux";
import { loginSuccess } from "../../redux/userSlice";
import { uploadSingleFile } from "../../../ultis/handleFile";

const STATUS_LABEL = {
  0: "Chờ xác nhận",
  1: "Đang chuẩn bị",
  2: "Đang giao",
  3: "Đã hoàn thành",
  4: "Đã hủy",
};

const Profile = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.user);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingOrderId, setUpdatingOrderId] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [profileData, setProfileData] = useState({
    fullname: "",
    phone: "",
    email: "",
    address: "",
    cityName: "",
    districtName: "",
    wardName: "",
    img: "",
  });

  useEffect(() => {
    if (currentUser) {
      setProfileData({
        fullname: currentUser.fullname || currentUser.displayName || "",
        phone: currentUser.phone || "",
        email: currentUser.email || "",
        address: currentUser.address || "",
        cityName: currentUser.cityName || "",
        districtName: currentUser.districtName || "",
        wardName: currentUser.wardName || "",
        img: currentUser.img || "",
      });
    }
  }, [currentUser]);

  const orderStats = useMemo(() => {
    return orders.reduce(
      (stats, order) => {
        stats.total += 1;
        if (order.status === 2) {
          stats.shipping += 1;
        }
        if (order.status === 3) {
          stats.delivered += 1;
        }
        return stats;
      },
      { total: 0, shipping: 0, delivered: 0 },
    );
  }, [orders]);

  const fetchOrders = async () => {
    if (!currentUser?.token) {
      setOrders([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const res = await ktsRequest.get("/orders", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${currentUser.token}`,
        },
      });
      setOrders(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      if (error.response?.status === 403) {
        setOrders([]);
      } else {
        toast.error(error.response?.data || "Không thể tải đơn hàng");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!currentUser) {
      toast.warn("Vui lòng đăng nhập để xem trang cá nhân");
      navigate("/login");
      return;
    }

    fetchOrders();
  }, [currentUser, navigate]);

  const handleConfirmDelivered = async (orderId) => {
    try {
      setUpdatingOrderId(orderId);
      const res = await ktsRequest.put(
        `/orders/${orderId}`,
        { status: 3 },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${currentUser.token}`,
          },
        },
      );

      toast.success(res.data || "Xác nhận nhận hàng thành công");
      await fetchOrders();
    } catch (error) {
      toast.error(error.response?.data || "Không thể xác nhận đơn hàng");
    } finally {
      setUpdatingOrderId("");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileUpload = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      uploadImage(selectedFile);
    }
  };

  const uploadImage = async (fileToUpload) => {
    try {
      setUploadingAvatar(true);
      const downloadURL = await uploadSingleFile(
        fileToUpload,
        `users/${currentUser._id}`,
      );
      setProfileData((prev) => ({ ...prev, img: downloadURL }));
      toast.success("Tải ảnh thành công");
    } catch (error) {
      toast.error(error.message || "Tải ảnh thất bại");
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      setIsUpdatingProfile(true);
      const res = await ktsRequest.put(
        `/users/${currentUser._id}`,
        profileData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${currentUser.token}`,
          },
        },
      );

      const updatedUser = { ...res.data.data, token: currentUser.token };
      dispatch(loginSuccess(updatedUser));
      toast.success(res.data.message || "Cập nhật thông tin thành công");
      setIsEditing(false);
    } catch (error) {
      toast.error(error.response?.data || "Cập nhật thất bại");
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  if (!currentUser) {
    return null;
  }

  return (
    <div>
      <Promotion />
      <Header />
      <Navbar />
      <div className="mx-auto max-w-screen-xl px-3 py-6">
        <div className="mb-6 rounded-lg bg-white p-5 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-4">
              <div className="relative group">
                <div className="w-16 h-16 rounded-full border-2 border-gray-300 overflow-hidden flex justify-center items-center text-gray-400 text-xl font-bold bg-gray-100">
                  {profileData.img ? (
                    <img
                      src={profileData.img}
                      alt={profileData.fullname || "Avatar"}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    (profileData.fullname || currentUser.displayName || currentUser.username || "A")
                      .charAt(0)
                      .toUpperCase()
                  )}
                </div>
                {isEditing && (
                  <label className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 rounded-full opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                      stroke="white"
                      className="w-6 h-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z"
                      />
                    </svg>
                    <input
                      type="file"
                      hidden
                      onChange={handleFileUpload}
                      accept="image/*"
                    />
                  </label>
                )}
                {uploadingAvatar && (
                  <div className="absolute -bottom-1 left-0 w-full h-1 bg-gray-200 rounded overflow-hidden">
                    <div className="h-full w-full bg-primary animate-pulse"></div>
                  </div>
                )}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">
                  Trang cá nhân
                </h1>
                <p className="mt-1 text-sm text-gray-500">
                  Quản lý thông tin cơ bản và theo dõi đơn hàng của bạn.
                </p>
              </div>
            </div>
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="rounded border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Chỉnh sửa thông tin
              </button>
            )}
          </div>

          {isEditing ? (
            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <label className="space-y-1">
                  <span className="text-sm font-medium text-gray-700">
                    Họ tên
                  </span>
                  <input
                    name="fullname"
                    value={profileData.fullname}
                    onChange={handleInputChange}
                    className="w-full rounded border border-gray-300 px-3 py-2 focus:border-primary focus:outline-none"
                    placeholder="Nguyễn Văn A"
                  />
                </label>
                <label className="space-y-1">
                  <span className="text-sm font-medium text-gray-700">
                    Số điện thoại
                  </span>
                  <input
                    name="phone"
                    value={profileData.phone}
                    onChange={handleInputChange}
                    className="w-full rounded border border-gray-300 px-3 py-2 focus:border-primary focus:outline-none"
                    placeholder="09xxxxxxxx"
                  />
                </label>
                <label className="space-y-1">
                  <span className="text-sm font-medium text-gray-700">
                    Email
                  </span>
                  <input
                    name="email"
                    type="email"
                    value={profileData.email}
                    onChange={handleInputChange}
                    className="w-full rounded border border-gray-300 px-3 py-2 focus:border-primary focus:outline-none"
                    placeholder="email@example.com"
                  />
                </label>
                <label className="space-y-1">
                  <span className="text-sm font-medium text-gray-700">
                    Tỉnh / Thành phố
                  </span>
                  <input
                    name="cityName"
                    value={profileData.cityName}
                    onChange={handleInputChange}
                    className="w-full rounded border border-gray-300 px-3 py-2 focus:border-primary focus:outline-none"
                  />
                </label>
                <label className="space-y-1">
                  <span className="text-sm font-medium text-gray-700">
                    Quận / Huyện
                  </span>
                  <input
                    name="districtName"
                    value={profileData.districtName}
                    onChange={handleInputChange}
                    className="w-full rounded border border-gray-300 px-3 py-2 focus:border-primary focus:outline-none"
                  />
                </label>
                <label className="space-y-1">
                  <span className="text-sm font-medium text-gray-700">
                    Phường / Xã
                  </span>
                  <input
                    name="wardName"
                    value={profileData.wardName}
                    onChange={handleInputChange}
                    className="w-full rounded border border-gray-300 px-3 py-2 focus:border-primary focus:outline-none"
                  />
                </label>
                <label className="space-y-1 md:col-span-2">
                  <span className="text-sm font-medium text-gray-700">
                    Địa chỉ chi tiết
                  </span>
                  <input
                    name="address"
                    value={profileData.address}
                    onChange={handleInputChange}
                    className="w-full rounded border border-gray-300 px-3 py-2 focus:border-primary focus:outline-none"
                  />
                </label>
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="rounded border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={isUpdatingProfile}
                  className="rounded border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  {isUpdatingProfile ? "Đang lưu..." : "Lưu thay đổi"}
                </button>
              </div>
            </form>
          ) : (
            <div className="grid gap-3 md:grid-cols-3">
              <div className="rounded border border-gray-200 bg-gray-50 p-3">
                <p className="text-xs uppercase text-gray-500">Họ tên</p>
                <p className="font-semibold text-gray-800">
                  {currentUser.fullname ||
                    currentUser.displayName ||
                    currentUser.username}
                </p>
              </div>
              <div className="rounded border border-gray-200 bg-gray-50 p-3">
                <p className="text-xs uppercase text-gray-500">Số điện thoại</p>
                <p className="font-semibold text-gray-800">
                  {currentUser.phone || "Chưa cập nhật"}
                </p>
              </div>
              <div className="rounded border border-gray-200 bg-gray-50 p-3">
                <p className="text-xs uppercase text-gray-500">Email</p>
                <p className="font-semibold text-gray-800">
                  {currentUser.email || "Chưa cập nhật"}
                </p>
              </div>
              <div className="rounded border border-gray-200 bg-gray-50 p-3 md:col-span-3">
                <p className="text-xs uppercase text-gray-500">
                  Địa chỉ giao hàng mặc định
                </p>
                <p className="font-semibold text-gray-800">
                  {currentUser.address
                    ? `${currentUser.address}${currentUser.wardName ? `, ${currentUser.wardName}` : ""}${currentUser.districtName ? `, ${currentUser.districtName}` : ""}${currentUser.cityName ? `, ${currentUser.cityName}` : ""}`
                    : "Chưa cập nhật địa chỉ"}
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="mb-6 grid gap-3 md:grid-cols-3">
          <div className="rounded-lg bg-white p-4 shadow-sm">
            <p className="text-sm text-gray-500">Tổng đơn hàng</p>
            <p className="text-2xl font-bold text-gray-800">
              {orderStats.total}
            </p>
          </div>
          <div className="rounded-lg bg-white p-4 shadow-sm">
            <p className="text-sm text-gray-500">Đơn đang giao</p>
            <p className="text-2xl font-bold text-orange-600">
              {orderStats.shipping}
            </p>
          </div>
          <div className="rounded-lg bg-white p-4 shadow-sm">
            <p className="text-sm text-gray-500">Đơn đã hoàn thành</p>
            <p className="text-2xl font-bold text-green-700">
              {orderStats.delivered}
            </p>
          </div>
        </div>

        <div className="rounded-lg bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-800">
              Đơn hàng của bạn
            </h2>
            <Link
              to="/products"
              className="rounded border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Mua thêm sản phẩm
            </Link>
          </div>

          {loading ? (
            <p className="text-sm text-gray-500">
              Đang tải dữ liệu đơn hàng...
            </p>
          ) : orders.length === 0 ? (
            <div className="rounded border border-dashed border-gray-300 p-6 text-center text-gray-500">
              Bạn chưa có đơn hàng nào.
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div
                  key={order._id}
                  className="rounded border border-gray-200 p-4"
                >
                  <div className="mb-3 flex flex-wrap items-center justify-between gap-2 border-b border-dashed border-gray-200 pb-3">
                    <div>
                      <p className="text-sm text-gray-500">Mã đơn</p>
                      <p className="font-semibold text-gray-800">
                        #{order.orderNumber}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">Trạng thái</p>
                      <p className="font-semibold text-primary">
                        {STATUS_LABEL[order.status] || "Không xác định"}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    {(order.products || []).map((item, index) => (
                      <div
                        key={`${item.productId || item.id || index}-${index}`}
                        className="flex items-center justify-between gap-3 text-sm"
                      >
                        <div className="flex items-center gap-2">
                          <img
                            src={item.img}
                            alt=""
                            className="h-10 w-10 rounded object-cover"
                          />
                          <div>
                            <p className="font-medium text-gray-800">
                              {item.productName}
                            </p>
                            <p className="text-xs text-gray-500">
                              x {item.quantity}
                            </p>
                          </div>
                        </div>
                        <p className="font-semibold text-gray-800">
                          {vnd(
                            (item.currentPrice || item.unitPrice || 0) *
                              (item.quantity || 0),
                          )}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="mt-3 flex flex-wrap items-center justify-between gap-3 border-t border-dashed border-gray-200 pt-3">
                    <p className="font-semibold text-gray-800">
                      Tổng: {vnd(order.total || 0)}
                    </p>
                    {order.status === 2 && (
                      <button
                        type="button"
                        disabled={updatingOrderId === order._id}
                        onClick={() => handleConfirmDelivered(order._id)}
                        className="rounded bg-green-700 px-4 py-2 text-sm font-semibold text-white hover:bg-green-800 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {updatingOrderId === order._id
                          ? "Đang xác nhận..."
                          : "Xác nhận đã nhận hàng"}
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Profile;
