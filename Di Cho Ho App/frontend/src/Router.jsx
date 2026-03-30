import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState } from 'react';

// Contexts
import { ProductProvider } from './store/ProductStore';

// Pages
import HomePage from './pages/HomePage';
import Products from './pages/Products';
import ProductPage from './pages/ProductPage';
import Cart from './pages/Cart';
import SignUp from './pages/SignUp';

// Login pages
import LoginShop    from './pages/Login/LoginShop';
import LoginUser    from './pages/Login/LoginUser';
import LoginPartner from './pages/Login/LoginPartner';

// Admin dashboards
import ShopDashboard    from './pages/Admin/ShopDashboard';
import UserDashboard    from './pages/Admin/UserDashboard';
import PartnerDashboard from './pages/Admin/PartnerDashboard';

// Guards
import ProtectedRoute from './ProtectedRoute';

export default function AppRouter() {
  const [cart, setCart] = useState([]);

  const addToCart = (item, quantity = 1) => {
    setCart((prevCart) => {
      const existingIndex = prevCart.findIndex((cartItem) => cartItem.id === item.id);
      if (existingIndex === -1) {
        return [...prevCart, { ...item, quantity }];
      }
      const updated = [...prevCart];
      updated[existingIndex] = {
        ...updated[existingIndex],
        quantity: updated[existingIndex].quantity + quantity,
      };
      return updated;
    });
  };

  const removeFromCart = (index) => {
    setCart((prevCart) => prevCart.filter((_, i) => i !== index));
  };

  const updateCartQuantity = (index, newQuantity) => {
    setCart((prevCart) => {
      if (newQuantity < 1) return prevCart.filter((_, i) => i !== index);
      const updated = [...prevCart];
      updated[index] = { ...updated[index], quantity: newQuantity };
      return updated;
    });
  };

  return (
    <ProductProvider>
      <Router>
        <Routes>
          {/* ── Public Routes ── */}
          <Route path="/"          element={<HomePage  onAddToCart={addToCart} />} />
          <Route path="/products"  element={<Products  onAddToCart={addToCart} />} />
          <Route path="/product/:id" element={<ProductPage onAddToCart={addToCart} />} />
          <Route path="/cart"      element={<Cart cart={cart} onRemoveFromCart={removeFromCart} onUpdateQuantity={updateCartQuantity} />} />
          <Route path="/signup"    element={<SignUp />} />

          {/* ── Legacy /login → redirect ── */}
          <Route path="/login"     element={<Navigate to="/login/user" replace />} />

          {/* ── Login Pages ── */}
          <Route path="/login/shop"    element={<LoginShop />} />
          <Route path="/login/user"    element={<LoginUser />} />
          <Route path="/login/partner" element={<LoginPartner />} />

          {/* ── Protected Admin Dashboards ── */}
          <Route
            path="/admin/shop"
            element={
              <ProtectedRoute requiredRole="shop">
                <ShopDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/user"
            element={
              <ProtectedRoute requiredRole="user">
                <UserDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/partner"
            element={
              <ProtectedRoute requiredRole="partner">
                <PartnerDashboard />
              </ProtectedRoute>
            }
          />

          {/* ── Legacy /admin ── */}
          <Route path="/admin" element={<Navigate to="/login/shop" replace />} />

          {/* ── 404 ── */}
          <Route path="*" element={
            <div style={{
              minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: 'var(--font-base)', flexDirection: 'column', gap: '16px',
              background: 'var(--color-bg)',
            }}>
              <div style={{ fontSize: '80px' }}>🛒</div>
              <h1 style={{ fontSize: '32px', fontWeight: 800, color: 'var(--color-text-1)' }}>Trang Không Tìm Thấy</h1>
              <p style={{ color: 'var(--color-text-3)' }}>Trang bạn tìm kiếm không tồn tại.</p>
              <a href="/" style={{
                padding: '12px 24px', background: 'var(--color-primary)', color: 'white',
                borderRadius: '10px', fontWeight: 700, textDecoration: 'none',
              }}>
                Về trang chủ
              </a>
            </div>
          } />
        </Routes>
      </Router>
    </ProductProvider>
  );
}
