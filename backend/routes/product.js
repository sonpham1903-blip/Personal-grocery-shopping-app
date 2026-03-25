import express from "express";
import {createProduct, getProduct, getProducts, updateProduct, deleteProduct} from '../controllers/product.js';
import { verifyToken } from "../verifyToken.js";

const router = express.Router();
router.post("/", verifyToken, createProduct);
router.get("/:id", getProduct);
router.get("/", getProducts);
router.put("/:id", verifyToken, updateProduct);
router.delete("/:id", verifyToken, deleteProduct);

export default router;