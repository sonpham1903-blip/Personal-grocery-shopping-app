import React from "react";
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
  EditUser,
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
              path="loai-hang-hoa"
              element={isAdmin ? <Categories /> : <Navigate to="/admin" replace />}
            />
            <Route
              path="nha-cung-cap"
              element={isAdmin ? <Suppliers /> : <Navigate to="/admin" replace />}
            />
            <Route path="thong-tin-tai-khoan">
              <Route index element={<EditUser />} />
              <Route path=":userId" element={<EditUser />} />
            </Route>
            <Route path="don-hang" element={isAdmin ? <Navigate to="san-pham" replace /> : <Orders />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default Layout;
