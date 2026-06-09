import React, { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import ktsRequest from "../../ultis/ktsrequest";

const Users = () => {
  const [data, setData] = useState([]);
  const [query, setQuery] = useState("");
  const [refresh, setRefresh] = useState(false);
  const { currentUser } = useSelector((state) => state.user);
  const { token } = currentUser;

  useEffect(() => {
    setRefresh(false);

    const fetchData = async () => {
      try {
        const res = await ktsRequest.get("/users", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        setData((res.data || []).filter((user) => user.role === "user"));
      } catch (error) {
        toast.error(error.response ? error.response.data : "Network Error!");
      }
    };

    fetchData();
  }, [refresh, token]);

  const filteredData = useMemo(() => {
    const keyword = query.trim().toLowerCase();
    if (!keyword) return data;

    return data.filter((item) => {
      const username = (item.username || "").toLowerCase();
      const displayName = (item.displayName || "").toLowerCase();
      const phone = (item.phone || "").toLowerCase();
      const email = (item.email || "").toLowerCase();

      return (
        username.includes(keyword) ||
        displayName.includes(keyword) ||
        phone.includes(keyword) ||
        email.includes(keyword)
      );
    });
  }, [data, query]);

  const getStatusMeta = (status) => {
    if (status === 1) {
      return {
        label: "Đang hoạt động",
        className: "bg-green-200 text-green-700",
      };
    }

    if (status === 0) {
      return {
        label: "Tạm khóa",
        className: "bg-orange-200 text-orange-700",
      };
    }

    if (status === 2) {
      return {
        label: "Chưa kích hoạt",
        className: "bg-gray-300 text-gray-700",
      };
    }

    return {
      label: "Đã xóa",
      className: "bg-gray-300 text-gray-700",
    };
  };

  const handleResetPassword = async (user) => {
    try {
      const res = await ktsRequest.put(
        `/users/${user._id}/reset-password`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success(res.data?.message || "Đặt lại mật khẩu thành công");
      setRefresh(true);
    } catch (error) {
      toast.error(error.response ? error.response.data : "Network Error!");
    }
  };

  const handleLockAccount = async (user) => {
    try {
      const nextStatus = user.status === 0 ? 1 : 0;
      const res = await ktsRequest.put(
        `/users/${user._id}/status/${nextStatus}`,
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
    } catch (error) {
      toast.error(error.response ? error.response.data : "Network Error!");
    }
  };
  
  const handleDeleteAccount = async (user) => {
    if (!window.confirm("Bạn có chắc muốn xóa tài khoản này?")) return;
    try {
      const res = await ktsRequest.delete(`/users/${user._id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success(res.data);
      setRefresh(true);
    } catch (error) {    
        toast.error(error.response ? error.response.data : "Network Error!");
    }
  };

  return (
    <div className="p-3 text-xs md:text-base">
      <div className="flex justify-between items-center gap-3">
        <div className="flex w-full max-w-xl">
          <input
            type="text"
            name="name"
            className="block w-full rounded-l-lg border border-gray-300 bg-gray-50 p-2 text-gray-900 focus:border-primary focus:outline-none focus:ring-primary-600 sm:text-sm"
            placeholder="Tìm kiếm khách hàng / số điện thoại / email"
            onChange={(e) => {
              setQuery(e.target.value);
            }}
          />
          <button className="border-primary border rounded-r-lg p-2 text-gray-900 focus:border-primary focus:outline-none focus:ring-primary sm:text-sm hover:bg-primary hover:text-white">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
              />
            </svg>
          </button>
        </div>
        <button
          className="px-3 py-2 rounded bg-primary text-white hover:bg-green-700"
          onClick={() => setRefresh(true)}
        >
          Làm mới
        </button>
      </div>

      <div className="w-full mt-4 rounded bg-white shadow-lg overflow-hidden">
        <div className="flex p-3 font-semibold items-center bg-primary text-white">
          <div className="w-3/12">Khách hàng</div>
          <div className="w-2/12">Số điện thoại</div>
          <div className="w-2/12">Email</div>
          <div className="w-1/12 text-center">Số đơn</div>
          <div className="w-2/12 text-center">Trạng thái</div>
          <div className="w-2/12">Thao tác</div>
        </div>

        {filteredData.length > 0 ? (
          <div className="divide-y divide-primary divide-dashed">
            {filteredData.map((user) => {
              const statusMeta = getStatusMeta(user.status);
              const isLocked = user.status === 0;

              return (
                <div className="w-full flex p-3 gap-2 items-center" key={user._id}>
                  <div className="w-3/12 flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full overflow-hidden shrink-0">
                      <img
                        src={user?.img || "https://via.placeholder.com/300.png/09f/fff"}
                        alt=""
                        className="w-full h-full object-cover rounded-md mx-auto"
                      />
                    </div>
                    <div className="min-w-0">
                      <div className="font-semibold truncate">
                        {user.displayName || user.username}
                      </div>
                      <div className="text-xs text-gray-500 truncate">{user.username}</div>
                    </div>
                  </div>
                  <div className="w-2/12 break-all">{user?.phone || "-"}</div>
                  <div className="w-2/12 break-all">{user?.email || "-"}</div>
                  <div className="w-1/12 text-center font-semibold">
                    {user.orderCount || 0}
                  </div>
                  <div className="w-2/12 text-center">
                    <span
                      className={`px-2 py-0.5 rounded text-xs font-semibold ${statusMeta.className}`}
                    >
                      {statusMeta.label}
                    </span>
                  </div>
                  <div className="w-2/12 flex gap-2 flex-wrap">
                    <button
                      className="p-1.5 bg-white rounded border border-blue-400 text-blue-500 hover:border-blue-500 hover:bg-blue-500 hover:text-white"
                      onClick={() => handleResetPassword(user)}
                    >
                      Reset mật khẩu
                    </button>
                    <button
                      className={`p-1.5 rounded border ${
                        isLocked
                          ? "border-green-400 text-green-500 hover:bg-green-500 hover:text-white"
                          : "border-orange-400 text-orange-500 hover:bg-orange-500 hover:text-white"
                      }`}
                      onClick={() => handleLockAccount(user)}
                    >
                      {isLocked ? "Mở khóa" : "Khóa"}
                    </button>
                    <button
                      className="p-1.5 bg-white rounded border border-gray-400 text-gray-500 hover:border-gray-500 hover:bg-gray-500 hover:text-white"
                      onClick={() => handleDeleteAccount(user)}
                    >
                      Xóa tài khoản
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-4 text-center text-gray-700">Không có dữ liệu</div>
        )}
      </div>
    </div>
  );
};

export default Users;