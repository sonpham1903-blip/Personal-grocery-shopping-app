import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import { useEffect, Suspense } from "react";
import Home from "./pages/user/Home";
import Products from "./pages/user/Products";
import Product from "./pages/user/Product";
import ShopDetail from "./pages/user/ShopDetail";
import Posts from "./pages/user/Posts";
import PostsDetail from "./pages/user/PostsDetail";
import About from "./pages/user/About";
import Cart from "./pages/user/Cart";
import Profile from "./pages/user/Profile";
import Login from "./pages/user/Login";
import Register from "./pages/user/Register";
import NotFound from "./pages/user/NotFound";
import ShopAssistance from "./pages/user/ShopAssistance";
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
          <Route path="/about" element={<About />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/:productId" element={<Product />} />
          <Route path="/shop/:shopId" element={<ShopDetail />} />
          <Route path="/posts" element={<Posts />} />
          <Route path="/posts/:postId" element={<PostsDetail />} />
          <Route path="/news" element={<Navigate to="/posts" replace />} />
          <Route path="/news/:postId" element={<PostsDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/shopassistance" element={<ShopAssistance />} />
          <Route path="/notfound" element={<NotFound />} />
          <Route path="*" element={<Navigate to="/notfound" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
