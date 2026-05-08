import React, { useEffect, useState } from "react";
import ktsRequest from "../../ultis/ktsrequest";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import Modal from "../components/Modal";

const Categories = () => {
  const [data, setData] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [openForm, setOpenForm] = useState(false);
  const [editingCat, setEditingCat] = useState(null);
  const [refresh, setRefresh] = useState(false);
  const [loading, setLoading] = useState(false);
  const [inputs, setInputs] = useState({});
  const [delCat, setDelCat] = useState({});
  const { currentUser } = useSelector((state) => state.user);
  const { token } = currentUser;
  useEffect(() => {
    setRefresh(false);
    const fetchData = async () => {
      try {
        const res = await ktsRequest.get("/categories");
        setData(res.data);
      } catch (error) {
        console.log(error.response);
        toast.error(
          `${error.response ? error.response.data : "Network error!"}`
        );
      }
    };
    fetchData();
  }, [refresh]);
  const handleChange = (e) => {
    setInputs((prev) => {
      return { ...prev, [e.target.name]: e.target.value };
    });
  };
  const openCategoryForm = (cat = null) => {
    setEditingCat(cat);
    setInputs(
      cat
        ? {
            code: cat.code || "",
            name: cat.name || "",
            status: cat.status ?? 1,
          }
        : {
            name: "",
            status: 1,
          }
    );
    setOpenForm(true);
  };
  const closeCategoryForm = () => {
    setOpenForm(false);
    setEditingCat(null);
    setInputs({});
  };
  const handleSubmit = async () => {
    setLoading(true);
    try {
      const status = inputs.status === undefined ? 1 : Number(inputs.status);
      const payload = {
        ...(editingCat
          ? { code: inputs.code, name: inputs.name, status }
          : { name: inputs.name, status }),
      };
      const res = editingCat
        ? await ktsRequest.put(`/categories/${editingCat._id}`, payload, {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          })
        : await ktsRequest.post("/categories", payload, {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          });
      toast.success(res.data);
      setRefresh(true);
      closeCategoryForm();
    } catch (error) {
      toast.error(error.response ? error.response.data : "Network error!");
    } finally {
      setLoading(false);
    }
  };
  const handleClick = async (cat) => {
    setRefresh(true);
    try {
      await ktsRequest.put(
        `/categories/${cat._id}`,
        { ...cat, status: cat.status === 0 ? 1 : 0 },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
    } catch (error) {
      toast.error(error.response ? error.response.data : "Network Error!");
    }
  };
  return (
    <div className="w-full p-2 text-xs md:text-base space-y-3 ">
      <div className="">
        {!openForm && (
          <button
            className="bg-white float-right mb-2 rounded flex items-center gap-2 p-2.5 text-primary border border-primary uppercase font-bold hover:bg-primary hover:text-white"
            onClick={() => openCategoryForm()}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 4.5v15m7.5-7.5h-15"
              />
            </svg>

            <span className="hidden md:inline">tạo mới danh mục</span>
          </button>
        )}
        {openForm && (
          <div className="bg-white p-3 rounded-md text-gray-800 font-semibold shadow-md">
            <div className="flex items-center justify-between mb-3">
              <h3 className="uppercase">
                {editingCat ? "cập nhật danh mục" : "tạo mới danh mục"}
              </h3>
              <button
                className="text-gray-500 hover:text-red-500"
                onClick={closeCategoryForm}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <div className="flex gap-2">
              {editingCat && (
                <div className="flex w-full md:w-5/12 items-center justify-between">
                  <label
                    htmlFor="code"
                    className="w-1/3 hidden md:block text-center"
                  >
                    Mã DM
                  </label>
                  <input
                    type="text"
                    className="block w-full rounded border border-gray-300 bg-gray-100 p-2 text-gray-900 focus:outline-none sm:text-sm"
                    id="code"
                    name="code"
                    value={inputs?.code || ""}
                    readOnly
                  />
                </div>
              )}

              <div
                className={`flex w-full ${editingCat ? "md:w-5/12" : "md:w-10/12"} items-center justify-between`}
              >
                <label
                  htmlFor="name"
                  className="w-1/3 hidden md:block text-center"
                >
                  Tên DM
                </label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  className="block w-full rounded border border-gray-300 bg-gray-50 p-2 text-gray-900 focus:border-primary focus:outline-none focus:ring-primary-600 sm:text-sm"
                  placeholder="Tên danh mục"
                  required="a-z"
                  onChange={handleChange}
                  value={inputs?.name || ""}
                />
              </div>
              <div className="flex w-full md:w-2/12 justify-center gap-3">
                <button
                  className="px-3 rounded bg-primary hover:bg-green-700"
                  onClick={handleSubmit}
                >
                  {loading ? (
                    <svg
                      className="h-5  w-5 animate-spin text-white mx-auto"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                  ) : (
                    <span>{editingCat ? "cập nhật" : "lưu"}</span>
                  )}
                </button>
                <button
                  className="px-3 rounded bg-red-500 hover:bg-red-700"
                  onClick={closeCategoryForm}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="white"
                    className="w-4 h-4"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="w-full mt-4 rounded-md overflow-hidden bg-white shadow-lg">
        <div className=" flex p-3 font-semibold items-center bg-primary text-white">
          <div className="w-2/12 text-center">Mã danh mục</div>
          <div className="w-5/12">Tên danh mục</div>
          <div className="w-2/12">Ngày tạo</div>
          <div className="w-2/12">Trạng thái</div>
          <div className="w-1/12">Thao tác</div>
        </div>
        {data.length > 0 ? (
          <div className="divide-y divide-primary divide-dashed">
            {data.map((c, i) => {
              return (
                <div
                  className={`w-full flex p-1 gap-1 items-center ${
                    c.status < 0 ? "bg-gray-300 text-gray-800" : ""
                  }`}
                  key={i}
                >
                  <div className="w-2/12">{c?.code}</div>
                  <div className="w-5/12">{c?.name}</div>
                  <div className="w-2/12">
                    {new Date(c?.createdAt).toLocaleString()}
                  </div>
                  <div className="w-2/12">
                    <div
                      className={`w-12 h-6 bg-${
                        c?.status === 1 ? "primary" : "slate-400"
                      } rounded-full relative`}
                    >
                      <button
                        disabled={c.status < 0}
                        onClick={() => handleClick(c)}
                        className={`w-5 h-5 bg-white rounded-full ${
                          c?.status === 1 ? "right-1" : "left-1"
                        }
                        } top-0.5 absolute text-xs`}
                      >
                        {c.status === 0 ? "off" : "on"}
                      </button>
                    </div>
                  </div>
                  <div className="w-1/12 flex justify-around">
                    <button
                      disabled={c.status < 0}
                      onClick={() => {
                        openCategoryForm(c);
                      }}
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
                    </button>
                    <button
                      disabled={c.status < 0}
                      onClick={() => {
                        setDelCat(c);
                        setOpenModal(true);
                      }}
                      className="p-1.5 bg-white rounded border border-red-600 text-red-600 hover:border-red-600 hover:bg-red-600 hover:text-white"
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
        {openModal && (
          <Modal
            title="cảnh báo"
            message={`Bạn chắc chắn muốn xóa danh mục "${delCat?.name}"?`}
            to={`/categories/`}
            close={setOpenModal}
            token={token}
            data={delCat}
            editedData={{ status: -1 }}
            refreshData={setRefresh}
          />
        )}
      </div>
    </div>
  );
};

export default Categories;
