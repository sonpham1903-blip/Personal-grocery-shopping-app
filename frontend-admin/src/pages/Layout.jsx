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
  Users,
  Profile,
  Post,
  NewPost,
  EditPost,
  GoodReceipts,
  Messages,
  Reports,
} from "../pages";
import { useSelector } from "react-redux";

const Layout = () => {
  const { currentUser } = useSelector((state) => state.user);
  const isAdmin = currentUser?.role === "admin";
  
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex relative">
      <Sidebar />
      <div className="bg-gray-200 flex-1 h-screen">
        <Header />
        
        <div className="h-[88vh] overflow-auto">
          <Routes>
            <Route
              index
              element={isAdmin ? <Navigate to="san-pham" replace /> : <Home />}
            />
            <Route
              path="nguoi-dung"
              element={isAdmin ? <Users /> : <Navigate to="/admin" replace />}
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
              {/* <Route path=":userId" element={<EditUser />} /> */}
            </Route>
            <Route path="don-hang" element={<Orders />} />
            <Route path="tin-nhan" element={<Messages />} />
            <Route path="thong-ke" element={<Reports />} />
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
