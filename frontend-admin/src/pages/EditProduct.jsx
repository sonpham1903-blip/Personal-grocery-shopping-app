import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import ktsRequest from "../../ultis/ktsrequest";
import { uploadMultipleFiles, uploadSingleFile } from "../../ultis/handleFile";
import ReactQuill from "react-quill";

const EditProduct = () => {
  const [loading, setLoading] = useState(false);
  const [imageFiles, setImageFiles] = useState([]);
  const [documentFiles, setDocumentFiles] = useState([]);
  const [ocopCertFile, setOcopCertFile] = useState(null);
  const [ocopInfo, setOcopInfo] = useState(false);
  const [ocopCertDate, setOcopCertDate] = useState("");
  const [ocopStar, setOcopStar] = useState("");
  const [purls, setPurls] = useState([]);
  const [relatedDocUrls, setRelatedDocUrls] = useState([]);
  const [ocopCertUrl, setOcopCertUrl] = useState("");
  const [inputs, setInputs] = useState({});
  const { currentUser } = useSelector((state) => state.user);
  const [product, setProduct] = useState({});
  const [receiptData, setReceiptData] = useState([]);
  const { token } = currentUser;
  const { productid } = useParams();
  const [value, setValue] = useState("");
  const [cats, setCats] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await ktsRequest.get(`/products/${productid}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        if (
          res.data.shopID === currentUser._id ||
          currentUser.role === "admin"
        ) {
          console.log(res.data);
          setProduct(res.data);
          setPurls(res.data.imgs || []);
          setRelatedDocUrls(
            Array.isArray(res.data.relatedDocuments)
              ? res.data.relatedDocuments
              : [],
          );
          setOcopCertUrl(res.data.ocopCertImage || "");
          setOcopInfo(Boolean(res.data.isOcop || res.data.ocopCertImage || res.data.excutionDate));
          setOcopCertDate(
            res.data.excutionDate ? new Date(res.data.excutionDate).toISOString().slice(0, 10) : "",
          );
          setOcopStar(
            res.data.star !== undefined && res.data.star !== null
              ? String(res.data.star)
              : "",
          );
          setValue(res.data.description);
          setInputs({
            productName: res.data.productName,
            cat: res.data.cat || "",
            tags: res.data.tags,
            stockPrice: res.data.stockPrice,
            // currentPrice is managed server-side and defaults to stockPrice
          });
        } else {
          return navigate("/admin/san-pham");
        }
      } catch (error) {
        error.response ? navigate("/notfound") : toast.error("Network Error!");
      }
    };
    fetchData();
  }, [currentUser._id, currentUser.role, navigate, productid, token]);

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

  useEffect(() => {
    const fetchReceiptData = async () => {
      try {
        const res = await ktsRequest.get(`/good-receipts/product/${productid}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        setReceiptData(res.data || []);
      } catch (error) {
        setReceiptData([]);
      }
    };

    fetchReceiptData();
  }, [productid, token]);

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
    if (!inputs.productName) {
      toast.error("Tên sản phẩm không được để trống");
      return;
    }

    setLoading(true);

    try {
      const uploadedImageUrls = await uploadMultipleFiles(
        imageFiles,
        "products/images",
      );
      const imageUrlList =
        uploadedImageUrls.length > 0 ? uploadedImageUrls : purls;

      if (imageUrlList.length < 1) {
        toast.error("Hình ảnh không được để trống");
        return;
      }

      const uploadedDocuments = await uploadMultipleFiles(
        documentFiles,
        "products/documents",
      );
      const relatedDocuments =
        uploadedDocuments.length > 0 ? uploadedDocuments : relatedDocUrls;

      const uploadedOcopCert = ocopInfo
        ? await uploadSingleFile(ocopCertFile, "products/ocop-certificates")
        : "";
      const ocopCertImage = uploadedOcopCert || (ocopInfo ? ocopCertUrl : "");

      const config = {
        method: "put",
        url: `/products/${productid}`,
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
          updatedBy: currentUser.username,
          shopName: currentUser.displayName || "Sale168.vn",
          description: value,
        },
      };
      ktsRequest(config)
        .then((res) => {
          setPurls(imageUrlList);
          setRelatedDocUrls(relatedDocuments);
          setOcopCertUrl(ocopCertImage);
          toast.success(res.data, {
            onClose: () => navigate("/admin/san-pham"),
          });
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
      <h3 className="py-3 uppercase font-bold">Cập nhật thông tin sản phẩm</h3>
      <div className="bg-white p-3 rounded-md text-gray-800 font-semibold shadow-md">
        <div className="space-y-4 md:space-y-6">
          <div className="flex w-full items-center">
            <div className="w-1/4 hidden md:block">
              <label htmlFor="productImages">Hình ảnh sản phẩm </label>
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
              {purls.length > 0 && (
                <div className="mt-2 text-xs text-gray-600">
                  Hiện có {purls.length} ảnh
                </div>
              )}
              {imageFiles.length > 0 && (
                <div className="mt-1 text-xs text-gray-600">
                  Đã chọn mới {imageFiles.length} ảnh
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
              value={inputs.productName || ""}
              required="a-z"
              onChange={handleChange}
            />
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
              value={Array.isArray(inputs.tags) ? inputs.tags.join(", ") : inputs.tags || ""}
              onChange={handleChange}
            />
          </div>

          <div className="flex w-full items-center">
            <label htmlFor="tags" className="w-1/3 hidden md:block">
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
              value={inputs.stockPrice || ""}
              pattern="[0-9]*"
              onChange={handleChange}
            />
          </div>
          {/* Giá bán đã bỏ, chỉ giữ Giá niêm yết (stockPrice) */}
          <div className="flex w-full items-center">
            <label className="w-1/3 hidden md:block">Số lượng tồn kho</label>
            <div className="block w-full rounded border border-dashed border-gray-300 bg-gray-50 p-2 text-gray-600 sm:text-sm">
              {product.inStock ?? 0} sản phẩm, được tính từ phiếu nhập hàng.
            </div>
          </div>
          <div className="rounded border border-gray-200 bg-gray-50 p-3">
            <div className="mb-2 flex items-center justify-between gap-3">
              <div>
                <p className="font-semibold text-gray-800">Nguồn phiếu nhập</p>
                <p className="text-xs text-gray-500">
                  Sản phẩm này đang được phân bổ từ các phiếu nhập theo thứ tự cũ hơn trước.
                </p>
              </div>
              <Link
                to="/admin/phieu-nhap"
                className="text-sm font-medium text-primary hover:underline"
              >
                Mở phiếu nhập
              </Link>
            </div>
            {receiptData.length > 0 ? (
              <div className="overflow-x-auto rounded border border-gray-200 bg-white">
                <table className="min-w-full divide-y divide-gray-200 text-left text-xs md:text-sm">
                  <thead className="bg-gray-50 text-gray-700">
                    <tr>
                      <th className="px-3 py-2">Ngày nhập</th>
                      <th className="px-3 py-2">Số lượng</th>
                      <th className="px-3 py-2">Đã bán</th>
                      <th className="px-3 py-2">Còn lại</th>
                      <th className="px-3 py-2">Hạn dùng</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {receiptData.map((receipt) => {
                      const remainingQuantity = Math.max(
                        0,
                        Number(receipt.quantity || 0) - Number(receipt.soldQuantity || 0),
                      );

                      return (
                        <tr key={receipt._id}>
                          <td className="px-3 py-2">{receipt.importedDate ? new Date(receipt.importedDate).toLocaleDateString() : "-"}</td>
                          <td className="px-3 py-2 font-semibold">{receipt.quantity}</td>
                          <td className="px-3 py-2 font-semibold text-amber-700">{receipt.soldQuantity ?? 0}</td>
                          <td className="px-3 py-2 font-semibold text-green-700">{remainingQuantity}</td>
                          <td className="px-3 py-2">{receipt.expirationDate ? new Date(receipt.expirationDate).toLocaleDateString() : "-"}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="rounded border border-dashed border-gray-200 bg-white p-3 text-sm text-gray-500">
                Chưa có phiếu nhập nào cho sản phẩm này.
              </div>
            )}
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
                {ocopCertUrl && (
                  <div className="mt-1 text-xs text-gray-600">Đã có ảnh chứng nhận</div>
                )}
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
            <label htmlFor="relatedDocuments" className="w-1/3 hidden md:block">
              Chứng từ liên quan
            </label>
            <input
              id="relatedDocuments"
              name="relatedDocuments"
              type="file"
              accept="application/pdf"
              multiple
              className="block w-full rounded border border-gray-300 bg-gray-50 p-2 text-gray-900 focus:border-primary focus:outline-none focus:ring-primary-600 sm:text-sm"
              onChange={handleDocumentChange}
            />
            {relatedDocUrls.length > 0 && (
              <div className="mt-1 text-xs text-gray-600">
                Hiện có {relatedDocUrls.length} file PDF
              </div>
            )}
            {documentFiles.length > 0 && (
              <div className="mt-1 text-xs text-gray-600">
                Đã chọn mới {documentFiles.length} file PDF
              </div>
            )}
            <div className="mt-1 text-xs text-gray-600">
              Trường này là tùy chọn.
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
              <span className="uppercase">cập nhật</span>
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

export default EditProduct;
