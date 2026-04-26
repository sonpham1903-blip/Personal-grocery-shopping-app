import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import ktsRequest from "../../ultis/ktsrequest";

const Suppliers = () => {
  const [data, setData] = useState([]);
  const [query, setQuery] = useState("");
  const [refresh, setRefresh] = useState(false);
  const [openDetail, setOpenDetail] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState(null);
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
        setData(res.data.filter((user) => user.role === "shop"));
      } catch (error) {
        toast.error(error.response ? error.response.data : "Network Error!");
      }
    };

    fetchData();
  }, [refresh, token]);

  const handleStatus = async (user) => {
    try {
      const nextStatus = user.status === 1 ? 0 : 1;
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

  const search = (rows) => {
    const keyword = query.trim().toLowerCase();
    if (!keyword) return rows;
    return rows.filter((item) => {
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
  };

  const getBusinessLicenseLink = (supplier) => {
    return (
      supplier?.businessLicensePdfUrl ||
      supplier?.businessLicenseUrl ||
      supplier?.businessLicense ||
      ""
    );
  };

  return (
    <div className="p-3 text-xs md:text-base">
      <div className="flex justify-between">
        <div className="flex w-1/2">
          <input
            type="text"
            name="name"
            className="block w-full rounded-l-lg border border-gray-300 bg-gray-50 p-2 text-gray-900 focus:border-primary focus:outline-none focus:ring-primary-600 sm:text-sm"
            placeholder="Tìm kiếm shop / số điện thoại"
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
      </div>
      <div className="w-full mt-4 rounded bg-white shadow-lg overflow-hidden">
        <div className="flex p-3 font-semibold items-center bg-primary text-white">
          <div className="w-3/12">Shop</div>
          <div className="w-2/12">Số điện thoại</div>
          <div className="w-3/12">ID người dùng</div>
          <div className="w-2/12 text-center">Trạng thái</div>
          <div className="w-2/12">Thao tác</div>
        </div>
        {search(data).length > 0 ? (
          <div className="divide-y divide-primary divide-dashed">
            {search(data).map((u, i) => {
              return (
                <div className="w-full flex p-1 gap-1 items-center" key={i}>
                  <div className="w-3/12 flex items-center gap-2">
                    <div className="w-12 h-12 rounded-full overflow-hidden">
                      <img
                        src={u?.img || "https://via.placeholder.com/300.png/09f/fff"}
                        alt=""
                        className="w-full h-full object-cover rounded-md mx-auto"
                      />
                    </div>
                    <div>
                      <div>{u.displayName || u.username}</div>
                      <div className="text-xs text-gray-500">{u.role}</div>
                    </div>
                  </div>
                  <div className="w-2/12">{u?.phone || "-"}</div>
                  <div className="w-3/12 break-all">{u?._id}</div>
                  <div className="w-2/12 text-center">
                    <span
                      className={`px-2 py-0.5 rounded text-xs font-semibold ${
                        u.status === 1
                          ? "bg-green-200 text-green-700"
                          : u.status === 0
                          ? "bg-orange-200 text-orange-700"
                          : "bg-gray-300 text-gray-700"
                      }`}
                    >
                      {u.status === 1 ? "Đang hoạt động" : u.status === 0 ? "Tạm khóa" : "Đã xóa"}
                    </span>
                  </div>
                  <div className="w-2/12 flex gap-2">
                    <button
                      className="p-1.5 bg-white rounded border border-indigo-400 text-indigo-500 hover:border-indigo-500 hover:bg-indigo-500 hover:text-white"
                      onClick={() => {
                        setSelectedSupplier(u);
                        setOpenDetail(true);
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
                          d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.964-7.178z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                    </button>
                    <button
                      className={`p-1.5 bg-white rounded border ${
                        u.status === -1
                          ? "bg-gray-400 border-gray-400"
                          : "border-orange-400 text-orange-400 hover:border-orange-400 hover:bg-orange-400 hover:text-white"
                      }`}
                      disabled={u.status === -1}
                      onClick={() => handleStatus(u)}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-4 h-4"
                      >
                        {u.status === 1 ? (
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
                          />
                        ) : (
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M13.5 10.5V6.75a4.5 4.5 0 119 0v3.75M3.75 21.75h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H3.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
                          />
                        )}
                      </svg>
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
      {openDetail && selectedSupplier && (
        <div className="fixed inset-0 z-40 bg-black/30 flex items-center justify-center p-4">
          <div className="w-full max-w-2xl bg-white rounded-md shadow-xl overflow-hidden">
            <div className="bg-primary px-4 py-3 text-white font-semibold flex items-center justify-between">
              <span>Chi tiết nhà cung cấp</span>
              <button
                className="text-white"
                onClick={() => {
                  setOpenDetail(false);
                  setSelectedSupplier(null);
                }}
              >
                Đóng
              </button>
            </div>
            <div className="p-4 space-y-3 text-sm text-gray-800 max-h-[70vh] overflow-auto">
              <div>
                <span className="font-semibold">Tên shop: </span>
                {selectedSupplier.displayName || selectedSupplier.username || "-"}
              </div>
              <div>
                <span className="font-semibold">Username: </span>
                {selectedSupplier.username || "-"}
              </div>
              <div>
                <span className="font-semibold">Số điện thoại: </span>
                {selectedSupplier.phone || "-"}
              </div>
              <div>
                <span className="font-semibold">Email: </span>
                {selectedSupplier.email || "-"}
              </div>
              <div>
                <span className="font-semibold">Địa chỉ: </span>
                {selectedSupplier.address || "-"}
              </div>
              <div>
                <span className="font-semibold">Tỉnh/Thành: </span>
                {selectedSupplier.cityFullName || selectedSupplier.cityName || "-"}
              </div>
              <div>
                <span className="font-semibold">Quận/Huyện: </span>
                {selectedSupplier.districtFullName || selectedSupplier.districtName || "-"}
              </div>
              <div>
                <span className="font-semibold">Phường/Xã: </span>
                {selectedSupplier.wardFullName || selectedSupplier.wardName || "-"}
              </div>
              <div>
                <span className="font-semibold">Giấy phép kinh doanh: </span>
                {getBusinessLicenseLink(selectedSupplier) ? (
                  <div className="space-y-1">
                    <a
                      href={getBusinessLicenseLink(selectedSupplier)}
                      target="_blank"
                      rel="noreferrer"
                      className="text-blue-600 hover:underline break-all"
                    >
                      {getBusinessLicenseLink(selectedSupplier)}
                    </a>
                    <div>
                      <a
                        href={getBusinessLicenseLink(selectedSupplier)}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-block px-3 py-1 rounded border border-blue-500 text-blue-600 hover:bg-blue-500 hover:text-white"
                      >
                        Mở giấy phép
                      </a>
                    </div>
                  </div>
                ) : (
                  "-"
                )}
              </div>
              <div>
                <span className="font-semibold">Trạng thái: </span>
                {selectedSupplier.status === 1
                  ? "Đang hoạt động"
                  : selectedSupplier.status === 0
                  ? "Tạm khóa"
                  : selectedSupplier.status === 2
                  ? "Chưa kích hoạt"
                  : "Đã xóa"}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Suppliers;
