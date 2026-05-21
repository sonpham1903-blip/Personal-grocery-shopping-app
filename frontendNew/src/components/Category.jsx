import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { useSwiper } from "swiper/react";
import ktsRequest from "../../ultis/ktsrequest";

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
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  console.log("Category component render, categories:", categories, "loading:", loading);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        console.log("Bắt đầu fetch categories...");
        const res = await ktsRequest.get("/categories");
        console.log("Response từ API /categories:", res);
        console.log("Data nhận được:", res.data);
        setCategories(res.data);
        setLoading(false);
      } catch (error) {
        console.error("Lỗi khi lấy danh mục:", error);
        console.error("Error details:", error.response?.data || error.message);
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  return (
    <Swiper
      spaceBetween={0}
      slidesPerView={6}
      className="max-w-screen-2xl mx-auto text-center mt-3 bg-green-200 w-full overflow-hidden flex text-xs md:text-base gap-2 justify-around relative px-10 md:px-12 py-1"
    >
      {!loading &&
        categories.map((i, index) => {
          return (
            <SwiperSlide className="" key={index}>
              <Link
                className="p-3 md:p-4 font-semibold hover:bg-green-500 flex gap-2 items-center flex-col w-full"
                to={`/products?q=${encodeURIComponent(i.name)}`}
              >
                <p className="text-sm md:text-base">{i.name}</p>
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
