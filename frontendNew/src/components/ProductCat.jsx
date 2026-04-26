import React, { useEffect, useState } from "react";
import ItemCard from "./ItemCard";
// import icon_ns from "../assets/imgs/icon_ns.webp";
import icon_ns from "../assets/imgs/icon_ns.webp";
import ktsRequest from "../../ultis/ktsrequest";
import { Link } from "react-router-dom";
const ProductCat = (props) => {
  const [data, setData] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await ktsRequest.get(`/products?q=${props.catTitle}&l=8`);
        setData(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []);
  return (
    <div className="w-full bottom-0 mt-1 py-2">
      <div className="max-w-screen-xl mx-auto">
        <div className="flex justify-between bg-green-200">
          <div className="flex justify-start items-center gap-3">
            <img src={icon_ns} alt="" />
            <h3 className="uppercase font-bold ">
              {props.catTitle ? props.catTitle : "tiêu đề"}
            </h3>
          </div>
          <Link
            to={`/products?q=${props.catTitle}`}
            className="flex items-center pr-4 hover:text-primary"
          >
            Xem tất cả
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-4 h-4 ml-2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
              />
            </svg>
          </Link>
        </div>
        <div className="gap-2 mx-auto grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 justify-center grid-rows-2 py-2 w-full">
          <div className="w-full md:col-span-2 rounded-tl-xl rounded-tr-[6rem] rounded-br-xl rounded-bl-[6rem] overflow-hidden hidden md:block">
            <img
              src={props.picCover}
              alt=""
              className="w-full h-full object-contain"
            />
          </div>
          {data.map((p, i) => {
            return <ItemCard data={p} key={i} />;
          })}
        </div>
      </div>
    </div>
  );
};

export default ProductCat;
