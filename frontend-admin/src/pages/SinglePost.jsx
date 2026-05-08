import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import ktsRequest from "../../ultis/ktsrequest";
import "./singlepost.css";
const SinglePost = () => {
  const navigate = useNavigate();
  const { postid } = useParams();
  const [post, setPost] = useState();
  const { currentUser } = useSelector((state) => state.user);
  const { token } = currentUser;
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await ktsRequest.get(`/posts/${postid}`);
        setPost(res.data);
      } catch (err) {
        // err.response ? navigate("/notfound") : toast.error("Network Error!");
      }
    };
    fetchData();
  }, []);
  const handleOk = async () => {
    try {
      const res = await ktsRequest.put(
        `/posts/${postid}`,
        {
          ...post,
          status: 1,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success(res.data, {
        onClose: () => navigate(-1),
      });
    } catch (error) {
      error.response
        ? toast.error(error.response.data.message)
        : toast.error("Network Error!");
    }
  };
  const handleEdit = async () => {
    try {
      const res = await ktsRequest.put(
        `/posts/${postid}`,
        {
          ...post,
          status: 0,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success(res.data, {
        onClose: () => navigate(-1),
      });
    } catch (error) {
      error.response
        ? toast.error(error.response.data.message)
        : toast.error("Network Error!");
    }
  };
  return (
    <div className="w-full px-2">
      <div className=" bg-white rounded-md">
        <div className="mb-12 max-w-screen-md mx-auto py-4 flex gap-3 flex-col">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-3xl font-bold">{post?.title}</h3>
              <div>
                <span className="text-red-500 font-semibold">
                  {post?.author || "dichoho.top"},
                </span>
                <span className="">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-3.5 h-3.6 inline-block ml-2 "
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span className="italic text-xs">
                    {new Date(post?.createdAt).toLocaleString()}
                  </span>
                </span>
              </div>
            </div>
            <div className="flex w-1/4 justify-between text-white">
              <button
                className="bg-primary px-3 py-2 rounded hover:bg-green-700 w-1/2 active:scale-90 duration-300 hover:scale-105"
                title="duyệt bài viết"
                onClick={handleOk}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-5 h-5 mx-auto"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4.5 12.75l6 6 9-13.5"
                  />
                </svg>
              </button>
              <button
                className="bg-orange-500 px-3 py-2 rounded hover:bg-orange-600 w-1/2 ml-2 active:scale-90 duration-300 hover:scale-105"
                title="yêu cầu chỉnh sửa"
                onClick={handleEdit}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-5 h-5 mx-auto"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125"
                  />
                </svg>
              </button>
            </div>
          </div>
          <div className="w-full h-96">
            <img
              src={post?.thumbnail}
              alt=""
              className="w-full h-full object-contain object-center"
            />
          </div>
          <div
            dangerouslySetInnerHTML={{ __html: post?.content }}
            className="text-justify baiviet"
          ></div>
        </div>
      </div>
    </div>
  );
};

export default SinglePost;
