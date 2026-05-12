import React, { useEffect } from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
  useEffect(() => {
    document.title = "Nội dung không tồn tại";
  }, []);

  return (
    <div className="bg-not-found bg-cover bg-fixed bg-center bg-no-repeat h-screen flex justify-center items-center">
      <div className="w-full md:w-1/2">
        <div className="text-center">
          <span className="block w-full text-primary text-[8rem] font-bold">
            404
          </span>
          <span className="text-gray-800 font-semibold">
            Chúng tôi không tìm thấy nội dung bạn yêu cầu!
          </span>
        </div>
        <div className="grid grid-cols-2 gap-3 mt-4 font-semibold p-3">
          <button className="p-3 rounded border border-primary text-primary uppercase hover:bg-primary hover:text-white">
            <Link to="/contact">liên hệ chúng tôi</Link>
          </button>
          <button className="p-3 rounded bg-primary text-white uppercase hover:bg-ktshover">
            <Link to="/">trang chủ</Link>
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
