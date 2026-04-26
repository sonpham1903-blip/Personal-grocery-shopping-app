import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { storage } from "../../ultis/firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { useSelector } from "react-redux";
import ktsRequest from "../../ultis/ktsrequest";

const NewCategories = () => {
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState([]);
  const [urls, setUrls] = useState([]);
  const [cats, setCats] = useState([]);
  const [inputs, setInputs] = useState({});
  const [isLoadingFiles, setIsLoadingFiles] = useState(false);
  const [percs, setPercs] = useState(0);
  const { currentUser } = useSelector((state) => state.user);

  const handleChange = (e) => {
    setInputs((prev) => {
      return { ...prev, [e.target.name]: e.target.value };
    });
  };
  const handleClick = async () => {
    try {
      const config = {
        method: "post",
        url: "/categories",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${currentUser.token}`,
        },
        data: { ...inputs, imgs: urls, shopID: currentUser._id },
      };
      ktsRequest(config)
        .then((res) => {
          toast.success(res.data);
          setFile([]);
          setUrls([]);
        })
        .catch((er) => toast.error(er));
    } catch (error) {
      error.response
        ? toast.error(error.response.data.message)
        : toast.error("Network Error!");
    }
  };
  return (
    <div className="p-3">
      <h3 className="py-3 uppercase font-bold">thêm mới danh mục</h3>
      <div className="bg-white p-3 rounded-md text-gray-800 font-semibold shadow-md">
        <div className="space-y-4 md:space-y-6">
          <div className="flex w-full items-center">
            <label htmlFor="productName" className="w-1/3 hidden md:block">
              Mã danh mục
            </label>
            <input
              type="text"
              //   name="productName"
              //   id="productName"
              className="block w-full rounded border border-gray-300 bg-gray-50 p-2 text-gray-900 focus:border-primary focus:outline-none focus:ring-primary-600 sm:text-sm"
              placeholder="Mã danh mục"
              required="a-z"
              onChange={handleChange}
            />
          </div>

          <div className="flex w-full items-center">
            <label htmlFor="productName" className="w-1/3 hidden md:block">
              Tên danh mục
            </label>
            <input
              type="text"
              //   name="productName"
              //   id="productName"
              className="block w-full rounded border border-gray-300 bg-gray-50 p-2 text-gray-900 focus:border-primary focus:outline-none focus:ring-primary-600 sm:text-sm"
              placeholder="Tên danh mục"
              required="a-z"
              onChange={handleChange}
            />
          </div>
          <button
            onClick={handleClick}
            className="w-full rounded bg-primary px-5 py-3 text-center text-sm font-medium text-white hover:bg-green-700 focus:outline-none"
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
              "Tạo mới"
            )}
          </button>
          <div className="flex items-center justify-between">
            <Link
              to="/admin/danh-muc"
              className="text-sm font-medium text-primary hover:underline"
            >
              Quản lý danh mục
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewCategories;
