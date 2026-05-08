import React, { useState } from "react";

const PageSetting = () => {
  const [promotionImg, setPromotionImg] = useState("");
  const [bannerImg, setBannerImg] = useState("");
  return (
    <div className="space-y-2 p-2">
      <div className="bg-white rounded-md shadow-md overflow-hidden">
        <h3 className="uppercase font-semibold bg-primary text-white p-2">
          Thông báo
        </h3>
        <div className="p-2 space-y-2 ">
          <div className="flex flex-row space-x-3">
            <span className="w-1/6">ID bài viết</span>
            <input
              type="text"
              className="focus:bg-white focus:outline-primary rounded flex-1 px-2 py-1 bg-gray-200"
            />
            <button className="px-4 bg-blue-500 text-white rounded">Đổi</button>
          </div>
          <div className="flex space-x-3">
            <span className="w-1/6">Ảnh tham chiếu</span>
            {!promotionImg ? (
              <div className="flex-1 relative w-full bg-gray-200">
                <img
                  src=""
                  alt=""
                  className="w-full object-contain object-center bg-red-500"
                />
                <button className="absolute top-0 right-0 p-2 hover:bg-white/50 rounded-full ">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-3 h-3"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"
                    />
                  </svg>
                </button>
              </div>
            ) : (
              <input type="file" id="proImg" className="text" />
            )}
          </div>
        </div>
      </div>
      <div className="bg-white rounded-md overflow-hidden shadow-md space-y-2">
        <h3 className="uppercase font-semibold bg-primary text-white p-2">
          banner
        </h3>
        {/* setting */}
        <div className="flex flex-row space-x-3 px-2">
          <span className="w-1/6 truncate">Tốc độ chuyển slides (s)</span>
          <input
            type="text"
            className="focus:bg-white focus:outline-primary rounded flex-1 px-2 py-1 bg-gray-200"
          />
          <button className="px-4 bg-blue-500 text-white rounded">Đổi</button>
        </div>
        {/* banner1 */}
        <div className="flex-1 shadow-md rounded">
          <div className="flex-1 relative w-full bg-gray-300">
            <img
              src=""
              alt=""
              className="w-full object-contain object-center"
            />
            <button className="absolute top-0 right-0 p-2 hover:bg-white/50 rounded-full ">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-3 h-3"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"
                />
              </svg>
            </button>
          </div>
          <img src="" alt="" className="w-full h-32" />
          <div className="flex justify-between items-center">
            <span className="px-2">ID bài viết</span>
            <div className="p-2">
              <button className="px-3">sửa link</button>
              <button className="px-3">xóa banner</button>
            </div>
          </div>
        </div>
        <div className="flex-1 py-16 text-center">
          <button
            title="Thêm ảnh banner"
            className="p-3 border border-primary hover:bg-primary duration-300 hover:text-white text-primary rounded-full"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 4.5v15m7.5-7.5h-15"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default PageSetting;
