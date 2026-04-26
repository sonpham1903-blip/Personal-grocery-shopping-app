import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ktsRequest from "../../ultis/ktsrequest";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

const Post = () => {
  const [data, setData] = useState([]);
  const [query, setQuery] = useState("");
  const [refresh, setRefresh] = useState(false);
  const keys = ["title"];
  const { currentUser } = useSelector((state) => state.user);
  const { token } = currentUser;
  const status = [
    {
      id: 0,
      bgColor: "bg-blue-300",
      name: "đang kiểm duyệt",
      textColor: "text-blue-700",
    },
    {
      id: 1,
      bgColor: "bg-green-300",
      name: "đã xuất bản",
      textColor: "text-green-700",
    },
    { id: 2, bgColor: "bg-red-300", name: "Đã xóa", textColor: "text-red-700" },
  ];
  useEffect(() => {
    setRefresh(false);
    const fetchData = async () => {
      try {
        const res = await ktsRequest.get("/posts/admin", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${currentUser.token}`,
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
  const handleDelete = async (postid) => {
    try {
      const res = await ktsRequest.delete(`/posts/${postid}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success(res.data);
      setRefresh(true);
    } catch (error) {
      error.response
        ? toast.error(error.response.data.message)
        : toast.error("Network Error!");
    }
  };
  return (
    <div className="p-3 text-xs md:text-base w-full">
      <div className="flex justify-between">
        <div className="flex">
          <input
            type="text"
            name="name"
            className="block w-full rounded-l-lg border border-gray-300 bg-gray-50 p-2 text-gray-900 focus:border-primary focus:outline-none focus:ring-primary-600 sm:text-sm"
            placeholder="Tìm kiếm bài viết"
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
        <Link
          to="new"
          className="py-2 px-4 hover:bg-primary rounded font-bold border border-primary text-primary bg-white hover:text-white"
        >
          Tạo mới bài viết
        </Link>
      </div>
      <div className="w-full mt-4 border rounded bg-white shadow-lg overflow-hidden">
        <div className=" flex p-3 font-semibold items-center bg-primary text-white">
          <div className="w-7/12">Bài viêt</div>
          <div className="w-2/12 text-center">Tác giả</div>
          <div className="w-2/12 text-center">Ngày đăng ký</div>
          <div className="w-1/12 text-center">Thao tác</div>
        </div>
        {search.length > 0 ? (
          <div className="rounded divide-y divide-primary divide-dashed text-gray-800">
            {search(data).map((p, i) => {
              const st = status.find((s) => s.id === p.status);
              return (
                <div className="w-full flex p-1 gap-1 items-center" key={i}>
                  <div className="w-7/12 flex items-center gap-3">
                    <div className="w-1/5 h-20 rounded-md overflow-hidden">
                      <img
                        src={
                          p.thumbnail ||
                          "https://via.placeholder.com/300.png/09f/fff"
                        }
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="overflow-hidden w-4/5">
                      <Link
                        to={`${
                          currentUser?.role === "admin"
                            ? `/admin/bai-viet/${p._id}`
                            : `#`
                        }`}
                        className="font-semibold hover:text-primary line-clamp-1"
                      >
                        <span
                          className={`${st.bgColor} ${st.textColor} px-2 py-0.5 text-xs font-semibold rounded`}
                        >
                          {st.name}
                        </span>{" "}
                        {p.title}
                      </Link>

                      <p className="line-clamp-2">{p.description}</p>
                    </div>
                  </div>
                  <div className="w-2/12 text-center">
                    <span className="text-red-500 font-semibold italic">
                      {p?.author || "sale168.com"}
                    </span>
                  </div>
                  <div className="w-2/12 text-center">
                    <span>{new Date(p.createdAt).toLocaleString()}</span>
                  </div>

                  <div className="w-1/12 flex justify-around">
                    <Link
                      to={`edit/${p._id}`}
                      className="p-1.5 bg-white rounded border border-orange-400 text-orange-400 hover:border-orange-400 hover:bg-orange-400 hover:text-white"
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
                      className={`p-1.5 ${
                        st.id === 2
                          ? "bg-gray-400 border-gray-400"
                          : "bg-white border-red-600 text-red-600 hover:border-red-600 hover:bg-red-600 hover:text-white active:scale-95 transition-transform"
                      } rounded border `}
                      disabled={st.id === 2}
                      onClick={() => handleDelete(p._id)}
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
    </div>
  );
};

export default Post;
