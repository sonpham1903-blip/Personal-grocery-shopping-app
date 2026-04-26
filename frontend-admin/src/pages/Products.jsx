import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ktsRequest from "../../ultis/ktsrequest";
import { vnd } from "../../ultis/ktsFunc";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

import Modal from "../components/Modal";
const Products = () => {
  const { currentUser } = useSelector((state) => state.user);
  const { token } = currentUser;
  const isAdmin = currentUser?.role === "admin";
  const [data, setData] = useState([]);
  const [query, setQuery] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [delProd, setDelProd] = useState({});
  const [openDetail, setOpenDetail] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const getDocumentLinks = (product) => {
    const links = [];
    if (product?.ocopCertImage) links.push(product.ocopCertImage);
    if (Array.isArray(product?.relatedDocuments)) {
      links.push(...product.relatedDocuments);
    }
    return links.filter(Boolean);
  };
  const keys = ["productName", "cat", "shopID"];
  const [status, setStatus] = useState([]);
  const [refresh, setRefresh] = useState(false);
  useEffect(() => {
    setRefresh(false);
    const fetchData = async () => {
      try {
        const res = await ktsRequest.get("/products/my", {
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
  const handleClick = async (product) => {
    setRefresh(true);
    try {
      await ktsRequest.put(
        `/products/${product._id}`,
        { ...product, active: !product.active },
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
  const search = (data) => {
    const keyword = query.trim().toLowerCase();
    if (!keyword) return data;
    return data.filter((item) =>
      keys.some((key) => (item[key] || "").toLowerCase().includes(keyword))
    );
  };
  return (
    <div className="p-3 text-xs md:text-base">
      <div className="mb-3 rounded-md bg-white px-4 py-3 shadow-sm">
        <h3 className="font-bold uppercase">
          {isAdmin ? "quản lý và duyệt sản phẩm" : "quản lý sản phẩm"}
        </h3>
        {isAdmin && (
          <p className="text-sm text-gray-600 mt-1">
            Kiểm tra thông tin sản phẩm và bật active để cho phép shop bán.
          </p>
        )}
      </div>
      <div className="flex justify-between">
        <div className="flex">
          <input
            type="text"
            name="name"
            className="block w-full rounded-l-lg border border-gray-300 bg-gray-50 p-2 text-gray-900 focus:border-primary focus:outline-none focus:ring-primary-600 sm:text-sm"
            placeholder="Tìm kiếm tên sản phẩm"
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
        {!isAdmin && (
          <Link
            to="new"
            className="py-2 px-4 hover:bg-primary rounded font-bold border border-primary text-primary bg-white hover:text-white"
          >
            Tạo mới sản phẩm
          </Link>
        )}
      </div>
      <div className="w-full mt-4 rounded-md overflow-hidden bg-white shadow-lg">
        <div className=" flex p-3 font-semibold items-center bg-primary text-white">
          <div className="w-1/12 text-center">Sản phẩm</div>
          <div className="w-4/12">Tên</div>
          <div className="w-2/12">Danh mục</div>
          <div className="w-2/12">Giá bán</div>
          <div className="w-2/12">Trạng thái bày bán</div>
          {!isAdmin && <div className="w-1/12">Thao tác</div>}
        </div>
        {search(data).length > 0 ? (
          <div className="divide-y divide-primary divide-dashed">
            {search(data).map((p, i) => {
              return (
                <div className="w-full flex p-1 gap-1 items-center " key={i}>
                  <div className="w-1/12">
                    <img
                      src={
                        p.imgs[0] ||
                        "https://via.placeholder.com/300.png/09f/fff"
                      }
                      alt=""
                      className="w-16 h-16 object-cover rounded-md mx-auto"
                    />
                  </div>
                  <div className="w-4/12">
                    <div>{p?.productName}</div>
                    {isAdmin && (
                      <>
                        <div className="text-xs text-gray-500 break-all">{p?.shopID}</div>
                        <button
                          className="text-xs text-blue-600 hover:underline mt-1"
                          onClick={() => {
                            setSelectedProduct(p);
                            setOpenDetail(true);
                          }}
                        >
                          Xem chi tiết
                        </button>
                      </>
                    )}
                  </div>
                  <div className="w-2/12">{p.cat}</div>
                  <div className="w-2/12">{vnd(p?.currentPrice)}</div>
                  <div className="w-2/12">
                    <div
                      className={`w-12 h-6 bg-${
                        p.active ? "primary" : "slate-400"
                      } rounded-full relative`}
                    >
                      <button
                        onClick={() => handleClick(p)}
                        className={`w-5 h-5 bg-white  rounded-full ${
                          p.active
                            ? "right-1 text-green-500"
                            : "left-1 text-red-500"
                        }
                        } duration-400 transition-transform top-0.5 absolute flex items-center justify-center`}
                      >
                        <span className="text-xs font-semibold mb-1 mr-0.5">
                          {p.active ? "on" : "off"}
                        </span>
                      </button>
                    </div>
                  </div>
                  {!isAdmin && (
                    <div className="w-1/12 flex gap-2">
                      <Link
                        to={`/admin/san-pham/${p._id}`}
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
                      <button className="p-1.5 bg-white rounded border border-red-600 text-red-600 hover:border-red-600 hover:bg-red-600 hover:text-white">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="w-4 h-4"
                          onClick={() => {
                            setDelProd(p);
                            setOpenModal(true);
                          }}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                          />
                        </svg>
                      </button>
                    </div>
                  )}
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
            message={`Bạn chắc chắn muốn xóa sản phẩm "${delProd?.productName}"?`}
            to={`/products/`}
            close={setOpenModal}
            token={token}
            data={delProd}
            editedData={{ active: false }}
            refreshData={setRefresh}
          />
        )}
        {openDetail && selectedProduct && (
          <div className="fixed inset-0 z-40 bg-black/30 flex items-center justify-center p-4">
            <div className="w-full max-w-2xl bg-white rounded-md shadow-xl overflow-hidden">
              <div className="bg-primary px-4 py-3 text-white font-semibold flex items-center justify-between">
                <span>Chi tiết sản phẩm</span>
                <button
                  className="text-white"
                  onClick={() => {
                    setOpenDetail(false);
                    setSelectedProduct(null);
                  }}
                >
                  Đóng
                </button>
              </div>
              <div className="p-4 space-y-3 text-sm text-gray-800 max-h-[70vh] overflow-auto">
                <div>
                  <span className="font-semibold">Tên sản phẩm: </span>
                  {selectedProduct.productName || "-"}
                </div>
                <div>
                  <span className="font-semibold">Shop ID: </span>
                  {selectedProduct.shopID || "-"}
                </div>
                <div>
                  <span className="font-semibold">Danh mục: </span>
                  {selectedProduct.cat || "-"}
                </div>
                <div>
                  <span className="font-semibold">Giá niêm yết: </span>
                  {vnd(selectedProduct.stockPrice || 0)}
                </div>
                <div>
                  <span className="font-semibold">Giá bán: </span>
                  {vnd(selectedProduct.currentPrice || 0)}
                </div>
                <div>
                  <span className="font-semibold">Trạng thái bày bán: </span>
                  {selectedProduct.active ? "Đang bật" : "Đang tắt"}
                </div>
                <div>
                  <span className="font-semibold">Mô tả: </span>
                  {selectedProduct.desc || "-"}
                </div>
                <div>
                  <span className="font-semibold block mb-2">Giấy tờ liên quan:</span>
                  {getDocumentLinks(selectedProduct).length > 0 ? (
                    <ul className="space-y-1">
                      {getDocumentLinks(selectedProduct).map((doc, idx) => (
                        <li key={idx}>
                          <a
                            href={doc}
                            target="_blank"
                            rel="noreferrer"
                            className="text-blue-600 hover:underline break-all"
                          >
                            {doc}
                          </a>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <span>-</span>
                  )}
                </div>
                <div>
                  <span className="font-semibold block mb-2">Hình ảnh:</span>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {(selectedProduct.imgs || []).map((img, idx) => (
                      <img
                        key={idx}
                        src={img}
                        alt=""
                        className="w-full h-24 object-cover rounded border"
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;
