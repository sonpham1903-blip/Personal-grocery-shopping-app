import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Footer, Header, Navbar, Promotion } from "../../components";
import ktsRequest from "../../../ultis/ktsrequest";

const avatarColors = [
  "bg-orange-500",
  "bg-emerald-500",
  "bg-cyan-500",
  "bg-fuchsia-500",
  "bg-sky-500",
  "bg-violet-500",
  "bg-lime-500",
  "bg-amber-500",
  "bg-rose-500",
];

const getAvatarColor = (seed = "") => {
  if (!seed) return avatarColors[0];
  const hash = Array.from(seed).reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
  return avatarColors[hash % avatarColors.length];
};

const getAvatarText = (text = "") => {
  if (!text) return "S";
  return text.trim().charAt(0).toUpperCase();
};

const Shops = () => {
  const { currentUser } = useSelector((state) => state.user);
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
  }, [currentUser]);

  return (
    <div>
      <Promotion />
      <Header />
      <Navbar />

      <main className="min-h-screen bg-gradient-to-b from-green-50 to-white py-8">
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

          {currentUser && (
            <div className="mb-6 rounded-2xl border border-green-100 bg-white p-6 shadow-sm">
              <p className="text-sm font-medium uppercase tracking-[0.24em] text-green-700">
                Đã follow
              </p>
              <p className="mt-2 text-gray-600">
                Danh sách shop bạn đã follow. Nếu chưa follow shop nào, bạn có
                thể khám phá bên dưới.
              </p>
              <div className="mt-6">
                {loading ? (
                  <p className="text-sm text-gray-500">
                    Đang tải danh sách theo dõi...
                  </p>
                ) : shops.filter((shop) =>
                    shop.likedBy?.includes(currentUser._id || currentUser.id),
                  ).length === 0 ? (
                  <p className="text-sm text-gray-500">
                    Bạn chưa follow shop nào.
                  </p>
                ) : (
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {shops
                      .filter((shop) =>
                        shop.likedBy?.includes(
                          currentUser._id || currentUser.id,
                        ),
                      )
                      .map((shop) => (
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
                            <h3 className="text-xl font-semibold text-gray-900">
                              {shop.displayName || shop.username || "Cửa hàng"}
                            </h3>
                            <p className="mt-2 text-sm text-gray-600 line-clamp-2">
                              {shop.address || "Chưa cập nhật địa chỉ"}
                            </p>
                          </div>
                        </Link>
                      ))}
                  </div>
                )}
              </div>
            </div>
          )}

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
                    {shop.img ? (
                      <img
                        src={shop.img}
                        alt={shop.displayName || shop.username || "Shop"}
                        className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                      />
                    ) : (
                      <div className={`h-full w-full flex items-center justify-center text-white text-5xl font-bold ${getAvatarColor(shop.displayName || shop.username || "Shop")}`}>
                        {getAvatarText(shop.displayName || shop.username)}
                      </div>
                    )}
                  </div>
                  <div className="p-5">
                    <h2 className="text-xl font-semibold text-gray-900">
                      {shop.displayName || shop.username || "Cửa hàng"}
                    </h2>
                    <p className="mt-2 text-sm text-gray-600 line-clamp-2">
                      {shop.address || "Chưa cập nhật địa chỉ"}
                    </p>
                    {currentUser &&
                      shop.likedBy?.includes(
                        currentUser._id || currentUser.id,
                      ) && (
                        <span className="mt-3 inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-800">
                          Đã follow
                        </span>
                      )}
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
