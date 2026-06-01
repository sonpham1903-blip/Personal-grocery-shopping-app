import React, { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import ktsRequest from "../../ultis/ktsrequest";

const formatDateInput = (value = new Date()) => {
  const date = value instanceof Date ? value : new Date(value);
  return date.toISOString().slice(0, 10);
};

const formatReceiptLabelDate = (value) => {
  const date = value ? new Date(value) : null;

  if (!date || Number.isNaN(date.getTime())) {
    return "-";
  }

  return date.toLocaleDateString("vi-VN");
};

const GoodReceipts = () => {
  const { currentUser } = useSelector((state) => state.user);
  const { token } = currentUser;
  const [products, setProducts] = useState([]);
  const [receipts, setReceipts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingReceiptId, setEditingReceiptId] = useState(null);
  const [form, setForm] = useState({
    productId: "",
    quantity: "",
    importedDate: formatDateInput(),
    expirationDate: "",
  });

  const isAdmin = currentUser?.role === "admin";

  const loadData = async () => {
    try {
      const productRes = await ktsRequest.get("/products/my", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const receiptRes = isAdmin
        ? await ktsRequest.get("/good-receipts")
        : await ktsRequest.get(`/good-receipts/shop/${currentUser._id}`);

      setProducts(productRes.data || []);
      setReceipts(receiptRes.data || []);
      if (!form.productId && productRes.data?.length > 0) {
        setForm((prev) => ({ ...prev, productId: productRes.data[0]._id }));
      }
    } catch (error) {
      toast.error(error.response ? error.response.data : "Network Error!");
    }
  };

  useEffect(() => {
    loadData();
  }, [currentUser._id, isAdmin, token]);

  const productMap = useMemo(() => {
    return products.reduce((accumulator, product) => {
      accumulator[product._id] = product;
      return accumulator;
    }, {});
  }, [products]);

  const receiptLabelMap = useMemo(() => {
    const dayCounters = {};
    const sortedReceipts = [...receipts].sort((left, right) => {
      const leftTime = new Date(left.importedDate || left.createdAt || 0).getTime();
      const rightTime = new Date(right.importedDate || right.createdAt || 0).getTime();

      if (leftTime !== rightTime) {
        return leftTime - rightTime;
      }

      return new Date(left.createdAt || 0).getTime() - new Date(right.createdAt || 0).getTime();
    });

    return sortedReceipts.reduce((accumulator, receipt) => {
      const dayKey = receipt.importedDate
        ? new Date(receipt.importedDate).toISOString().slice(0, 10)
        : "unknown";

      dayCounters[dayKey] = (dayCounters[dayKey] || 0) + 1;
      accumulator[receipt._id] = receipt.name || `${formatReceiptLabelDate(receipt.importedDate)} nhập kho lần ${dayCounters[dayKey]}`;
      return accumulator;
    }, {});
  }, [receipts]);

  const selectedProduct = productMap[form.productId];

  const resetForm = (nextProductId = form.productId || products[0]?._id || "") => {
    setEditingReceiptId(null);
    setForm({
      productId: nextProductId,
      quantity: "",
      importedDate: formatDateInput(),
      expirationDate: "",
    });
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const startEdit = (receipt) => {
    setEditingReceiptId(receipt._id);
    setForm({
      productId: receipt.productId,
      quantity: String(receipt.quantity ?? 0),
      importedDate: receipt.importedDate ? formatDateInput(receipt.importedDate) : formatDateInput(),
      expirationDate: receipt.expirationDate ? formatDateInput(receipt.expirationDate) : "",
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!form.productId) {
      toast.error("Vui lòng chọn sản phẩm");
      return;
    }

    const quantity = Number(form.quantity);
    if (!Number.isFinite(quantity) || quantity <= 0) {
      toast.error("Số lượng nhập phải lớn hơn 0");
      return;
    }

    if (!form.importedDate || !form.expirationDate) {
      toast.error("Vui lòng chọn ngày nhập và hạn sử dụng");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        productId: form.productId,
        quantity,
        importedDate: form.importedDate,
        expirationDate: form.expirationDate,
      };

      const requestConfig = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };

      const res = editingReceiptId
        ? await ktsRequest.put(
            `/good-receipts/${editingReceiptId}`,
            payload,
            requestConfig,
          )
        : await ktsRequest.post("/good-receipts", payload, requestConfig);

      toast.success(res.data);
      resetForm(payload.productId);
      await loadData();
    } catch (error) {
      toast.error(error.response ? error.response.data : "Tạo phiếu nhập thất bại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-3 text-xs md:text-base">
      <div className="mb-3 rounded-md bg-white px-4 py-3 shadow-sm">
        <h3 className="font-bold uppercase">phiếu nhập hàng</h3>
        <p className="mt-1 text-sm text-gray-600">
          Tạo phiếu nhập để tự động cộng tồn kho cho sản phẩm.
        </p>
      </div>

      <div className="grid gap-3 lg:grid-cols-3">
        <div className="rounded-md bg-white p-4 shadow-lg lg:col-span-1">
          <h4 className="mb-4 font-semibold text-gray-800">Tạo phiếu nhập</h4>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Sản phẩm</label>
              <select
                name="productId"
                value={form.productId}
                onChange={handleChange}
                className="block w-full rounded border border-gray-300 bg-gray-50 p-2 text-gray-900 focus:border-primary focus:outline-none"
              >
                <option value="" disabled>
                  Chọn sản phẩm
                </option>
                {products.map((product) => (
                  <option key={product._id} value={product._id}>
                    {product.productName}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Số lượng nhập</label>
              <input
                type="number"
                min="1"
                name="quantity"
                value={form.quantity}
                onChange={handleChange}
                className="block w-full rounded border border-gray-300 bg-gray-50 p-2 text-gray-900 focus:border-primary focus:outline-none"
                placeholder="Nhập số lượng"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Ngày nhập</label>
              <input
                type="date"
                name="importedDate"
                value={form.importedDate}
                onChange={handleChange}
                className="block w-full rounded border border-gray-300 bg-gray-50 p-2 text-gray-900 focus:border-primary focus:outline-none"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Hạn sử dụng</label>
              <input
                type="date"
                name="expirationDate"
                value={form.expirationDate}
                onChange={handleChange}
                className="block w-full rounded border border-gray-300 bg-gray-50 p-2 text-gray-900 focus:border-primary focus:outline-none"
              />
            </div>

            {selectedProduct && (
              <div className="rounded-md bg-green-50 p-3 text-sm text-green-800">
                <div className="font-semibold">Tồn kho hiện tại</div>
                <div>{selectedProduct.inStock ?? 0} sản phẩm</div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded bg-primary px-5 py-3 text-center text-sm font-medium text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Đang lưu..." : editingReceiptId ? "Cập nhật phiếu nhập" : "Tạo phiếu nhập"}
            </button>

            {editingReceiptId && (
              <button
                type="button"
                onClick={() => resetForm()}
                className="w-full rounded border border-gray-300 px-5 py-3 text-center text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Hủy chỉnh sửa
              </button>
            )}
          </form>
        </div>

        <div className="rounded-md bg-white p-4 shadow-lg lg:col-span-2">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h4 className="font-semibold text-gray-800">Danh sách phiếu nhập gần đây</h4>
            <Link to="/admin/san-pham" className="text-sm font-medium text-primary hover:underline">
              Quản lý sản phẩm
            </Link>
          </div>

          {receipts.length > 0 ? (
            <div className="overflow-x-auto rounded border border-gray-100">
              <table className="min-w-full divide-y divide-gray-200 text-left text-sm">
                <thead className="bg-gray-50 text-gray-700">
                  <tr>
                    <th className="px-3 py-2">Ngày nhập</th>
                    <th className="px-3 py-2">Tên phiếu</th>
                    <th className="px-3 py-2">Sản phẩm</th>
                    <th className="px-3 py-2">Số lượng</th>
                    <th className="px-3 py-2">Đã bán</th>
                    <th className="px-3 py-2">Còn lại</th>
                    <th className="px-3 py-2">Hạn sử dụng</th>
                    <th className="px-3 py-2">Tồn kho</th>
                    <th className="px-3 py-2">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {receipts.map((receipt) => {
                    const product = productMap[receipt.productId];
                    const remainingQuantity = Math.max(
                      0,
                      Number(receipt.quantity || 0) - Number(receipt.soldQuantity || 0),
                    );
                    return (
                      <tr key={receipt._id} className="text-gray-700">
                        <td className="px-3 py-2">{receipt.importedDate ? new Date(receipt.importedDate).toLocaleDateString() : "-"}</td>
                        <td className="px-3 py-2 font-medium text-gray-900">{receiptLabelMap[receipt._id] || receipt.name || "Phiếu nhập"}</td>
                        <td className="px-3 py-2">
                          <div className="font-medium">{product?.productName || receipt.productId}</div>
                          <div className="text-xs text-gray-500">{product?.cat || receipt.shopId}</div>
                        </td>
                        <td className="px-3 py-2 font-semibold">{receipt.quantity}</td>
                        <td className="px-3 py-2 font-semibold text-amber-700">{receipt.soldQuantity ?? 0}</td>
                        <td className="px-3 py-2 font-semibold text-green-700">{remainingQuantity}</td>
                        <td className="px-3 py-2">{receipt.expirationDate ? new Date(receipt.expirationDate).toLocaleDateString() : "-"}</td>
                        <td className="px-3 py-2 font-semibold text-green-700">{product?.inStock ?? 0}</td>
                        <td className="px-3 py-2">
                          <button
                            type="button"
                            onClick={() => startEdit(receipt)}
                            className="rounded border border-primary px-3 py-1 text-xs font-medium text-primary hover:bg-primary hover:text-white"
                          >
                            Sửa
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="rounded border border-dashed border-gray-200 p-6 text-center text-gray-600">
              Chưa có phiếu nhập nào.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GoodReceipts;
