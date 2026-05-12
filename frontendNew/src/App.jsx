import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import { useEffect, Suspense } from "react";
import Home from "./pages/user/Home";
import Products from "./pages/user/Products";
import Product from "./pages/user/Product";
import Posts from "./pages/user/Posts";
import PostsDetail from "./pages/user/PostsDetail";
import Cart from "./pages/user/Cart";
import Profile from "./pages/user/Profile";
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
          <Route path="/posts" element={<Posts />} />
          <Route path="/posts/:postId" element={<PostsDetail />} />
          <Route path="/news" element={<Navigate to="/posts" replace />} />
          <Route path="/news/:postId" element={<PostsDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/notfound" element={<NotFound />} />
          <Route path="*" element={<Navigate to="/notfound" replace />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
