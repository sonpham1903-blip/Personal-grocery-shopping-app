import React, { useEffect, useState } from "react";
import ItemCard from "./ItemCard";
import icon_hotsale from "../assets/imgs/icon_hotsale.webp";
import { toast } from "react-toastify";
import ktsRequest from "../../ultis/ktsrequest";
const HotProducts = (props) => {
  const slideLeft = () => {
    var slider = document.getElementById("wrraper");
    slider.scrollLeft = slider.scrollLeft - slider.offsetWidth;
  };

  const slideRight = () => {
    var slider = document.getElementById("wrraper");
    slider.scrollLeft = slider.scrollLeft + slider.offsetWidth;
  };
  const [data, setData] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await ktsRequest.get("/products/hotest/10");
        setData(res.data);
      } catch (err) {
        err.response
          ? toast.error(err.response.data.message)
          : toast.error("Network Error!");
      }
    };
    fetchData();
  }, []);
  return (
    <div className="w-ful bottom-0 mt-1 py-2">
      <div className="max-w-screen-xl mx-auto border-4 border-green-500 rounded-md overflow-hidden">
        <div className="flex justify-between bg-white p-3">
          <div className="flex justify-start items-center gap-3">
            <img src={icon_hotsale} alt="" className="mb-3" />
            <h3 className="uppercase font-bold text-green-600">
              {props.title ? props.title : " sản phẩm "}
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              className="bg-green-600 p-2 rounded text-white hover:bg-white hover:text-green-600 border border-white hover:border-green-600  active:scale-105 transition-transform"
              onClick={slideLeft}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-4 h-4 font-bold hover:duration-300 hover:scale-150"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 19.5L8.25 12l7.5-7.5"
                />
              </svg>
            </button>
            <button
              className="bg-green-600 p-2 rounded text-white hover:bg-white hover:text-green-600 border border-white hover:border-green-600 active:scale-105 transition-transform"
              onClick={slideRight}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-4 h-4 font-bold hover:duration-300 hover:scale-150"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8.25 4.5l7.5 7.5-7.5 7.5"
                />
              </svg>
            </button>
          </div>
        </div>
        <ul
          className="flex flex-nowrap overflow-hidden scroll whitespace-nowrap scroll-smooth scrollbar-hide py-2"
          id="wrraper"
        >
          {data.map((p, i) => {
            return (
              <li
                className="md:w-1/3 w-1/2 lg:w-1/5 flex-grow-0 flex-shrink-0 px-1"
                key={i}
              >
                <ItemCard data={p} />
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default HotProducts;
