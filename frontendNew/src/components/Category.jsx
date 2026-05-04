import React from "react";
import { ktsConfig } from "../../ultis/config";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { useSwiper } from "swiper/react";

const fallbackIconPath =
  "M320 128a96 96 0 11-192 0 96 96 0 01192 0zM128 256h192c53.02 0 96 42.98 96 96v16a48 48 0 01-48 48H80a48 48 0 01-48-48v-16c0-53.02 42.98-96 96-96z";

const SwiperButton = ({ next = true, children }) => {
  const swiper = useSwiper();
  return (
    <button
      className={`h-full absolute ${
        next ? "right-0" : "left-0"
      } top-0 bottom-0 w-8 md:w-10 z-10 flex items-center justify-center text-white bg-green-500/30 hover:bg-green-500`}
      onClick={() => (next ? swiper.slideNext() : swiper.slidePrev())}
    >
      {children}
    </button>
  );
};
const Category = () => {
  return (
    <Swiper
      spaceBetween={0}
      slidesPerView={6}
      className="max-w-screen-2xl mx-auto text-center mt-3 bg-green-200 w-full overflow-hidden flex text-xs md:text-base gap-2 justify-around relative px-10 md:px-12 py-1"
    >
      {ktsConfig.categories.map((i, index) => {
        return (
          <SwiperSlide className="" key={index}>
            <Link
              className="p-3 md:p-4 font-semibold hover:bg-green-500 flex gap-2 items-center flex-col w-full"
              to={`/products?q=${encodeURIComponent(i.name)}`}
              key={index}
            >
              
              <svg
                xmlns="http://www.w3.org/2000/svg"
                version="1.1"
                viewBox={i.viewBox || "0 0 24 24"}
                className="w-6 h-6 md:w-7 md:h-7"
              >
                <path fill="#000000" d={i.path || fallbackIconPath}></path>

              </svg>
              <p className="hidden md:block">{i.name}</p>
            </Link>
          </SwiperSlide>
        );
      })}
      <SwiperButton>
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
            d="M8.25 4.5l7.5 7.5-7.5 7.5"
          />
        </svg>
      </SwiperButton>
      <SwiperButton next={false}>
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
            d="M15.75 19.5L8.25 12l7.5-7.5"
          />
        </svg>
      </SwiperButton>
    </Swiper>
  );
};

export default Category;
