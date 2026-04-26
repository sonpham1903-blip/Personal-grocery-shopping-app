import React from "react";
import logo_v3 from "../assets/imgs/logo_v4.png";
import tinnhiemmang from "../assets/imgs/tinnhiemmang.webp";
import bocongthuong from "../assets/imgs/bocongthuong.webp";
import DCMA from "../assets/imgs/DMCA.jpg";
import { Link } from "react-router-dom";
import p1 from "../assets/imgs/p1.webp";
import p2 from "../assets/imgs/p2.webp";
import p3 from "../assets/imgs/p3.webp";
import p4 from "../assets/imgs/p4.webp";
const MyCart = ({
  children: cart,
  show = true,
  img = "",
  text1 = "",
  text2 = "",
  size = "56",
}) => {
  return (
    show && (
      <div
        className={`p-3 border border-primary flex w-full justify-around items-center gap-2 bg-white rounded-lg text-xs md:text-base`}
      >
        <div>
          <img src={img} alt="" />
        </div>
        <div>
          <p className="text-gray-800 uppercase font-semibold">{text1}</p>
          <p className="text-gray-800">{text2}</p>
        </div>
      </div>
    )
  );
};
const Footer = () => {
  return (
    <div className="w-full bg-green-100 pt-4 ">
      <div className="max-w-screen-xl mx-auto grid grid-cols-2 md:grid-cols-4 justify-around pt-3 mb-8 gap-2 px-3 md:px-0">
        <MyCart img={p1} text1="sản phẩm" text2="chất lượng" size="56" />
        <MyCart img={p2} text1="chủng loại" text2="phong phú" size="56" />
        <MyCart img={p3} text1="giá cả" text2="cạnh tranh" size="56" />
        <MyCart img={p4} text1="giao hàng" text2="nhanh chóng" size="56" />
      </div>
      <div className="flex justify-between md:flex-row flex-col mt-2 mx-auto max-w-screen-xl p-3 text-gray-700 gap-8 md:gap-2 md:h-72">
        <div className="flex gap-4">
          <div className="flex flex-col lg:flex-row">
            <ul className="flex flex-col gap-2 w-full">
              <h3 className="uppercase font-semibold text-xl">Về chúng tôi</h3>
              <li className="flex gap-2 items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-8 h-8"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"
                  />
                </svg>

                <span>
                  Địa chỉ: Số 121 đường Trưng Trắc, Phường Phúc Yên, Tỉnh Phú
                  Thọ, Việt Nam
                </span>
              </li>
              <li className="flex gap-2 items-center">
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
                    d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
                  />
                </svg>
                <span>Email: ktsmall.cskh@gmail.com</span>
              </li>
              <li className="flex gap-2">
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
                    d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z"
                  />
                </svg>

                <span>Điện thoại: 0973.636.350</span>
              </li>
            </ul>
          </div>
        </div>
        <div className="hidden md:flex md:w-1/2 w-full justify-between flex-col gap-5 md:flex-row">
          <div className="md:w-1/2 w-full px-3 gap-2 flex flex-col">
            <h3 className="uppercase font-semibold text-xl">Chính sách</h3>
            <ul className="flex flex-col gap-1">
              <li>
                <Link to="/news/640ffb8df73dc135c1d7d1e5">
                  Hướng dẫn đăng ký
                </Link>
              </li>
              <li>
                <Link to="/news/640ff760f73dc135c1d7d1d6">
                  {" "}
                  Bảo mật thông tin cá nhân
                </Link>
              </li>
              <li>
                <Link href="#">Quy chế hoạt động</Link>
              </li>
              <li>
                <Link to="/news/640ff9e3f73dc135c1d7d1df">
                  {" "}
                  Quy trình giải quyết khiếu nại
                </Link>
              </li>
            </ul>
          </div>
          <div className="md:w-1/2 w-full px-3 gap-2 flex flex-col">
            <h3 className="uppercase font-semibold text-xl">
              Hỗ trợ khách hàng
            </h3>
            <ul className="flex flex-col gap-1">
              <li>Các câu hỏi thường gặp</li>
              <li>
                <a href="/news/640ffc63f73dc135c1d7d1ed"> Hướng dẫn đặt hàng</a>
              </li>
              <li>Phương thức vận chuyển</li>
              {/* <li className="flex justify-center">
                <img
                  src={bocongthuong}
                  alt=""
                  className="md:w-full w-1/2 md:h-1/2 object-contain"
                />
                <img
                  src={tinnhiemmang}
                  alt=""
                  className="md:w-full w-1/2 md:h-1/2 object-contain"
                />
              </li> */}
              <li>
                <a href="https://www.dmca.com/r/331pzk9" className="block">
                  {/* <img src={DCMA} alt="" className="-mt-8" /> */}
                  <img src={DCMA} alt="" className="" />
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className=" bg-green-600 mx-auto py-3 text-white text-center flex items-center justify-center">
        <a href="https://sale168.vn">
          <img width={100} height={100} src={logo_v3} alt="" />
        </a>
      </div>
    </div>
  );
};

export default Footer;
