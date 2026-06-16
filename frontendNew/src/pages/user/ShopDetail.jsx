import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import ktsRequest from "../../../ultis/ktsrequest";
import { vnd } from "../../../ultis/ktsFunc";
import { Footer, Header, Navbar, Promotion } from "../../components";

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

const ShopDetail = () => {
  const { shopId } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);
  const [loading, setLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followersCount, setFollowersCount] = useState(0);
  const [isFollowLoading, setIsFollowLoading] = useState(false);
  const [shopData, setShopData] = useState({ shop: null, products: [], productsCount: 0 });

  useEffect(() => {
    const fetchShop = async () => {
      try {
        setLoading(true);
        const res = await ktsRequest.get(`/shops/${shopId}`);
        setShopData({
          shop: res.data.shop,
          products: res.data.products || [],
          productsCount: res.data.productsCount ?? (res.data.products || []).length,
        });
        
        // Check if current user is following this shop
        if (currentUser && res.data.shop?.likedBy) {
          const isFollowingShop = res.data.shop.likedBy.includes(currentUser._id || currentUser.id);
          setIsFollowing(isFollowingShop);
        }
        
        // Set followers count
        setFollowersCount(res.data.shop?.likedBy?.length || 0);
      } catch (err) {
        err.response ? navigate("/notfound") : toast.error("Network Error!");
      } finally {
        setLoading(false);
      }
    };

    fetchShop();
  }, [shopId, navigate, currentUser]);

  const handleFollow = async () => {
    if (!currentUser) {
      toast.info("Vui lòng đăng nhập để follow shop");
      navigate("/login");
      return;
    }

    try {
      setIsFollowLoading(true);
      if (isFollowing) {
        // Unfollow
        await ktsRequest.put(
          `/users/unfollow/${shopId}`,
          {},
          { headers: { Authorization: `Bearer ${currentUser.token}` } }
        );
        setIsFollowing(false);
        setFollowersCount((prev) => Math.max(0, prev - 1));
        toast.success("Hủy follow shop thành công");
      } else {
        // Follow
        await ktsRequest.put(
          `/users/follow/${shopId}`,
          {},
          { headers: { Authorization: `Bearer ${currentUser.token}` } }
        );
        setIsFollowing(true);
        setFollowersCount((prev) => prev + 1);
        toast.success("Follow shop thành công");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Có lỗi xảy ra");
    } finally {
      setIsFollowLoading(false);
    }
  };

  const shop = shopData.shop;
  return (
    <div>
      <Promotion />
      <Header />
      <Navbar />
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
        <div className="mx-auto max-w-screen-xl px-3 py-6">
          <div className="overflow-hidden rounded-2xl border border-green-200 bg-white shadow-lg">
            <div className="h-28 bg-gradient-to-r from-green-500 via-emerald-500 to-lime-400" />
            <div className="-mt-10 px-4 pb-6 md:px-6">
              <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                <div className="flex items-end gap-4">
                  {shop?.img ? (
                    <img
                      src={shop.img}
                      alt={shop?.displayName || shop?.username || "Shop"}
                      className="h-20 w-20 rounded-2xl border-4 border-white object-cover shadow-md"
                    />
                  ) : (
                    <div
                      className={`h-20 w-20 rounded-2xl border-4 border-white flex items-center justify-center text-white text-2xl font-bold shadow-md ${getAvatarColor(
                        shop?.displayName || shop?.username || "Shop",
                      )}`}
                    >
                      {getAvatarText(shop?.displayName || shop?.username || "Shop")}
                    </div>
                  )}
                  <div>
                    <p className="text-sm uppercase tracking-widest text-gray-500">
                      Thông tin cửa hàng
                    </p>
                    <h1 className="text-2xl font-bold text-gray-900">
                      {shop?.displayName || shop?.username || "Cửa hàng"}
                    </h1>
                    <p className="text-sm text-gray-600">
                      {shop?.address || "Chưa cập nhật địa chỉ"}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col gap-3 w-full md:w-auto">
                  <div className="grid grid-cols-3 gap-3 text-center">
                    <div className="rounded-xl bg-green-50 p-3">
                      <p className="text-2xl font-bold text-primary">
                        {loading ? "..." : shopData.productsCount}
                      </p>
                      <p className="text-sm text-gray-600">Sản phẩm</p>
                    </div>
                    <div className="rounded-xl bg-green-50 p-3">
                      <p className="text-2xl font-bold text-primary">
                        {followersCount}
                      </p>
                      <p className="text-sm text-gray-600">Followers</p>
                    </div>
                    <div className="rounded-xl bg-green-50 p-3">
                      <p className="text-2xl font-bold text-primary">
                        {shop?.phone ? "✓" : "-"}
                      </p>
                      <p className="text-sm text-gray-600">Liên hệ</p>
                    </div>
                  </div>
                  <button
                    onClick={handleFollow}
                    disabled={isFollowLoading}
                    className="px-6 py-2 rounded-lg font-semibold text-white transition bg-green-600 hover:bg-green-700 disabled:bg-green-500 w-full md:w-auto"
                  >
                    {isFollowLoading ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        {isFollowing ? "Hủy follow..." : "Follow..."}
                      </span>
                    ) : (
                      <span className="flex items-center justify-center gap-2">
                        {isFollowing ? (
                          <>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" className="w-4 h-4">
                              <path d="M12 1l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 1z"/>
                            </svg>
                            Đang theo dõi
                          </>
                        ) : (
                          <>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                            </svg>
                            Follow
                          </>
                        )}
                      </span>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 rounded-2xl border border-green-200 bg-white p-4 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-800">
                Danh sách sản phẩm của shop
              </h2>
              <span className="text-sm text-gray-500">
                {shopData.productsCount} sản phẩm
              </span>
            </div>
            {loading ? (
              <p className="text-sm text-gray-500">Đang tải dữ liệu...</p>
            ) : shopData.products.length === 0 ? (
              <p className="text-sm text-gray-500">Shop chưa có sản phẩm nào.</p>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {shopData.products.map((product) => (
                  <Link
                    key={product._id}
                    to={`/products/${product._id}`}
                    className="overflow-hidden rounded-xl border border-green-100 bg-green-50 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                  >
                    <img
                      src={product.imgs?.[0] || "https://via.placeholder.com/300.png?text=Product"}
                      alt={product.productName}
                      className="h-44 w-full object-cover"
                    />
                    <div className="space-y-2 p-3">
                      <h3 className="line-clamp-2 font-semibold text-gray-800">
                        {product.productName}
                      </h3>
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-semibold text-primary">
                          {product.stockPrice > 0 ? vnd(product.currentPrice) : "Liên hệ"}
                        </span>
                        <span className="text-gray-500">
                          Còn {product.inStock || 0}
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ShopDetail;