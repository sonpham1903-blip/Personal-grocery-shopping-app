import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Footer, Header, Navbar, Promotion } from "../../components";
import ktsRequest from "../../../ultis/ktsrequest";

const Shops = () => {
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchShops = async () => {
      try {
        const res = await ktsRequest.get("/shops");
        setShops(res.data || []);
      } catch (err) {
        console.error(
          "Không thể tải danh sách shop:",
          err.response?.data || err.message,
        );
      } finally {
        setLoading(false);
      }
    };

    fetchShops();
  }, []);

  return (
    <div>
      <Promotion />
      <Header />
      <Navbar />

      <main className="bg-gray-50 py-8">
        <div className="max-w-screen-xl mx-auto px-4">
          <div className="mb-8 rounded-2xl bg-white p-6 shadow-sm">
            <p className="text-sm font-medium uppercase tracking-[0.24em] text-green-700">
              Danh sách cửa hàng
            </p>
            <h1 className="mt-3 text-3xl font-bold text-gray-900">Shop</h1>
            <p className="mt-2 text-gray-600">
              Khám phá các cửa hàng cung cấp nông sản tươi sạch, OCOP và sản
              phẩm địa phương.
            </p>
          </div>

          {loading ? (
            <div className="flex h-56 items-center justify-center rounded-2xl bg-white shadow-sm">
              <svg
                className="h-8 w-8 animate-spin text-green-600"
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
            </div>
          ) : shops.length === 0 ? (
            <div className="rounded-2xl bg-white p-8 text-center text-gray-600 shadow-sm">
              Không tìm thấy cửa hàng nào.
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {shops.map((shop) => (
                <Link
                  to={`/shop/${shop._id}`}
                  key={shop._id}
                  className="group overflow-hidden rounded-3xl border border-green-100 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="h-44 w-full overflow-hidden bg-green-50">
                    <img
                      src={
                        shop.img ||
                        "https://via.placeholder.com/400x280.png?text=Shop"
                      }
                      alt={shop.displayName || shop.username || "Shop"}
                      className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-5">
                    <h2 className="text-xl font-semibold text-gray-900">
                      {shop.displayName || shop.username || "Cửa hàng"}
                    </h2>
                    <p className="mt-2 text-sm text-gray-600 line-clamp-2">
                      {shop.address || "Chưa cập nhật địa chỉ"}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Shops;
