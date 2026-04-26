import { Link } from "react-router-dom";
import { Footer, Header, Navbar, Promotion } from "../../components";

const NotFound = () => {
  return (
    <div>
      <Promotion />
      <Header />
      <Navbar />
      <div className="max-w-screen-xl mx-auto min-h-[60vh] flex items-center justify-center px-4">
        <div className="text-center space-y-4">
          <p className="text-6xl font-bold text-primary">404</p>
          <h1 className="text-2xl font-semibold text-gray-800">
            Trang bạn đang tìm không tồn tại
          </h1>
          <p className="text-gray-600">
            Đường dẫn này không hợp lệ hoặc sản phẩm đã bị xóa.
          </p>
          <Link
            to="/"
            className="inline-flex items-center rounded bg-primary px-5 py-2.5 font-semibold text-white hover:bg-green-700"
          >
            Về trang chủ
          </Link>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default NotFound;
