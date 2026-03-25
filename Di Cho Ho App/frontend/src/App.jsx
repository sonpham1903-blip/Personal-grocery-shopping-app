import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import Products from './pages/Products';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import Cart from './pages/Cart';
import ProductPage from './pages/ProductPage';

const productsData = [
  { id: 1, name: 'Apple', description: 'Fresh red apple', price: 1.0, image: 'https://via.placeholder.com/500/ff7f7f/333?text=Apple', category: 'food' },
  { id: 2, name: 'Banana', description: 'Yellow banana', price: 0.5, image: 'https://via.placeholder.com/500/ffff7f/333?text=Banana', category: 'food' },
  { id: 3, name: 'Orange', description: 'Juicy orange', price: 0.8, image: 'https://via.placeholder.com/500/ffbf7f/333?text=Orange', category: 'food' },
  { id: 4, name: 'Grapes', description: 'Bunch of grapes', price: 2.0, image: 'https://via.placeholder.com/500/bf7fff/333?text=Grapes', category: 'food' },
  { id: 5, name: 'Milk', description: 'Fresh whole milk', price: 3.0, image: 'https://via.placeholder.com/500/7fbfff/333?text=Milk', category: 'beverage' },
  { id: 6, name: 'Bread', description: 'Whole grain bread', price: 2.5, image: 'https://via.placeholder.com/500/ffdf7f/333?text=Bread', category: 'food' },
  { id: 7, name: 'Handmade Basket', description: 'Beautiful woven basket', price: 15.0, image: 'https://via.placeholder.com/500/d2b48c/333?text=Basket', category: 'handicrafts' },
  { id: 8, name: 'Ceramic Vase', description: 'Elegant ceramic vase', price: 25.0, image: 'https://via.placeholder.com/500/daa520/333?text=Vase', category: 'handicrafts' },
  { id: 9, name: 'Wooden Sculpture', description: 'Hand-carved wooden sculpture', price: 40.0, image: 'https://via.placeholder.com/500/cd853f/333?text=Sculpture', category: 'handicrafts' },
  { id: 10, name: 'Juice', description: 'Fresh orange juice', price: 4.0, image: 'https://via.placeholder.com/500/ffa500/333?text=Juice', category: 'beverage' },
  { id: 11, name: 'Egg', description: 'Fresh chicken egg', price: 0.2, image: 'https://via.placeholder.com/500/ffdf7f/333?text=Egg', category: 'food' },
  { id: 12, name: 'Chicken', description: 'Fresh chicken', price: 5.0, image: 'https://via.placeholder.com/500/ff7f7f/333?text=Chicken', category: 'food' },
];

function App() {
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

  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage onAddToCart={addToCart} products={productsData} />} />
        <Route path="/products" element={<Products onAddToCart={addToCart} products={productsData} />} />
        <Route path="/product/:id" element={<ProductPage products={productsData} onAddToCart={addToCart} />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/cart" element={<Cart cart={cart} onRemoveFromCart={removeFromCart} />} />
      </Routes>
    </Router>
  );
}

export default App;
