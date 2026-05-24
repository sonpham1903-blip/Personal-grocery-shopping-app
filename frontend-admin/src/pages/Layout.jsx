import React from "react";
import { Link } from "react-router-dom";
import { Navigate, Routes, Route } from "react-router-dom";
import { Header, Sidebar } from "../components";
import {
  Home,
  Orders,
  Products,
  NewProduct,
  EditProduct,
  Categories,
  Suppliers,
  Profile,
  Post,
  NewPost,
  EditPost,
  GoodReceipts,
} from "../pages";
import { useSelector } from "react-redux";

const Layout = () => {
  const { currentUser } = useSelector((state) => state.user);
  const isAdmin = currentUser?.role === "admin";

  return (
    <div className="flex relative">
      <Sidebar />
      <div className="bg-gray-200 flex-1 h-screen">
        <Header />
        <div className="border-b border-gray-300 bg-white px-4 py-2">
          <div className="flex flex-wrap items-center gap-2">
            <Link
              to="phieu-nhap"
              className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-green-700"
            >
              Phiếu nhập nhanh
            </Link>
            <span className="text-sm text-gray-600">
              Quản lý nguồn hàng và hạn sử dụng theo từng lô nhập.
            </span>
          </div>
        </div>
        <div className="h-[88vh] overflow-auto">
          <Routes>
            <Route
              index
              element={isAdmin ? <Navigate to="san-pham" replace /> : <Home />}
            />
            <Route path="san-pham">
              <Route index element={<Products />} />
              <Route path="new" element={<NewProduct />} />
              <Route path=":productid" element={<EditProduct />} />
            </Route>
            <Route
              path="phieu-nhap"
              element={
                isAdmin || currentUser?.role === "shop" ? (
                  <GoodReceipts />
                ) : (
                  <Navigate to="/admin" replace />
                )
              }
            />
            <Route
              path="loai-hang-hoa"
              element={isAdmin ? <Categories /> : <Navigate to="/admin" replace />}
            />
            <Route
              path="nha-cung-cap"
              element={isAdmin ? <Suppliers /> : <Navigate to="/admin" replace />}
            />
            <Route path="thong-tin-tai-khoan">
              <Route index element={<Profile />} />
            </Route>
            <Route path="don-hang" element={isAdmin ? <Navigate to="san-pham" replace /> : <Orders />} />
            <Route path="bai-viet">
              <Route index element={<Post />} />
              <Route path="new" element={<NewPost />} />
              <Route path=":postid/edit" element={<EditPost />} />
            </Route>
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default Layout;
