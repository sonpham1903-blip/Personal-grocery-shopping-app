import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import ktsRequest from "../../ultis/ktsrequest";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { loginSuccess } from "../redux/userSlice";
import { uploadSingleFile } from "../../ultis/handleFile";

const avatarColors = [
  "bg-orange-500",
  "bg-emerald-500",
  "bg-cyan-500",
  "bg-fuchsia-500",
  "bg-sky-500",
  "bg-violet-500",
  "bg-lime-500",
  "bg-amber-500",
  "bg-rose-500",
];

const getAvatarColor = (seed = "") => {
  if (!seed) return avatarColors[0];
  const hash = Array.from(seed).reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
  return avatarColors[hash % avatarColors.length];
};

const getAvatarText = (text = "") => {
  if (!text) return "A";
  return text.trim().charAt(0).toUpperCase();
};

const Profile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);
  const { token } = currentUser || {};

  const [inputs, setInputs] = useState({});
  const [loading, setLoading] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  const [isEditing, setIsEditing] = useState(false);
  const [passwordData, setPasswordData] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const [showPasswordForm, setShowPasswordForm] = useState(false);

  useEffect(() => {
    if (!currentUser) {
      navigate("/login");
      return;
    }
    setInputs({ ...currentUser });
  }, [currentUser, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputs(prev => ({ ...prev, [name]: value }));
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
      setInputs((prev) => ({ ...prev, img: downloadURL }));
      toast.success("Tải ảnh thành công");
    } catch (error) {
      toast.error(error.message || "Tải ảnh thất bại");
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleUpdateInfo = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await ktsRequest.put(
        `users/${currentUser._id}`,
        inputs,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      const updatedUser = { ...res.data.data, token: currentUser.token };
      dispatch(loginSuccess(updatedUser));
      toast.success(res.data.message || "Cập nhật thành công");
      setIsEditing(false);
    } catch (error) {
      toast.error(error.response?.data?.message || "Cập nhật thất bại");
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      return toast.error("Mật khẩu xác nhận không khớp");
    }
    try {
      setLoading(true);
      await ktsRequest.put(
        `users/changepwd/${currentUser._id}`,
        { password: "", newpwd: passwordData.newPassword },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("Đổi mật khẩu thành công");
      setShowPasswordForm(false);
      setPasswordData({ newPassword: "", confirmPassword: "" });
    } catch (error) {
      toast.error(error.response?.data || "Đổi mật khẩu thất bại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 md:p-6 bg-gray-100 min-h-full">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {/* Header/Banner */}
          <div className="h-32 bg-primary relative">
            <div className="absolute -bottom-16 left-8">
              <div className="relative group">
                <div className={`w-32 h-32 rounded-full border-4 border-white overflow-hidden flex justify-center items-center text-white text-4xl font-bold ${inputs?.img ? "bg-slate-200" : getAvatarColor(inputs?.displayName || inputs?.username || "user")}`}>
                  {inputs?.img ? (
                    <img
                      src={inputs.img}
                      alt={inputs?.displayName || inputs?.username || "Avatar"}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    getAvatarText(inputs?.displayName || inputs?.username)
                  )}
                </div>
                <label className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 rounded-full opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="white" className="w-8 h-8">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
                  </svg>
                  <input type="file" hidden onChange={handleFileUpload} accept="image/*" />
                </label>
                {uploadingAvatar && (
                  <div className="absolute -bottom-2 left-0 w-full h-1 bg-gray-200 rounded overflow-hidden">
                    <div className="h-full w-full bg-primary animate-pulse"></div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="pt-20 px-8 pb-8">
            <div className="flex justify-between items-start mb-8">
              <div>
                <h1 className="text-2xl font-bold text-gray-800">{inputs?.displayName || inputs?.username}</h1>
                <p className="text-gray-500">@{inputs?.username} • <span className="capitalize">{inputs?.role}</span></p>
              </div>
              <div className="flex gap-3">
                <button 
                  onClick={() => setIsEditing(!isEditing)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isEditing ? "bg-gray-100 text-gray-700" : "bg-primary text-white hover:bg-opacity-90"
                  }`}
                >
                  {isEditing ? "Hủy chỉnh sửa" : "Chỉnh sửa hồ sơ"}
                </button>
                <button 
                  onClick={() => setShowPasswordForm(!showPasswordForm)}
                  className="px-4 py-2 rounded-lg text-sm font-medium border border-gray-200 text-gray-600 hover:bg-gray-50"
                >
                  Đổi mật khẩu
                </button>
              </div>
            </div>

            {showPasswordForm && (
              <form onSubmit={handleChangePassword} className="mb-8 p-6 bg-orange-50 rounded-xl border border-orange-100">
                <h3 className="text-lg font-bold text-orange-800 mb-4 flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z" />
                  </svg>
                  Thay đổi mật khẩu
                </h3>
                <div className="grid gap-4 md:grid-cols-2">
                  <label className="space-y-1">
                    <span className="text-sm font-medium text-gray-700">Mật khẩu mới</span>
                    <input 
                      type="password"
                      value={passwordData.newPassword}
                      onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                      className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-primary focus:border-primary"
                      placeholder="••••••••"
                      required
                    />
                  </label>
                  <label className="space-y-1">
                    <span className="text-sm font-medium text-gray-700">Xác nhận mật khẩu</span>
                    <input 
                      type="password"
                      value={passwordData.confirmPassword}
                      onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                      className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-primary focus:border-primary"
                      placeholder="••••••••"
                      required
                    />
                  </label>
                </div>
                <div className="mt-4 flex justify-end gap-3">
                  <button type="button" onClick={() => setShowPasswordForm(false)} className="px-4 py-2 text-sm text-gray-600 hover:underline">Hủy</button>
                  <button type="submit" disabled={loading} className="bg-orange-600 text-white px-6 py-2 rounded-lg text-sm font-bold hover:bg-orange-700 transition-colors disabled:opacity-50">Cập nhật mật khẩu</button>
                </div>
              </form>
            )}

            <form onSubmit={handleUpdateInfo}>
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider">Thông tin liên hệ</h3>
                  <label className="block space-y-1">
                    <span className="text-sm font-medium text-gray-600">Tên hiển thị</span>
                    <input 
                      name="displayName"
                      value={inputs?.displayName || ""}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className="w-full rounded-lg border border-gray-300 px-4 py-2 disabled:bg-gray-50 focus:ring-primary focus:border-primary transition-all"
                    />
                  </label>
                  <label className="block space-y-1">
                    <span className="text-sm font-medium text-gray-600">Email</span>
                    <input 
                      name="email"
                      type="email"
                      value={inputs?.email || ""}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className="w-full rounded-lg border border-gray-300 px-4 py-2 disabled:bg-gray-50 focus:ring-primary focus:border-primary transition-all"
                    />
                  </label>
                  <label className="block space-y-1">
                    <span className="text-sm font-medium text-gray-600">Số điện thoại</span>
                    <input 
                      name="phone"
                      value={inputs?.phone || ""}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className="w-full rounded-lg border border-gray-300 px-4 py-2 disabled:bg-gray-50 focus:ring-primary focus:border-primary transition-all"
                    />
                  </label>
                </div>

                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider">Địa chỉ giao hàng</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <label className="block space-y-1">
                      <span className="text-sm font-medium text-gray-600">Tỉnh/Thành</span>
                      <input 
                        name="cityName"
                        value={inputs?.cityName || ""}
                        onChange={handleChange}
                        disabled={!isEditing}
                        placeholder="VD: Hà Nội"
                        className="w-full rounded-lg border border-gray-300 px-4 py-2 disabled:bg-gray-50 focus:ring-primary focus:border-primary transition-all"
                      />
                    </label>
                    <label className="block space-y-1">
                      <span className="text-sm font-medium text-gray-600">Quận/Huyện</span>
                      <input 
                        name="districtName"
                        value={inputs?.districtName || ""}
                        onChange={handleChange}
                        disabled={!isEditing}
                        placeholder="VD: Cầu Giấy"
                        className="w-full rounded-lg border border-gray-300 px-4 py-2 disabled:bg-gray-50 focus:ring-primary focus:border-primary transition-all"
                      />
                    </label>
                  </div>
                  <label className="block space-y-1">
                    <span className="text-sm font-medium text-gray-600">Phường/Xã</span>
                    <input 
                      name="wardName"
                      value={inputs?.wardName || ""}
                      onChange={handleChange}
                      disabled={!isEditing}
                      placeholder="VD: Dịch Vọng"
                      className="w-full rounded-lg border border-gray-300 px-4 py-2 disabled:bg-gray-50 focus:ring-primary focus:border-primary transition-all"
                    />
                  </label>
                  <label className="block space-y-1">
                    <span className="text-sm font-medium text-gray-600">Địa chỉ chi tiết</span>
                    <input 
                      name="address"
                      value={inputs?.address || ""}
                      onChange={handleChange}
                      disabled={!isEditing}
                      placeholder="Số nhà, tên đường..."
                      className="w-full rounded-lg border border-gray-300 px-4 py-2 disabled:bg-gray-50 focus:ring-primary focus:border-primary transition-all"
                    />
                  </label>
                </div>
              </div>

              {isEditing && (
                <div className="mt-10 pt-6 border-t border-gray-100 flex justify-end gap-4">
                  <button 
                    type="button" 
                    onClick={() => {
                      setIsEditing(false);
                      setInputs({ ...currentUser });
                    }} 
                    className="px-6 py-2 text-sm font-medium text-gray-600 hover:underline"
                  >
                    Hủy bỏ
                  </button>
                  <button 
                    type="submit" 
                    disabled={loading}
                    className="bg-primary text-white px-8 py-2 rounded-lg font-bold hover:bg-opacity-90 shadow-md shadow-green-100 transition-all disabled:opacity-50"
                  >
                    {loading ? "Đang lưu..." : "Lưu thay đổi"}
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
