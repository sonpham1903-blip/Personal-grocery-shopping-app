import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import ktsRequest from "../../ultis/ktsrequest";
import { vnd } from "../../ultis/ktsFunc";
import { toast } from "react-toastify";

const ItemCard = (props) => {
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [liked, setLiked] = useState(
    props.data?.likedBy.includes(currentUser?._id)
  );
  const discount = Math.round(
    ((props.data?.stockPrice - props.data?.currentPrice) * 100) /
      props.data?.stockPrice
  );
  let { likedBy } = props?.data;

  const handleLike = async () => {
    // if (!currentUser) {
    //   return toast.warn("Vui lòng đăng nhập", {
    //     onClose: () => navigate("/login"),
    //   });
    // }
    if (!currentUser) {
      return toast.warn(
        <div className="">
          <h3 className="py-3">Vui lòng đăng nhập!</h3>
          <div className="space-x-3">
            <Link
              className="px-2 py-1.5 rounded text-white bg-green-500 hover:bg-green-700"
              to="/register"
            >
              Đăng ký
            </Link>
            <Link
              className="hover:bg-green-500 hover:text-white px-2 py-1.5 rounded"
              to="/login"
            >
              Đăng nhập
            </Link>
          </div>
        </div>
      );
    }
    const { token } = currentUser;
    if (liked && likedBy.includes(currentUser?._id)) {
      likedBy = likedBy.filter((u) => u !== currentUser?._id);
      setLiked(false);
    } else {
      likedBy.push(currentUser?._id);
      setLiked(true);
    }
    try {
      const res = await ktsRequest.put(
        `/users/${liked ? "dislike" : "like"}/${props.data._id}`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
    } catch (error) {
      error.response
        ? toast.error(error.response.data.message)
        : toast.error("Network Error!");
    }
  };
  return (
    <div className="bg-white rounded-lg relative flex flex-col justify-betwee shadow-lg w-full mx-atuto">
      {discount > 0 && (
        <div className="z-10 w-10 h-10 md:w-12 md:h-12 border-double border-4 border-white bg-red-600 absolute top-3 right-3 rounded-tl-3xl rounded-tr-3xl rounded-bl rounded-br-3xl flex items-center text-center md:pl-1.5 pl-0.5 text-white">
          <p className="font-semibold">{`${discount}%`}</p>
        </div>
      )}
      <Link to={`/products/${props.data?._id}`}>
        <div className="overflow-hidden rounded-t-lg w-full md:h-52 h-40">
          <img
            className="transition duration-500 hover:scale-125 object-cover object-center w-full h-full"
            src={
              props.data?.imgs[0] ||
              "https://via.placeholder.com/300.png/09f/fff"
            }
            alt=""
          />
        </div>
        <div className="py-2 px-3">
          <h5 className="mb-1 tracking-tight truncate">
            {props.data?.productName}
          </h5>
          <div className="flex justify-between">
            <p className="mb-1 text-primary font-semibold line-clamp-2">
              {props?.data.stockPrice > 0
                ? vnd(props.data?.currentPrice)
                : "Liên hệ"}
            </p>
            <p
              className={`mb-1  ${
                discount > 0 ? "text-red-600 line-through text-sm" : "hidden"
              }  font-semibold `}
            >
              {vnd(props.data?.stockPrice)}
            </p>
          </div>
        </div>
      </Link>
      <div className="flex justify-end pb-3 pr-3">
        <button
          onClick={handleLike}
          className="hover:scale-110 duration-300 active:scale-95"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill={liked ? "red" : "none"}
            viewBox="0 0 24 24"
            strokeWidth={1}
            stroke={liked ? "red" : "currentColor"}
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default ItemCard;
