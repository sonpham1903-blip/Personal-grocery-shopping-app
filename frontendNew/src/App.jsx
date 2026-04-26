import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import { useEffect, Suspense } from "react";
import Home from "./pages/user/Home";
import AdminHome from "./pages/shop/Home";
import AdminLogin from "./pages/shop/Login";
import Products from "./pages/user/Products";
import Product from "./pages/user/Product";
import Cart from "./pages/user/Cart";
import Login from "./pages/user/Login";
import NotFound from "./pages/user/NotFound";
import ktsRequest from "../ultis/ktsrequest";
import { ToastContainer } from "react-toastify";
function App() {
  useEffect(() => {
    const countVisitor = async () => {
      await ktsRequest.get("/count");
    };
    countVisitor();
  }, []);
  return (
    <BrowserRouter>
      <ToastContainer />
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/:productId" element={<Product />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/notfound" element={<NotFound />} />
          <Route path="*" element={<Navigate to="/notfound" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin" element={<AdminHome />} />
          <Route path="/admin/login" element={<AdminLogin />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
