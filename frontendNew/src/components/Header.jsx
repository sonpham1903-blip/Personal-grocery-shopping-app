import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/imgs/logo_v4.png";
import empty from "../assets/imgs/no-cart.png";
import { useDispatch, useSelector } from "react-redux";
import { vnd } from "../../ultis/ktsFunc";
import { removeItem, resetCart } from "../redux/cartReducer";
import Sidebar from "./Sidebar";
import { logout } from "../redux/userSlice";
import { setMsg } from "../redux/msgSlice";
import { useEffect } from "react";
import ktsRequest from "../../ultis/ktsrequest";
const Cart = (props) => {
  const show = window.location.pathname === "/cart" ? false : true;
  let subtotal1 = 0;
  const dispatch = useDispatch();
  return (
    show && (
      <div
        className="text-gray-800 bg-white rounded shadow absolute top-8 right-0 z-50 p-3 flex flex-col w-96 gap-2 "
        onClick={(event) => event.stopPropagation()}
      >
        {props.data.length > 0 ? (
          <div>
            <div>
              <div className="divide-y divide-dashed divide-primary">
                <div className="pb-3 flex justify-end items-center">
                  <button
                    className="block border border-primary px-3 py-1 rounded hover:bg-primary hover:text-white"
                    onClick={() => dispatch(resetCart())}
                  >
                    xóa giỏ hàng
                  </button>
                </div>
                {props.data.map((i, k) => {
                  subtotal1 += i.currentPrice * i.quantity;
                  return (
                    <div
                      className="py-1 flex gap-2 justify-between items-center"
                      key={k}
                    >
                      <img src={i.img} alt="" className="w-16" />
                      <div className="flex flex-col justify-center items-start flex-1">
                        <p className="font-semibold text-left">
                          {i.productName}
                        </p>
                        <p className="text-green-600">
                          {vnd(i.currentPrice) + " * " + i.quantity}
                        </p>
                      </div>
                      <div className="text-center w-1/5">
                        <button
                          className="bg-white p-2 rounded-full hover:bg-primary hover:text-white"
                          onClick={() => dispatch(removeItem(i.id))}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={3}
                            stroke="currentColor"
                            className="w-3 h-3"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="flex justify-between pr-6">
              <span>tổng tiền</span>
              <span className="font-bold">{vnd(subtotal1)}</span>
            </div>
            <div className="flex flex-col gap-2">
              <Link
                to="/cart"
                className="p-2 bg-primary rounded uppercase font-semibold text-white hover:bg-green-700"
              >
                Xem giỏ hàng
              </Link>
            </div>
          </div>
        ) : (
          <div className="">
            <img
              src={empty}
              alt=""
              className="w-full h-full object-cover object-center"
            />
          </div>
        )}
      </div>
    )
  );
};
const Header = () => {
  const [openCart, setOpenCart] = useState(false);
  const { products } = useSelector((state) => state.cart);
  const [toggle, setToggle] = useState(false);
  const [openMenu, setOpenMenu] = useState(false);
  const [query, setQuery] = useState("");
  const [data, setData] = useState([]);
  const { currentUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const hoverOn = () => {
    setOpenCart(true);
  };
  const hoverOut = () => {
    setOpenCart(false);
  };
  const totalItems = (cart) => {
    let total = 0;
    cart.map((item) => {
      total += item.quantity;
    });
    return total;
  };
  const textAvatar = (text = "dichoho.top") => {
    let name = text.split(" ");
    if (name.length === 1) {
      return name[0].charAt().toUpperCase();
    } else {
      return (
        name[0].charAt(0).toUpperCase() +
        name[name.length - 1].charAt(0).toUpperCase()
      );
    }
  };
  useEffect(() => {
    const fetchData = async () => {
      setData([]);
      const res = await ktsRequest.post(`/products/search?q=${query}`);
      setData(res.data);
    };
    if (query.length > 2) fetchData();
  }, [query]);
  return (
    <div className="max-w-screen-xl mx-auto text-center flex items-center justify-between py-3 gap-2 px-3 md:px-0">
      {toggle && <Sidebar open={toggle} close={setToggle} />}
      <Link to="/" className="hidden md:block">
        <img src={logo} alt="" className="w-56 h-auto" />
      </Link>
      <button
        className="border border-primary p-2 rounded-md md:hidden"
        onClick={() => setToggle(true)}
      >
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
            d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
          />
        </svg>
      </button>

      <div className="w-1/2 ">
        <div className="flex md:flex-1 w-3/4 justify-start md:justify-center relative mx-auto">
          <input
            type="text"
            placeholder="Tìm kiếm ..."
            className="p-2 border border-gray-300 rounded-md focus:outline-none w-full"
            onChange={(e) => setQuery(e.target.value)}
            value={query}
          />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6 absolute right-3 top-2 text-gray-500"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
            />
          </svg>
          {query.length > 0 && data && (
            <div
              className={`absolute top-12 z-10 bg-gray-100 w-full text-start ${
                data?.length > 0 ? "border" : ""
              } border-primary rounded z-20 `}
            >
              <div className="text-end px-1.5 py-3 bg-primary">
                <Link to="/products" className="italic hover:text-white">
                  Xem tất cả
                </Link>
              </div>
              <div className="max-w-60 overflow-y-auto divide-y divide-dashed divide-primary">
                {data.map((p, i) => {
                  return (
                    <Link
                      to={`/products/${p._id}`}
                      key={i}
                      className="flex p-1.5 items-center hover:bg-green-100"
                      onClick={() => {
                        setData([]);
                        setQuery("");
                      }}
                    >
                      <img
                        src={p.imgs[0]}
                        alt=""
                        className="w-12 h-12 object-cover object-center rounded-full"
                      />
                      <span className="pl-1 normal-case">{p.productName}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="md:flex justify-center items-center gap-2 hidden">
          <div className="bg-green-600 p-3 mx-auto text-white rounded-full">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z"
              />
            </svg>
          </div>
          <div className="">
            <p className="text-md hidden lg:block">Hỗ trợ khách hàng</p>
            <p className="text-primary font-extrabold">XXXXXXXXXX</p>
          </div>
        </div>
        <div
          className="flex items-center cursor-pointer relative bg-none md:bg-green-600 rounded px-4 py-2 md:text-white font-semibold gap-2  md:hover:bg-green-700 hover:text-primary text-primary"
          onMouseOver={hoverOn}
          onMouseOut={hoverOut}
          onClick={() => navigate("/cart")}
        >
          <p className="hidden lg:block text-xs uppercase">giỏ hàng</p>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-10 h-10 md:w-5 md:h-5 md:text-white"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"
            />
          </svg>
          {products.length > 0 && (
            <div className="bg-red-500 w-3 h-3 p-3 rounded-full -right-2 absolute flex justify-center items-center -top-2 text-white">
              {totalItems(products)}
            </div>
          )}
          {openCart && <Cart data={products} />}
        </div>
        {currentUser ? (
          <div className="relative" title="Tài khoản">
            <div
              className="flex h-10 w-10 cursor-pointer border border-primary items-center justify-center overflow-hidden rounded-full bg-orange-500 font-bold text-white"
              onClick={() => {
                setOpenMenu(!openMenu);
              }}
            >
              {currentUser?.img ? (
                <img src={currentUser.img} alt="" />
              ) : (
                textAvatar(currentUser.username)
              )}
            </div>
            {openMenu && (
              <div className="absolute top-12 right-0 z-10 rounded border border-primary bg-white flex flex-col w-48 divide-y divide-dashed divide-primary">
                <button
                  className="hover:bg-primary p-2"
                  onClick={(e) => {
                    e.preventDefault();
                    setOpenMenu(!openMenu);
                    navigate("/dashboard/home");
                  }}
                >
                  Trang cá nhân
                </button>
                <a
                  href="http://quantri.sale168.vn"
                  className="hover:bg-primary p-2"
                >
                  Bạn là người bán
                </a>
                <button
                  className="hover:bg-primary p-2"
                  onClick={(e) => {
                    e.preventDefault();
                    setOpenMenu(!openMenu);
                    dispatch(setMsg(`bye! ${currentUser.displayName}`));
                    dispatch(logout());
                  }}
                >
                  Đăng xuất
                </button>
              </div>
            )}
          </div>
        ) : (
          <Link
            to="/login"
            title="Đăng nhập"
            className="flex items-center rounded-full text-white hover:text-orange-600 bg-primary p-2 hover:bg-white hover:border-primary border border:white"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6 hover:duration-300 hover:scale-125"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
              />
            </svg>
          </Link>
        )}
      </div>
    </div>
  );
};

export default Header;
