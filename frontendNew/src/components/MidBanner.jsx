import React from "react";
import bn5 from "../assets/imgs/banner5.webp";
import bn6 from "../assets/imgs/banner6.webp";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/swiper-bundle.css";
import { Link } from "react-router-dom";
const MidBanner = () => {
  return (
    <div className="mt-3">
      <Swiper
        modules={[Autoplay]}
        spaceBetween={0}
        slidesPerView={1}
        autoplay={{ delay: 5000 }}
        className="max-w-screen-xl mx-auto text-center mt-3  bg-green-200 w-full overflow-hidden flex text-xs md:text-base gap-2 justify-around relative"
      >
        <SwiperSlide className="">
          <Link to="/news/65ec18afa3aa6d6523034444">
            <img
              src={bn5}
              alt=""
              className="mx-auto object-cover object-center"
            />
          </Link>
        </SwiperSlide>
        <SwiperSlide className="">
          <Link to="/news/65ec1e1ea3aa6d65230344ae">
            <img
              src={bn6}
              alt=""
              className="mx-auto object-cover object-center"
            />
          </Link>
        </SwiperSlide>
      </Swiper>
    </div>
  );
};

export default MidBanner;
