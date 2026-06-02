import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import ktsRequest from "../../ultis/ktsrequest";
import { uploadMultipleFiles, uploadSingleFile } from "../../ultis/handleFile";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const NewProduct = () => {
  const [loading, setLoading] = useState(false);
  const [imageFiles, setImageFiles] = useState([]);
  const [documentFiles, setDocumentFiles] = useState([]);
  const [ocopCertFile, setOcopCertFile] = useState(null);
  const [ocopInfo, setOcopInfo] = useState(false);
  const [ocopCertDate, setOcopCertDate] = useState("");
  const [ocopStar, setOcopStar] = useState("");
  const [cats, setCats] = useState([]);
  const [inputs, setInputs] = useState({});
  const [value, setValue] = useState("");
  const { currentUser } = useSelector((state) => state.user);
  const { token } = currentUser;

  useEffect(() => {
    const fetchData = async () => {
      const checkRole = currentUser.role === "admin";
      try {
        const res = checkRole
          ? await ktsRequest.get("/categories/all", {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            })
          : await ktsRequest.get("/categories");
        setCats(res.data);
      } catch (error) {
        toast.error(
          `${error.response ? error.response.data : "Network error!"}`
        );
      }
    };
    fetchData();
  }, [currentUser.role, token]);

  const handleChange = (e) => {
    setInputs((prev) => {
      return { ...prev, [e.target.name]: e.target.value };
    });
  };

  const handleImageChange = (e) => {
    setImageFiles(Array.from(e.target.files || []));
  };

  const handleDocumentChange = (e) => {
    const selected = Array.from(e.target.files || []);
    const invalid = selected.some((file) => file.type !== "application/pdf");

    if (invalid) {
      toast.error("Chỉ hỗ trợ file PDF cho chứng từ liên quan");
      e.target.value = "";
      setDocumentFiles([]);
      return;
    }

    setDocumentFiles(selected);
  };

  const handleOcopCertChange = (e) => {
    const file = e.target.files?.[0] || null;
    setOcopCertFile(file);
  };

  const handleOcopToggle = (e) => {
    const checked = e.target.checked;
    setOcopInfo(checked);

    if (!checked) {
      setOcopCertFile(null);
      setOcopCertDate("");
      setOcopStar("");
    }
  };

  const handleClick = async () => {
    if (imageFiles.length < 1) {
      toast.error("Hình ảnh không được để trống");
      return;
    }

    setLoading(true);
    try {
      const imageUrlList = await uploadMultipleFiles(imageFiles, "products/images");
      const relatedDocuments = await uploadMultipleFiles(
        documentFiles,
        "products/documents",
      );
      const ocopCertImage = ocopInfo
        ? await uploadSingleFile(ocopCertFile, "products/ocop-certificates")
        : "";

      const config = {
        method: "post",
        url: "/products",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${currentUser.token}`,
        },
        data: {
          ...inputs,
          tags: Array.isArray(inputs.tags)
            ? inputs.tags
            : typeof inputs.tags === "string"
            ? inputs.tags
                .split(/,|\n|;/)
                .map((t) => t.trim())
                .filter(Boolean)
            : [],
          imgs: imageUrlList,
          relatedDocuments,
          ocopCertImage,
          isOcop: ocopInfo,
          excutionDate: ocopInfo ? ocopCertDate : "",
          star: ocopInfo && ocopStar !== "" ? Number(ocopStar) : undefined,
          shopID: currentUser._id,
          shopName: currentUser.displayName || "admin",
          description: value,
        },
      };
      ktsRequest(config)
        .then((res) => {
          toast.success(res.data);
          setImageFiles([]);
          setDocumentFiles([]);
          setOcopCertFile(null);
        })
        .catch((er) => toast.error(er.response.data));
    } catch (error) {
      toast.error(error.message || "Upload file thất bại");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="p-3">
      <h3 className="py-3 uppercase font-bold">thêm mới sản phẩm</h3>
      <div className="bg-white p-3 rounded-md text-gray-800 font-semibold shadow-md">
        <div className="space-y-4 md:space-y-6">
          <div className="flex w-full items-center">
            <div className="w-1/4 hidden md:block">
              <label htmlFor="productImages">Ảnh sản phẩm </label>
            </div>
            <div className="w-full">
              <input
                id="productImages"
                type="file"
                accept="image/*"
                multiple
                className="block w-full rounded border border-gray-300 bg-gray-50 p-2 text-gray-900 focus:border-primary focus:outline-none focus:ring-primary-600 sm:text-sm"
                onChange={handleImageChange}
              />
              {imageFiles.length > 0 && (
                <div className="mt-2 text-xs text-gray-600">
                  Đã chọn {imageFiles.length} ảnh
                </div>
              )}
            </div>
          </div>
          <div className="flex w-full items-center">
            <label htmlFor="productName" className="w-1/3 hidden md:block">
              Tên sản phẩm
            </label>
            <input
              type="text"
              name="productName"
              id="productName"
              className="block w-full rounded border border-gray-300 bg-gray-50 p-2 text-gray-900 focus:border-primary focus:outline-none focus:ring-primary-600 sm:text-sm"
              placeholder="Tên sản phẩm"
              required="a-z"
              onChange={handleChange}
            />
          </div>
          <div className="flex w-full items-center">
            <label htmlFor="cats" className="w-1/3 hidden md:block">
              Danh mục
            </label>
            <select
              id="cat"
              name="cat"
              className="block w-full rounded border border-gray-300 bg-gray-50 p-2 text-sm text-gray-900 focus:border-primary focus:ring-primary"
              value={inputs.cat || ""}
              onChange={handleChange}
            >
              <option value="" disabled>
                Chọn danh mục sản phẩm
              </option>
              {cats.map((c, i) => {
                return (
                  <option value={c.name} key={i}>
                    {c.name}
                  </option>
                );
              })}
            </select>
            {/* <input
              type="text"
              name="cats"
              id="cats"
              className="block w-full rounded border border-gray-300 bg-gray-50 p-2 text-gray-900 focus:border-primary focus:outline-none focus:ring-primary-600 sm:text-sm"
              placeholder="Phân cách nhau bởi dấu ; "
              required="a-z"
              onChange={handleChange}
            /> */}
          </div>
          <div className="flex w-full items-center">
            <label htmlFor="tags" className="w-1/3 hidden md:block">
              Tags
            </label>
            <input
              type="text"
              name="tags"
              id="tags"
              className="block w-full rounded border border-gray-300 bg-gray-50 p-2 text-gray-900 focus:border-primary focus:outline-none focus:ring-primary-600 sm:text-sm"
              placeholder="Nhập tags, phân tách bởi dấu phẩy"
              onChange={handleChange}
            />
          </div>
          <div className="flex w-full items-center">
            <label htmlFor="stockPrice" className="w-1/3 hidden md:block">
              Giá niêm yết
            </label>
            <input
              type="number"
              name="stockPrice"
              id="stockPrice"
              className="block w-full rounded border border-gray-300 bg-gray-50 p-2 text-gray-900 focus:border-primary focus:outline-none focus:ring-primary-600 sm:text-sm"
              placeholder="Giá niêm yết (VNĐ)"
              pattern="[0-9]*"
              onChange={handleChange}
            />
          </div>
          {/* Giá bán đã bỏ, chỉ giữ Giá niêm yết (stockPrice) */}
          <div className="flex w-full items-center">
            <label htmlFor="inStock" className="w-1/3 hidden md:block">
              Số lượng tồn kho
            </label>
            <div className="block w-full rounded border border-dashed border-gray-300 bg-gray-50 p-2 text-gray-600 sm:text-sm">
              Tồn kho sẽ được cộng tự động từ phiếu nhập hàng.
            </div>
          </div>
          <div className="flex w-full items-center">
            <label htmlFor="description" className="w-1/3 hidden md:block">
              Mô tả sản phẩm
            </label>
            <ReactQuill
              theme="snow"
              value={value}
              onChange={setValue}
              name="description"
              id="description"
              className="block w-full"
              placeholder="Mô tả sản phẩm"
            />
          </div>
          <div className="rounded border border-dashed border-primary/30 bg-primary/5 p-3">
            <label className="flex items-center gap-3 text-sm font-semibold text-gray-800">
              <input
                type="checkbox"
                checked={ocopInfo}
                onChange={handleOcopToggle}
                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
              />
              Xác nhận đây là sản phẩm OCOP
            </label>
            <p className="mt-1 text-xs text-gray-500">
              Bật tùy chọn này để nhập thêm ảnh chứng nhận, ngày cấp và số sao.
            </p>
          </div>
          {ocopInfo && (
            <>
              <div className="flex w-full items-center">
                <label htmlFor="ocopCertImage" className="w-1/3 hidden md:block">
                  Ảnh chứng nhận OCOP
                </label>
                <input
                  type="file"
                  accept="image/*"
                  id="ocopCertImage"
                  className="block w-full rounded border border-gray-300 bg-gray-50 p-2 text-gray-900 focus:border-primary focus:outline-none focus:ring-primary-600 sm:text-sm"
                  onChange={handleOcopCertChange}
                />
              </div>
              <div className="flex w-full items-center">
                <label htmlFor="excutionDate" className="w-1/3 hidden md:block">
                  Ngày cấp
                </label>
                <input
                  type="date"
                  name="excutionDate"
                  id="excutionDate"
                  className="block w-full rounded border border-gray-300 bg-gray-50 p-2 text-gray-900 focus:border-primary focus:outline-none focus:ring-primary-600 sm:text-sm"
                  value={ocopCertDate}
                  onChange={(e) => setOcopCertDate(e.target.value)}
                />
              </div>
              <div className="flex w-full items-center">
                <label htmlFor="star" className="w-1/3 hidden md:block">
                  Số sao OCOP
                </label>
                <input
                  type="number"
                  name="star"
                  id="star"
                  min="1"
                  max="5"
                  className="block w-full rounded border border-gray-300 bg-gray-50 p-2 text-gray-900 focus:border-primary focus:outline-none focus:ring-primary-600 sm:text-sm"
                  placeholder="1 - 5 sao"
                  value={ocopStar}
                  onChange={(e) => setOcopStar(e.target.value)}
                />
              </div>
            </>
          )}
          <div className="flex w-full items-center">
            <div className="w-1/4 hidden md:block">
              <label htmlFor="relatedDocuments">Chứng từ liên quan </label>
            </div>
            <div className="w-full">
              <input
                id="relatedDocuments"
                name="relatedDocuments"
                type="file"
                accept="application/pdf"
                multiple
                className="block w-full rounded border border-gray-300 bg-gray-50 p-2 text-gray-900 focus:border-primary focus:outline-none focus:ring-primary-600 sm:text-sm"
                onChange={handleDocumentChange}
              />
              {documentFiles.length > 0 && (
                <div className="mt-1 text-xs text-gray-600">
                  Đã chọn {documentFiles.length} file PDF
                </div>
              )}
              <div className="mt-1 text-xs text-gray-600">
                Hỗ trợ định dạng: PDF, trường này là tùy chọn.
              </div>
            </div>
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
              to="/admin/san-pham"
              className="text-sm font-medium text-primary hover:underline"
            >
              Quản lý sản phẩm
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewProduct;
