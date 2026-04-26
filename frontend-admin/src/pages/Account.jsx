import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ktsRequest from "../../ultis/ktsrequest";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import Modal from "../components/Modal";
const AccountCard = ({ u }) => {
  return (
    <div className="w-full flex p-1 gap-1 items-center">
      <div className="w-3/12 flex items-center gap-2">
        <div className="w-12 h-12 rounded-full overflow-hidden">
          <img
            src={u?.img || "https://via.placeholder.com/300.png/09f/fff"}
            alt=""
            className="w-full h-full object-cover rounded-md mx-auto"
          />
        </div>
        <span>{u.username}</span>
      </div>
      <div className="w-2/12">{u?.phone}</div>
      <div className="w-3/12">{u?._id}</div>
      <div className="w-2/12">{u.role}</div>
      <div className="w-2/12 flex gap-2">
        <Link
          to={`/admin/thong-tin-tai-khoan/`}
          className="p-1.5 bg-white rounded border border-blue-400 text-blue-400 hover:border-blue-400 hover:bg-blue-400 hover:text-white"
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
              d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125"
            />
          </svg>
        </Link>
        <button
          className={`p-1.5 bg-white rounded border ${
            u.role === "admin" || u.status === -1
              ? "bg-gray-400 border-gray-400 "
              : "border-orange-400 text-orange-400 hover:border-orange-400 hover:bg-orange-400 hover:text-white"
          } `}
          disabled={u.status === -1}
          onClick={() => {
            setDelUser(u);
            setEditData({ status: u.status === 0 ? 1 : 0 });
            setOpenModal(true);
            setText(
              `${u.status === 0 ? "Mở khóa" : "Khóa"} tài khoản ${u.username}`
            );
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
        <button
          className={`p-1.5 ${
            u.role === "admin" || u.status === -1
              ? "bg-gray-400 border-gray-400"
              : "bg-white border-red-600 text-red-600 hover:border-red-600 hover:bg-red-600 hover:text-white"
          } rounded border `}
          disabled={u.role === "admin" || u.status === -1}
          onClick={() => {
            setDelUser(u);
            setEditData({ status: -1 });
            setOpenModal(true);
            setText(`Xóa tài khoản ${u.username}?`);
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
              d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
            />
          </svg>
        </button>
        {openModal && (
          <Modal
            title="cảnh báo"
            message={text}
            to={`/users/`}
            close={setOpenModal}
            token={token}
            data={delUser}
            editedData={editData}
            refreshData={setRefresh}
          />
        )}
      </div>
    </div>
  );
};
const Account = () => {
  const [data, setData] = useState([]);
  const [query, setQuery] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [delUser, setDelUser] = useState({});
  const [editData, setEditData] = useState({});
  const [refresh, setRefresh] = useState(false);
  const [text, setText] = useState("");
  const keys = ["username"];
  const { currentUser } = useSelector((state) => state.user);
  const { token } = currentUser;
  const role = ["user", "shop", "staff"];
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
        setData(res.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, [refresh]);
  const search = (data) => {
    return data.filter((item) =>
      keys.some((key) => item[key].toLowerCase().includes(query))
    );
  };
  const handleChange = async (data, newRole) => {
    try {
      const res = await ktsRequest.put(
        `users/${data._id}`,
        { ...data, role: newRole },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success(res.data);
    } catch (error) {
      toast.error(error.response ? error.response.data : "Network Error!");
    }
    setRefresh(true);
  };
  return (
    <div className="p-3 text-xs md:text-base">
      <div className="flex justify-between">
        <div className="flex w-1/2">
          <input
            type="text"
            name="name"
            className="block w-full rounded-l-lg border border-gray-300 bg-gray-50 p-2 text-gray-900 focus:border-primary focus:outline-none focus:ring-primary-600 sm:text-sm"
            placeholder="Tìm kiếm tên user /số điện thoại"
            required="a-z"
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
        <div className=" flex p-3 font-semibold items-center bg-primary text-white">
          <div className="w-3/12">User</div>
          <div className="w-2/12">Số điện thoại</div>
          <div className="w-3/12">ID người dùng</div>
          <div className="w-2/12 text-center">Role</div>
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
                        src={
                          u?.img ||
                          "https://via.placeholder.com/300.png/09f/fff"
                        }
                        alt=""
                        className="w-full h-full object-cover rounded-md mx-auto"
                      />
                    </div>
                    <span>{u.username}</span>
                  </div>
                  <div className="w-2/12">{u?.phone}</div>
                  <div className="w-3/12">{u?._id}</div>
                  <div className="w-2/12 text-center">
                    {role.includes(u.role) ? (
                      <span className=" px-1.5 py-0.5 rounded bg-orange-300">
                        <select
                          name=""
                          id=""
                          className="appearance-none bg-transparent focus:outline-none "
                          onChange={(e) => handleChange(u, e.target.value)}
                        >
                          {role.map((r, i) => {
                            return (
                              <option key={i} selected={u.role === r} value={r}>
                                {r}
                              </option>
                            );
                          })}
                        </select>
                      </span>
                    ) : (
                      <span className="px-1.5 py-0.5 rounded bg-green-300">
                        {u.role}
                      </span>
                    )}
                  </div>
                  <div className="w-2/12 flex gap-2">
                    <Link
                      to={`/admin/thong-tin-tai-khoan/${u._id}`}
                      className="p-1.5 bg-white rounded border border-blue-400 text-blue-400 hover:border-blue-400 hover:bg-blue-400 hover:text-white"
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
                          d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125"
                        />
                      </svg>
                    </Link>
                    <button
                      className={`p-1.5 bg-white rounded border ${
                        ["admin", "special"].includes(u.role)
                          ? "bg-gray-400 border-gray-400 "
                          : "border-orange-400 text-orange-400 hover:border-orange-400 hover:bg-orange-400 hover:text-white"
                      } `}
                      disabled={["admin", "special"].includes(u.role)}
                      onClick={() => {
                        setDelUser(u);
                        setEditData({ status: u.status === 0 ? 1 : 0 });
                        setOpenModal(true);
                        setText(
                          `${u.status === 0 ? "Mở khóa" : "Khóa"} tài khoản ${
                            u.username
                          }`
                        );
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
                    <button
                      className={`p-1.5 ${
                        u.role === "admin" || u.status === -1
                          ? "bg-gray-400 border-gray-400"
                          : "bg-white border-red-600 text-red-600 hover:border-red-600 hover:bg-red-600 hover:text-white"
                      } rounded border `}
                      disabled={u.role === "admin" || u.status === -1}
                      onClick={() => {
                        setDelUser(u);
                        setEditData({ status: -1 });
                        setOpenModal(true);
                        setText(`Xóa tài khoản ${u.username}?`);
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
                          d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                        />
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
      {openModal && (
        <Modal
          title="cảnh báo"
          message={text}
          to={`/users/`}
          close={setOpenModal}
          token={token}
          data={delUser}
          editedData={editData}
          refreshData={setRefresh}
        />
      )}
    </div>
  );
};

export default Account;
