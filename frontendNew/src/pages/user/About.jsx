import React from "react";
import { Link } from "react-router-dom";
import { Footer, Header, Navbar, Promotion } from "../../components";

const About = () => {
  return (
    <div>
      <Promotion />
      <Header />
      <Navbar />

      <div className="max-w-screen-xl mx-auto p-6 bg-white mt-6">
        <h1 className="text-3xl font-bold mb-4">Giới Thiệu</h1>

        <p className="mb-4 text-lg">
          Chào mừng bạn đến với cửa hàng trực tuyến của chúng tôi — nơi chuyên bán
          các sản phẩm dành cho đi chợ hàng ngày, tập trung vào các sản phẩm OCOP
          chất lượng cao từ các làng nghề và hợp tác xã địa phương.
        </p>

        <h2 className="text-2xl font-semibold mb-3">Tôn chỉ hoạt động</h2>
        <ul className="list-disc pl-6 mb-4">
          <li>Hỗ trợ sản phẩm sạch, an toàn cho gia đình bạn.</li>
          <li>
            Ưu tiên sản phẩm OCOP — đặc sản địa phương có nguồn gốc, chứng nhận
            và giá trị văn hoá vùng miền.
          </li>
          <li>Giao hàng nhanh, đóng gói an toàn và dịch vụ khách hàng thân thiện.</li>
        </ul>

        <h2 className="text-2xl font-semibold mb-3">Sản phẩm OCOP — Vì sao nên chọn</h2>
        <p className="mb-4">
          OCOP (One Commune One Product) là chương trình thúc đẩy sản xuất đặc
          sản địa phương với tiêu chí chất lượng và giá trị cộng đồng. Sản phẩm
          OCOP thường được chế biến hoặc sản xuất thủ công, giữ bản sắc vùng
          miền và có lợi ích kinh tế cho các hộ gia đình địa phương.
        </p>

        <h2 className="text-2xl font-semibold mb-3">Lợi ích khi mua tại chúng tôi</h2>
        <ul className="list-disc pl-6 mb-4">
          <li>Đa dạng mặt hàng đi chợ: rau củ, thực phẩm, đồ uống, dược liệu.</li>
          <li>Ưu đãi dành cho khách hàng thường xuyên và đơn hàng lớn.</li>
          <li>Hỗ trợ tìm nguồn hàng OCOP theo yêu cầu.</li>
        </ul>

        <div className="mt-6">
          <Link
            to="/products"
            className="inline-block bg-green-600 text-white px-4 py-2 rounded-lg font-semibold"
          >
            Xem sản phẩm ngay
          </Link>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default About;
