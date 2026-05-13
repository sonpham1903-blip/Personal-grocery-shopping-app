import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import ktsRequest from "../../../ultis/ktsrequest";
import { Navbar, Footer, Header, Promotion } from "../../components";

const NewsCard = ({ id, thumbnail, title, description, createdAt }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <Link to={`/posts/${id}`} className="block overflow-hidden w-full h-48">
        <img
          src={thumbnail}
          alt={title}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
        />
      </Link>
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-2 line-clamp-2 hover:text-orange-500">
          <Link to={`/posts/${id}`}>{title}</Link>
        </h3>
        <p className="text-gray-600 text-sm line-clamp-2 mb-3">{description}</p>
        <div className="flex justify-between items-center text-xs text-gray-500">
          <span>{new Date(createdAt).toLocaleDateString("vi-VN")}</span>
          <Link
            to={`/posts/${id}`}
            className="text-orange-600 hover:text-orange-700 font-medium"
          >
            Chi tiết →
          </Link>
        </div>
      </div>
    </div>
  );
};

const Posts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const res = await ktsRequest.get("/posts");
        setPosts(res.data);
      } catch (err) {
        console.error(err);
        toast.error(err.response?.data?.message || "Lỗi tải tin tức");
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  const approvedPosts = posts.filter((post) => post.status === 1);
  const filteredPosts = approvedPosts;

  return (
    <div>
      <Promotion />
      <Header />
      <Navbar />

      <div className="max-w-screen-xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">TIN TỨC & SỰ KIỆN</h1>
          <p className="text-gray-600">
            Cập nhật những thông tin mới nhất từ cửa hàng
          </p>
        </div>

        {/* Search removed - showing all approved posts */}

        {/* Posts Grid */}
        <div>
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="text-center">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
                <p className="mt-4 text-gray-600">Đang tải tin tức...</p>
              </div>
            </div>
          ) : filteredPosts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPosts.map((post) => (
                <NewsCard
                  key={post._id}
                  id={post._id}
                  thumbnail={post.thumbnail}
                  title={post.title}
                  description={post.description}
                  createdAt={post.createdAt}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">
                Không tìm thấy tin tức nào
              </p>
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <p className="text-center text-gray-600">
            Tổng cộng{" "}
            <span className="font-bold text-orange-600">
              {approvedPosts.length}
            </span>{" "}
            tin tức
          </p>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Posts;
