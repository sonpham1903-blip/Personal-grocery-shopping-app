import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/imgs/logo_v4.png";
import empty from "../assets/imgs/no-cart.png";
import { useDispatch, useSelector } from "react-redux";
import { vnd } from "../../ultis/ktsFunc";
import { setCart, removeItemLocal } from "../redux/cartReducer";
import Sidebar from "./Sidebar";
import { logout } from "../redux/userSlice";
import { setMsg } from "../redux/msgSlice";
import ktsRequest from "../../ultis/ktsrequest";
import Chat from "./Chat";
const Cart = (props) => {
  const show = window.location.pathname === "/cart" ? false : true;
  let subtotal1 = 0;
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.user);
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
                    onClick={() => {
                      if (!currentUser) {
                        dispatch(setCart([]));
                        return;
                      }
                      (async () => {
                        try {
                          await ktsRequest.post(
                            "/carts/clear",
                            {},
                            {
                              headers: {
                                Authorization: `Bearer ${currentUser.token}`,
                              },
                            },
                          );
                          dispatch(setCart([]));
                        } catch (err) {
                          // ignore
                        }
                      })();
                    }}
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
                          onClick={() => {
                            if (!currentUser) {
                              dispatch(removeItemLocal(i.id));
                              return;
                            }
                            (async () => {
                              try {
                                await ktsRequest.delete("/carts/remove", {
                                  headers: {
                                    Authorization: `Bearer ${currentUser.token}`,
                                  },
                                  data: { productId: i.id },
                                });
                                dispatch(removeItemLocal(i.id));
                              } catch (err) {
                                // ignore
                              }
                            })();
                          }}
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
  const { currentUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Chat states
  const [openChatDropdown, setOpenChatDropdown] = useState(false);
  const [chats, setChats] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [loadingChats, setLoadingChats] = useState(false);

  // Fetch chats for current user
  const fetchChats = async () => {
    if (!currentUser) return;
    setLoadingChats(true);
    try {
      const res = await ktsRequest.get(`/chat/user/${currentUser._id}`);
      setChats(res.data);
    } catch (error) {
      console.error("Error fetching chats:", error);
    } finally {
      setLoadingChats(false);
    }
  };

  useEffect(() => {
    if (openChatDropdown && currentUser) {
      fetchChats();
    }
  }, [openChatDropdown, currentUser]);
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
  const textAvatar = (text = "dichoho") => {
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
  const handleSearch = (event) => {
    event.preventDefault();
    const keyword = query.trim();
    navigate(
      keyword ? `/products?q=${encodeURIComponent(keyword)}` : "/products",
    );
  };
  return (
    <div className="w-full">
      <div className="max-w-screen-xl mx-auto sticky top-0 z-40 text-center flex items-center justify-between py-3 gap-2 px-3 md:px-0 bg-primary">
        {toggle && <Sidebar open={toggle} close={setToggle} />}
        {activeChat && (
          <Chat me={currentUser} shop={activeChat} onClose={setActiveChat} />
        )}
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

        <div className="w-3/5 ">
          <form
            className="flex md:flex-1 w-full justify-start md:justify-center relative mx-auto"
            onSubmit={handleSearch}
          >
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
          </form>
        </div>

        <div className="flex items-center gap-4">
          {/* Chat Button */}
          {currentUser && (
            <div className="relative">
              <button
                className="flex items-center cursor-pointer bg-none md:bg-blue-600 rounded px-4 py-2 md:text-white font-semibold gap-2 text-blue-600 md:hover:bg-blue-700 hover:text-blue-700"
                onClick={() => setOpenChatDropdown(!openChatDropdown)}
                title="Tin nhắn"
              >
                <p className="hidden lg:block text-xs uppercase">tin nhắn</p>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6 md:w-5 md:h-5 md:text-white"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M20.25 8.511c.884.318 1.672 1.002 2.05 1.85a3 3 0 11-5.307-1.852Zm-7.5 0c.884.318 1.672 1.002 2.05 1.85a3 3 0 11-5.306-1.852m7.5 0c-.884.318-1.672 1.002-2.05 1.85m0-7.5h-7.5m7.5 7.5H2.25m11.25 0a3 3 0 11-6 0 3 3 0 016 0Z"
                  />
                </svg>
              </button>
              {openChatDropdown && (
                <div
                  className="absolute top-12 right-0 z-50 rounded border border-gray-200 bg-white shadow-lg flex flex-col w-72 max-h-96 overflow-hidden"
                  onClick={(event) => event.stopPropagation()}
                >
                  {loadingChats ? (
                    <div className="p-4 text-center text-gray-500">
                      Đang tải...
                    </div>
                  ) : chats.length > 0 ? (
                    <div className="overflow-y-auto divide-y divide-gray-200">
                      {chats.map((chat) => (
                        <button
                          key={chat._id}
                          className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center gap-3 transition-colors"
                          onClick={() => {
                            setActiveChat(chat.partner._id);
                            setOpenChatDropdown(false);
                          }}
                        >
                          <img
                            src={
                              chat.partner.img ||
                              "https://via.placeholder.com/40"
                            }
                            alt={chat.partner.displayName}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-sm text-gray-800">
                              {chat.partner.displayName ||
                                chat.partner.username}
                            </p>
                            <p className="text-xs text-gray-500 truncate">
                              {chat.lastMessage || "Không có tin nhắn"}
                            </p>
                          </div>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="p-4 text-center text-gray-500">
                      Không có cuộc hội thoại
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
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
                <div className="absolute top-12 right-0 z-50 rounded border border-gray-200 bg-white shadow-lg flex flex-col w-48 divide-y divide-gray-100 overflow-hidden">
                  <button
                    className="px-4 py-3 text-left text-sm text-gray-700 hover:bg-primary hover:text-white flex items-center gap-2 transition-colors"
                    onClick={(e) => {
                      e.preventDefault();
                      setOpenMenu(false);
                      navigate("/profile");
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-4 h-4"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                      />
                    </svg>
                    Trang cá nhân
                  </button>
                  <a
                    href="http://localhost:8990/login"
                    className="px-4 py-3 text-left text-sm text-gray-700 hover:bg-primary hover:text-white flex items-center gap-2 transition-colors"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-4 h-4"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M13.5 21v-7.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21m-4.5 0H2.36m11.14 0H22.25m-12.917-2.107L10.125 16.5a.75.75 0 01.75-.75h1.125a.75.75 0 01.75.75l.125 2.393a2.25 2.25 0 01-1.077 2.107H9.208a2.25 2.25 0 01-1.077-2.107z"
                      />
                    </svg>
                    Bạn là người bán
                  </a>
                  <button
                    className="px-4 py-3 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 font-medium transition-colors"
                    onClick={(e) => {
                      e.preventDefault();
                      setOpenMenu(false);
                      dispatch(setMsg(`bye! ${currentUser.displayName}`));
                      dispatch(logout());
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-4 h-4"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75"
                      />
                    </svg>
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
    </div>
  );
};

export default Header;
