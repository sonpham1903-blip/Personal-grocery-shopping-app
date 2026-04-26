import React, { useEffect, useState } from "react";
import {
  Chat,
  Comment,
  Footer,
  Header,
  Navbar,
  Promotion,
} from "../../components";
import { vnd } from "../../../ultis/ktsFunc";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import ktsRequest from "../../../ultis/ktsrequest";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../../redux/cartReducer";
const Product = () => {
  const { products } = useSelector((state) => state.cart);
  const { currentUser } = useSelector((state) => state.user);
  const [weight, setWeight] = useState(1);
  const [activeImg, setActiveImg] = useState(0);
  const [openTab, setOpenTab] = useState(1);
  const [product, setProduct] = useState({});
  const [shopId, setShopId] = useState();
  const [quantity, setQuantity] = useState(1);
  const [hotProducts, setHotProducts] = useState([]);
  const [showChat, setShowChat] = useState(false);
  const [checkPrice, setCheckPrice] = useState(false);
  const [showNotification, setShowNotification] = useState(true);
  const { productId } = useParams();
  const { imgs } = product;
  const relatedDocs = Array.isArray(product?.relatedDocuments)
    ? product.relatedDocuments
    : typeof product?.relatedDocuments === "string"
    ? product.relatedDocuments
        .split(/\n|,/)
        .map((doc) => doc.trim())
        .filter(Boolean)
    : [];
  const dispatch = useDispatch();
  const navigate = useNavigate();
  useEffect(() => {
    // setShowChat(false)
    const fetchData = async () => {
      try {
        const res = await ktsRequest.get(`/products/${productId}`);
        setProduct(res.data);
        setShopId(res.data.shopID);
        setCheckPrice(res.data?.currentPrice - res.data?.stockPrice === 0);
      } catch (err) {
        err.response ? navigate("/notfound") : toast.error("Network Error!");
      }
    };
    fetchData();
  }, [window.location.pathname]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await ktsRequest.get(`/products/hotest/5`);
        setHotProducts(res.data);
      } catch (err) {
        err.response ? navigate("/notfound") : toast.error("Network Error!");
      }
    };
    fetchData();
  }, []);
  const handleClick = (type) => {
    // type-true: mua luôn
    // type-false: thêm vào giỏ hàng
    const data = {
      id: productId,
      productName: product.productName,
      description: product.description,
      currentPrice: product.currentPrice,
      shopID: product.shopID,
      shopName: product.shopName || "Sale168.vn",
      img: product.imgs[0],
      quantity,
    };
    dispatch(addToCart(data));
    toast.success("Đã thêm vào giỏ hàng", { autoClose: 500 });
    type ? "" : navigate("/cart");
  };
  return (
    <div className="">
      <Promotion />
      <Header />
      <Navbar />
      <div className="min-h-screen">
        <div>
          <div className="mb-12 max-w-screen-xl mx-auto py-4 flex gap-3 p-3 md-p-0">
            <div className="flex flex-col md:flex-row lg:w-3/4 gap-2 bg-green-100 rounded-md p-3 shadow-sm border border-green-200">
              <div className="md:w-1/2 w-full overflow-hidden border border-green-300 rounded-md p-2 bg-green-50">
                <div className="relative overflow-hidden w-full mx-center">
                  <ul className="flex flex-nowrap overflow-hidden scroll whitespace-nowrap scroll-smooth scrollbar-hide py-2">
                    {imgs &&
                      imgs.map((i, k) => {
                        return (
                          <li
                            className={`w-full flex-grow-0 flex-shrink-0 p-1 duration-500
                             
                          `}
                            style={{
                              transform: `translateX(-${activeImg * 100}%)`,
                            }}
                            key={k}
                            onClick={() => {
                              setActiveImg(k);
                            }}
                          >
                            <img
                              src={i}
                              alt=""
                              className="w-full object-cover rounded aspect-square "
                            />
                          </li>
                        );
                      })}
                  </ul>
                </div>
                <ul
                  className="flex flex-nowrap relative overflow-hidden scroll whitespace-nowrap scroll-smooth scrollbar-hide py-2 mt-2"
                  id="wrraper"
                >
                  {imgs && imgs.length > 4 && (
                    <div>
                      <button
                        onClick={() => {
                          setActiveImg((prev) =>
                            prev === imgs.length - 1 ? 0 : prev + 1
                          );
                        }}
                        className="p-1 z-10 bg-green-500/30 rounded-full hover:bg-green-500 absolute top-[40%] right-0"
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
                            d="M8.25 4.5l7.5 7.5-7.5 7.5"
                          />
                        </svg>
                      </button>
                      <button
                        onClick={() => {
                          setActiveImg((prev) =>
                            prev === 0 ? imgs.length - 1 : prev - 1
                          );
                        }}
                        className="p-1 z-10  bg-green-500/30 rounded-full hover:bg-green-300 absolute top-[40%]"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="w-4 h-4 "
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M15.75 19.5L8.25 12l7.5-7.5"
                          />
                        </svg>
                      </button>
                    </div>
                  )}

                  {imgs &&
                    imgs.map((i, k) => {
                      return (
                        <li
                          className={`w-1/4 flex-grow-0 flex-shrink-0 p-1 cursor-pointer ${
                            activeImg === k
                              ? "opacity-100 border border-primary rounded"
                              : "opacity-30"
                          }`}
                          key={k}
                          onClick={() => {
                            setActiveImg(k);
                          }}
                          style={{
                            transform: `translateX(-${
                              activeImg > 3
                                ? (activeImg - (activeImg % 4)) * 100
                                : 0
                            }%)`,
                          }}
                        >
                          <img
                            src={i}
                            alt=""
                            className="w-full h-full object-cover rounded aspect-square "
                          />
                        </li>
                      );
                    })}
                </ul>
              </div>
              <div className="flex md:w-1/2 w-full flex-col gap-3 border border-green-300 rounded-md p-3 bg-green-50">
                <h3 className="text-gray-700 text-xl font-bold">
                  {product?.productName}
                </h3>
                <div className="flex">
                  {/* Xem shop */}
                  <div
                    className="flex text-sm justify-evenly w-28 px-1.5 py-1.5 bg-primary text-white rounded align-center leading-5 border border-primary cursor-pointer hover:bg-green-700"
                    onClick={() => {
                      if (!currentUser) {
                        return navigate("/login");
                      }
                      setShowChat(true);
                    }}
                  >
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
                        d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z"
                      />
                    </svg>
                    <span className="no-underline font-semibold">
                      Chat ngay
                    </span>
                  </div>
                  {showChat && (
                    <Chat
                      onClose={setShowChat}
                      shop={shopId}
                      me={currentUser}
                    />
                  )}

                  {/* chat ngay */}
                  <div className="flex text-sm justify-evenly w-28 px-1.5 py-1.5 bg-primary text-white rounded align-center leading-5 ml-2">
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
                        d="M13.5 21v-7.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349m-16.5 11.65V9.35m0 0a3.001 3.001 0 003.75-.615A2.993 2.993 0 009.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 002.25 1.016c.896 0 1.7-.393 2.25-1.016a3.001 3.001 0 003.75.614m-16.5 0a3.004 3.004 0 01-.621-4.72L4.318 3.44A1.5 1.5 0 015.378 3h13.243a1.5 1.5 0 011.06.44l1.19 1.189a3 3 0 01-.621 4.72m-13.5 8.65h3.75a.75.75 0 00.75-.75V13.5a.75.75 0 00-.75-.75H6.75a.75.75 0 00-.75.75v3.75c0 .415.336.75.75.75z"
                      />
                    </svg>
                    <Link
                      className="no-underline font-semibold"
                      to={`/shop/${product.shopID}`}
                    >
                      Xem shop
                    </Link>
                  </div>
                </div>

                <div className="flex text-xl justify-between w-1/2">
                  <p className="mb-1 text-primary font-semibold line-clamp-2">
                    {product?.stockPrice > 0
                      ? vnd(product?.currentPrice)
                      : "Liên hệ"}
                  </p>
                  <p
                    className={`mb-1  ${
                      product?.stockPrice - product?.currentPrice > 0
                        ? "text-red-600 line-through"
                        : "hidden"
                    }  font-semibold `}
                  >
                    {vnd(product?.stockPrice)}
                  </p>
                </div>
                {/* <div className="flex justify-between">
                  <ul className="list-disc ml-5">
                    <li>Đạt chuẩn an toàn VietGap</li>
                    <li>Hàng tươi mới mỗi ngày</li>
                  </ul>
                </div> */}

                <div className="bg-orange-100 rounded border border-dashed border-red-500 divide-y divide-dashed divide-red-500">
                  <div className="flex gap-3 p-3 items-center">
                    <img
                      src="https://green.web5phut.com/wp-content/uploads/2022/07/gift.png"
                      className="w-8"
                      alt=""
                    />
                    <h3 className="uppercase font-semibold">
                      khuyến mãi trị giá{" "}
                      <span className="font-bold">{vnd(200000)}</span>
                    </h3>
                  </div>
                  <div className="p-3">
                    <ul className="list-decimal ml-5 ">
                      <li>
                        Qùa tặng theo chương trình "Mua hàng ngay - Quà liền
                        tay"{" "}
                      </li>
                      <li>Áp dụng tới khi hết quà tặng</li>
                    </ul>
                  </div>
                </div>
                <div className="flex my-5">
                  <span className="font-bold text-gray-700">Số lượng</span>
                  <div className="flex w-1/2 mx-auto gap-1">
                    <button
                      className="bg-gray-300 px-2.5 hover:bg-gray-500 rounded"
                      onClick={() =>
                        setQuantity((prev) => (prev > 0 ? prev - 1 : 0))
                      }
                    >
                      -
                    </button>
                    <input
                      type="number"
                      className="focus:border-primary focus:outline-none focus:ring-primary w-1/4 border border-green-100 text-center"
                      value={quantity}
                      onChange={(e) => setQuantity(parseInt(e.target.value))}
                    />
                    <button
                      className="bg-gray-300 px-2.5 hover:bg-gray-500 rounded"
                      onClick={() => setQuantity((prev) => prev + 1)}
                    >
                      +
                    </button>
                  </div>
                </div>
                <div className="w-full grid grid-cols-2 gap-2">
                  <button
                    className="p-3 font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-md"
                    onClick={() => handleClick(true)}
                  >
                    Thêm vào giỏ hàng
                  </button>
                  <button
                    className="p-3 font-semibold text-white bg-orange-400 rounded-md text-center hover:bg-orange-600"
                    onClick={() => handleClick(false)}
                  >
                    Mua ngay
                  </button>
                </div>
              </div>
            </div>
            <div className="lg:w-1/4 lg:block hidden bg-green-50 rounded-md p-2 border border-green-200">
              <h3 className="p-3 bg-primary w-full text-center text-white rounded-md block uppercase fo">
                sản phẩm nổi bật
              </h3>
              <div className="divide-y divide-dashed divide-primary">
                {hotProducts.map((p, i) => {
                  return (
                    <Link
                      to={`/products/${p._id}`}
                      className="py-1 flex gap-3"
                      key={i}
                    >
                      <img
                        src={
                          p.imgs[0] ||
                          "https://via.placeholder.com/300.png/09f/fff"
                        }
                        alt=""
                        className="w-1/3 h-24 object-cover object-center rounded-md"
                      />
                      <div className="flex flex-col justify-center items-start flex-1">
                        <p to={`/products/${p._id}`} className="font-semibold">
                          {p?.productName}
                        </p>
                        <div className="flex gap-2 text-sm justify-between">
                          <p className="mb-1 text-primary font-semibold line-clamp-2">
                            {p.stockPrice > 0 ? vnd(p.currentPrice) : "Liên hệ"}
                          </p>
                          <p
                            className={`mb-1  ${
                              p.stockPrice - p.currentPrice > 0
                                ? "text-red-600 line-through"
                                : "hidden"
                            }  font-semibold `}
                          >
                            {vnd(p.stockPrice)}
                          </p>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-wrap max-w-screen-xl mx-auto">
          <div className="w-full">
            <ul
              className="flex mb-0 list-none flex-wrap pt-3 pb-4 flex-row"
              role="tablist"
            >
              <li className="-mb-px mr-2 last:mr-0 flex-auto text-center">
                <a
                  className={
                    "text-xs font-bold uppercase px-5 py-3 shadow-lg rounded block leading-normal border transition-colors " +
                    (openTab === 1
                      ? "text-white bg-primary"
                      : "text-green-800 bg-green-100 border-green-300 hover:bg-green-200")
                  }
                  onClick={(e) => {
                    e.preventDefault();
                    setOpenTab(1);
                  }}
                  data-toggle="tab"
                  href="#link1"
                  role="tablist"
                >
                  Mô tả
                </a>
              </li>
              {/* <li className="-mb-px mr-2 last:mr-0 flex-auto text-center">
                <a
                  className={
                    "text-xs font-bold uppercase px-5 py-3 shadow-lg rounded block leading-normal " +
                    (openTab === 2
                      ? "text-white bg-primary"
                      : "text-primary bg-white")
                  }
                  onClick={(e) => {
                    e.preventDefault();
                    setOpenTab(2);
                  }}
                  data-toggle="tab"
                  href="#link2"
                  role="tablist"
                >
                  thông tin bổ sung
                </a>
              </li> */}
              <li className="-mb-px mr-2 last:mr-0 flex-auto text-center">
                <a
                  className={
                    "text-xs font-bold uppercase px-5 py-3 shadow-lg rounded block leading-normal border transition-colors " +
                    (openTab === 3
                      ? "text-white bg-primary"
                      : "text-green-800 bg-green-100 border-green-300 hover:bg-green-200")
                  }
                  onClick={(e) => {
                    e.preventDefault();
                    setOpenTab(3);
                  }}
                  data-toggle="tab"
                  href="#link3"
                  role="tablist"
                >
                  đánh giá
                </a>
              </li>
            </ul>

            <div className="relative flex flex-col min-w-0 break-words bg-green-100 w-full mb-6 shadow-lg rounded border border-green-200">
              <div className="px-4 py-5 flex-auto">
                <div className="tab-content tab-space">
                  <div className={openTab === 1 ? "flex" : "hidden"} id="link1">
                    <div className="w-full space-y-4">
                      <p
                        dangerouslySetInnerHTML={{ __html: product.description }}
                      ></p>

                      {product?.ocopCertImage && (
                        <div className="border border-gray-200 rounded-md p-3">
                          <h4 className="font-semibold text-gray-800 mb-2">
                            Ảnh chứng nhận OCOP
                          </h4>
                          <img
                            src={product.ocopCertImage}
                            alt="Chứng nhận OCOP"
                            className="max-w-full md:max-w-md rounded-md border border-gray-100"
                          />
                        </div>
                      )}

                      {relatedDocs.length > 0 && (
                        <div className="border border-gray-200 rounded-md p-3">
                          <h4 className="font-semibold text-gray-800 mb-2">
                            Bản công bố sản phẩm
                          </h4>
                          <ul className="list-disc ml-5 space-y-1 text-primary">
                            {relatedDocs.map((doc, index) => (
                              <li key={`${doc}-${index}`}>
                                <a
                                  href={doc}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="hover:underline break-all"
                                >
                                  {doc}
                                </a>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                  {/* <div className={openTab === 2 ? "flex" : "hidden"} id="link2">
                    <table>
                      <thead>
                        <tr>
                          <th>KÍCH THƯỚC</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>M, L, S, XL, XXL</td>
                        </tr>
                      </tbody>
                    </table>
                  </div> */}
                  <div
                    className={openTab === 3 ? "block" : "hidden"}
                    id="link3"
                  >
                    <Comment
                      productId={productId}
                      productName={product?.productName}
                      userId={currentUser?._id}
                      userName={
                        currentUser?.displayName || currentUser?.username
                      }
                      userImg={currentUser?.img}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Product;
