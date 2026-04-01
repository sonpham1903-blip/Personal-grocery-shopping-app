import express from "express";
import {createProduct, getProduct, getProducts, updateProduct, deleteProduct, activeProduct} from '../controllers/product.js';
import { authorizeRoles, verifyToken } from "../verifyToken.js";

const router = express.Router();
router.post("/", verifyToken, authorizeRoles("admin", "shop"), createProduct);
router.get("/:id", getProduct);
router.get("/", getProducts);
router.put("/:id", verifyToken, authorizeRoles("admin", "shop"), updateProduct);
router.delete("/:id", verifyToken, authorizeRoles("admin", "shop"), deleteProduct);
router.put("/activeProduct/:id", verifyToken, authorizeRoles("admin"), activeProduct);

export default router;