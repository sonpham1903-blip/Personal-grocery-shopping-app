import React, { useState, useEffect } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useSelector } from "react-redux";
import ktsRequest from "../../ultis/ktsrequest";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import { uploadSingleFile } from "../../ultis/handleFile";
const EditPost = () => {
  const [value, setValue] = useState("");
  const [title, setTitle] = useState("");
  const [file, setFile] = useState();
  const [url, setUrl] = useState();
  const [type, setType] = useState(true);
  const [data, setData] = useState([]);
  const [productId, setProductId] = useState("");
  const { postid } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);
  useEffect(() => {
    const uploadFile = async () => {
      if (!file) return;
      setUrl("");

      try {
        const downloadURL = await uploadSingleFile(
          file,
          `images/posts/${currentUser._id}`,
        );
        setUrl(downloadURL);
      } catch (error) {
        console.error("Upload error:", error);
        toast.error(error.message || "Lỗi upload ảnh");
      }
    };
    uploadFile();
  }, [file, currentUser._id]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await ktsRequest.get(`/posts/${postid}`, {
          headers: {
            Authorization: `Bearer ${currentUser.token}`,
          },
        });
        setType(res.data.postType);
        setTitle(res.data.title);
        setValue(res.data.content);
        setUrl(res.data.thumbnail);
        setProductId(res.data.productId || "");
      } catch (error) {
        console.log(error);
      }
    };

    if (currentUser?.token) {
      fetchData();
    }
  }, [window.location.pathname, currentUser?.token]);
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await ktsRequest.get("/products/my", {
          headers: {
            Authorization: `Bearer ${currentUser.token}`,
          },
        });
        console.log("Fetched products:", res.data);
        setData(res.data);
      } catch (error) {
        console.log("Error fetching products:", error);
      }
    };

    if (currentUser?.token) {
      fetchProducts();
    }
  }, [currentUser?.token]);

  const handleClick = async () => {
    if (!title.trim()) {
      toast.error("Tiêu đề bài viết là bắt buộc");
      return;
    }
    if (!value.trim()) {
      toast.error("Nội dung bài viết là bắt buộc");
      return;
    }
    if (!url) {
      toast.error("Ảnh bìa bài viết là bắt buộc");
      return;
    }
    const postData = {
      postType: type,
      title: title.trim(),
      author: currentUser.displayName || "sale168.com",
      content: value.trim(),
      thumbnail: url,
      productId: productId || undefined,
    };

    // Do not modify approval `status` when editing; approval is handled separately
    try {
      const config = {
        method: "put",
        url: `/posts/${postid}`,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${currentUser.token}`,
        },
        data: postData,
      };
      await ktsRequest(config)
        .then((res) => {
          toast.success("Bài viết đã được cập nhật thành công", {
            onClose: () => navigate("/admin/bai-viet"),
          });
        })
        .catch((er) => {
          console.error(er);
          toast.error(
            er.response?.data?.message || "Lỗi khi cập nhật bài viết",
          );
        });
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Lỗi mạng");
    }
  };
  return (
    <div className="bg-white p-3">
      <div className="flex w-full items-center mb-2">
        <label htmlFor="type" className="w-1/6 hidden md:block">
          Loại bài viết
        </label>
        <select
          id="type"
          className="md:w-2/6 w-full rounded border border-gray-300 bg-gray-50 p-2 text-gray-900 focus:border-primary focus:outline-none focus:ring-primary-600 sm:text-sm"
          onChange={(e) => setType(!type)}
        >
          <option selected>Bài viết</option>
          <option>Mô tả sản phẩm</option>
        </select>
      </div>
      {!type && (
        <div className="flex w-full items-center mb-2">
          <label htmlFor="product" className="w-1/6 hidden md:block">
            Sản phẩm áp dụng
          </label>
          <div className="md:w-5/6 w-full">
            <select
              name="product"
              id="product"
              className="w-full rounded border border-gray-300 bg-gray-50 p-2 text-gray-900 focus:border-primary focus:outline-none focus:ring-primary-600 sm:text-sm"
              onChange={(e) => setProductId(e.target.value)}
              value={productId}
            >
              <option value="">Chọn sản phẩm (tùy chọn)</option>
              {data.map((p) => (
                <option key={p._id} value={p._id}>
                  {p.productName}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}
      <div className="flex w-full items-center mb-2">
        <label className="w-1/6 hidden md:block">Tác giả</label>
        <input
          type="text"
          className="md:w-5/6 w-full rounded border border-gray-300 bg-gray-100 p-2 text-gray-900 sm:text-sm"
          value={currentUser.displayName || "sale168.com"}
          disabled
        />
      </div>
      <div className="flex w-full items-center mb-2">
        <label htmlFor="title" className="w-1/6 hidden md:block">
          Tiêu đề bài viết
        </label>
        <input
          type="text"
          name="title"
          id="title"
          className="md:w-5/6 w-full rounded border border-gray-300 bg-gray-50 p-2 text-gray-900 focus:border-primary focus:outline-none focus:ring-primary-600 sm:text-sm"
          placeholder="Tiêu đề bài viết"
          onChange={(e) => setTitle(e.target.value)}
          value={title}
        />
      </div>
      <div className="flex w-full items-center mb-2">
        <label htmlFor="img" className="w-1/6 hidden md:block">
          Ảnh bìa bài viết
        </label>
        <div className="md:w-5/6 w-full">
          <input
            type="file"
            name="img"
            id="img"
            className="rounded border border-gray-300 bg-gray-50 p-2 text-gray-900 focus:border-primary focus:outline-none focus:ring-primary-600 sm:text-sm"
            placeholder="Tiêu đề bài viết"
            onChange={(e) => setFile(e.target.files[0])}
          />
          <div className="w-full">
            <img
              src={file ? URL.createObjectURL(file) : url}
              alt=""
              className="w-32"
            />
          </div>
        </div>
      </div>

      <div className="my-2 h-[80vh]">
        <ReactQuill
          theme="snow"
          value={value}
          onChange={setValue}
          id="content"
          className="h-full"
        />
      </div>
      <div className="mt-12 text-end">
        <button
          className="bg-primary text-white px-4 py-2 rounded-sm hover:bg-green-700"
          onClick={handleClick}
        >
          Lưu bài viết
        </button>
      </div>
    </div>
  );
};

export default EditPost;
