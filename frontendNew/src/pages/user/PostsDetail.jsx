import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import ktsRequest from "../../../ultis/ktsrequest";
import { Navbar, Footer, Header, Promotion } from "../../components";

const PostDetail = () => {
  const { postId } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [relatedPosts, setRelatedPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        const res = await ktsRequest.get(`/posts/${postId}`);
        if (res.data.status !== 1) {
          toast.error("Bài viết chưa được duyệt hoặc không tồn tại");
          navigate("/posts");
          return;
        }
        setPost(res.data);

        // Fetch all approved posts to find related ones
        const allPostsRes = await ktsRequest.get("/posts");
        const filtered = allPostsRes.data
          .filter((p) => p._id !== postId && p.status === 1)
          .slice(0, 3);
        setRelatedPosts(filtered);
      } catch (err) {
        console.error(err);
        toast.error(err.response?.data?.message || "Lỗi tải bài viết");
        navigate("/posts");
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [postId, navigate]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
          <p className="mt-4 text-gray-600">Đang tải bài viết...</p>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div>
        <Promotion />
        <Header />
        <Navbar />
        {/* <div className="max-w-screen-xl mx-auto px-4 py-12">
          <p className="text-center text-gray-600">Bài viết không tồn tại</p>
          <div className="text-center mt-4">
          </div>
        </div> */}
        <Footer />
      </div>
    );
  }

  return (
    <div>
      <Promotion />
      <Header />
      <Navbar />

      <div className="bg-gray-50 py-8">
        <div className="max-w-3xl mx-auto px-4">
          {/* Post Header */}
          <div className="bg-white rounded-lg shadow-md p-6 md:p-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              {post.title}
            </h1>

            <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-6 border-b pb-4">
              <span>
                <strong>Tác giả:</strong> {post.userName || "admin"}
              </span>
              <span>
                <strong>Ngày đăng:</strong>{" "}
                {new Date(post.createdAt).toLocaleString("vi-VN")}
              </span>
              {post.updatedAt && post.updatedAt !== post.createdAt && (
                <span>
                  <strong>Cập nhật:</strong>{" "}
                  {new Date(post.updatedAt).toLocaleString("vi-VN")}
                </span>
              )}
            </div>

            {/* Featured Image */}
            {post.thumbnail && (
              <div className="mb-6 rounded-lg overflow-hidden">
                <img
                  src={post.thumbnail}
                  alt={post.title}
                  className="w-full h-96 object-cover"
                />
              </div>
            )}

            {/* Description */}
            {post.description && (
              <p className="text-lg text-gray-700 mb-6 italic border-l-4 border-orange-500 pl-4">
                {post.description}
              </p>
            )}

            {/* Content */}
            <div
              className="text-gray-800 leading-relaxed mb-8 break-words"
              dangerouslySetInnerHTML={{ __html: post.content || "" }}
            />

            {/* Product Link (if available) */}
            {post.productId && (
              <div>
                <p className="text-sm text-gray-700 mb-2"></p>
                <Link
                  to={`/products/${post.productId}`}
                  className="text-orange-600 hover:text-orange-700 font-medium"
                >
                  Xem sản phẩm →
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <div className="max-w-screen-xl mx-auto px-4 py-12">
          <h2 className="text-2xl font-bold mb-6">Tin tức liên quan</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedPosts.map((relatedPost) => (
              <div
                key={relatedPost._id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
              >
                <Link
                  to={`/posts/${relatedPost._id}`}
                  className="block overflow-hidden w-full h-40"
                >
                  <img
                    src={relatedPost.thumbnail}
                    alt={relatedPost.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </Link>
                <div className="p-4">
                  <h3 className="font-semibold mb-2 line-clamp-2 hover:text-orange-500">
                    <Link to={`/posts/${relatedPost._id}`}>
                      {relatedPost.title}
                    </Link>
                  </h3>
                  <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                    {relatedPost.description}
                  </p>
                  <Link
                    to={`/posts/${relatedPost._id}`}
                    className="text-orange-600 hover:text-orange-700 font-medium text-sm"
                  >
                    Chi tiết →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default PostDetail;
