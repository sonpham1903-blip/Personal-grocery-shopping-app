import React from "react";
import { ktsConfig } from "../../ultis/config";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { useSwiper } from "swiper/react";

const SwiperButton = ({ next = true, children }) => {
  const swiper = useSwiper();
  return (
    <button
      className={`h-full absolute ${
        next ? "right-0" : "left-0"
      } z-10 text-white bg-green-500/30 hover:bg-green-500`}
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
      className="max-w-screen-xl mx-auto text-center mt-3  bg-green-200 w-full overflow-hidden flex text-xs md:text-base gap-2 justify-around relative"
    >
      {ktsConfig.categories.map((i, index) => {
        return (
          <SwiperSlide className="" key={index}>
            <Link
              className="p-3 font-semibold hover:bg-green-500 flex gap-2 items-center flex-col w-full"
              to={`/products?q=${i.title.toString().toLowerCase()}`}
              key={index}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                version="1.1"
                viewBox="0 0 512 512"
                className="w-8 h-8"
              >
                <path d={i.path}></path>
              </svg>
              <p className="hidden md:block">{i.title}</p>
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
