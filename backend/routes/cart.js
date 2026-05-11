import express from 'express';
import { getCart, addToCart, removeFromCart, updateQuantity, clearCart } from '../controllers/cart.js';
import { verifyToken } from '../verifyToken.js';

const router = express.Router();
router.post("/add", verifyToken, addToCart);
router.get("/:userId", verifyToken, getCart);
router.post("/update", verifyToken, updateQuantity);
router.post("/clear", verifyToken, clearCart);
router.delete("/remove", verifyToken, removeFromCart);

export default router;