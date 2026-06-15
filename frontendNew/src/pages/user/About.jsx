import React from "react";
import { Link } from "react-router-dom";
import { Footer, Header, Navbar, Promotion } from "../../components";

const About = () => {
  return (
    <div>
      <Promotion />
      <Header />
      <Navbar />

      <main className="bg-gray-50 py-8">
        <section className="max-w-screen-xl mx-auto bg-gradient-to-r from-green-100 to-white rounded-lg p-8 shadow-md flex flex-col md:flex-row items-center gap-6">
          <div className="md:w-2/3">
            <h1 className="text-4xl font-extrabold text-green-700 mb-3">
              Chào mừng đến với cửa hàng OCOP của chúng tôi
            </h1>
            <p className="text-lg text-gray-700 mb-4">
              Chúng tôi chuyên cung cấp các sản phẩm nông sản sạch, OCOP và các
              mặt hàng an toàn, tươi ngon và có nguồn gốc rõ ràng cho bữa cơm
              gia đình .
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                to="/products"
                className="bg-green-600 text-white px-4 py-2 rounded-lg font-semibold"
              >
                Xem sản phẩm
              </Link>
            </div>
          </div>
          <div className="md:w-1/3">
            <img
              src="/camoiloangchoi_files/animate.css"
              alt="OCOP"
              className="w-full rounded-md object-cover"
              onError={(e) => {
                e.target.style.display = "none";
              }}
            />
          </div>
        </section>

        <section className="max-w-screen-xl mx-auto px-4 mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-5 rounded-lg shadow-sm">
            <h3 className="font-semibold text-lg mb-2">Sản phẩm OCOP</h3>
            <p className="text-gray-600 text-sm">
              Đặc sản địa phương có chứng nhận, giữ hương vị vùng miền và hỗ trợ
              cộng đồng.
            </p>
          </div>
          <div className="bg-white p-5 rounded-lg shadow-sm">
            <h3 className="font-semibold text-lg mb-2">Giao hàng an toàn</h3>
            <p className="text-gray-600 text-sm">
              Đóng gói chuyên nghiệp, giao nhanh trong khu vực.
            </p>
          </div>
          <div className="bg-white p-5 rounded-lg shadow-sm">
            <h3 className="font-semibold text-lg mb-2">Hỗ trợ khách hàng</h3>
            <p className="text-gray-600 text-sm">
              Tư vấn chọn hàng và chuẩn bị bữa ăn theo yêu cầu.
            </p>
          </div>
        </section>

        <section className="max-w-screen-xl mx-auto px-4 mt-10 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-4">
            Hướng dẫn sử dụng chức năng "ĐI CHỢ HỘ"
          </h2>
          <p className="text-gray-700 mb-4">
            Chức năng "ĐI CHỢ HỘ" giúp bạn lên thực đơn và chuẩn bị nguyên liệu
            phù hợp dựa trên số người, ngân sách và sở thích. Thao tác rất đơn
            giản:
          </p>

          <ul className="list-none space-y-3 text-gray-700">
            <li>
              <strong>Bước 1:</strong> Mở chức năng bằng cách nhấn nút "ĐI CHỢ
              HỘ".
            </li>
            <li>
              <strong>Bước 2:</strong> Cung cấp 3 thông tin cơ bản khi được hỏi:{" "}
              <em>số người ăn</em>, <em>ngân sách (VNĐ)</em> và{" "}
              <em>sở thích/món ăn</em>.
            </li>
            <li>
              <strong>Bước 3:</strong> Chờ trợ lý đề xuất thực đơn và danh sách
              nguyên liệu chính. Bạn có thể chỉnh sửa hoặc yêu cầu thay thế.
            </li>
            <li>
              <strong>Bước 4:</strong> Chỉnh sửa các sản phẩm gợi ý để thêm vào
              giỏ hàng và tiến hành thanh toán hoặc yêu cầu giao hàng.
            </li>
          </ul>

          <div className="mt-6">
            <Link
              to="/shopassistance"
              className="bg-green-600 text-white px-4 py-2 rounded-lg font-semibold"
            >
              ĐI CHỢ HỘ
            </Link>
          </div>
        </section>

        <section className="max-w-screen-xl mx-auto px-4 mt-8 bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-2xl font-semibold mb-3">Tầm nhìn và Cam kết</h2>
          <p className="text-gray-700">
            Chúng tôi cam kết mang tới sản phẩm tươi sạch, hỗ trợ nhà sản xuất
            địa phương và minh bạch trong nguồn gốc hàng hóa. Mọi phản hồi của
            bạn đều giúp cửa hàng ngày càng tốt hơn.
          </p>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default About;
