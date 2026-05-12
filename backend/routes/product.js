import express from "express";
import {createProduct, getProduct, getProducts, getMyProducts, updateProduct, deleteProduct, activeProduct, getLastest, getHostest} from '../controllers/product.js';
import { authorizeRoles, verifyToken } from "../verifyToken.js";

const router = express.Router();
router.post("/", verifyToken, authorizeRoles("admin", "shop"), createProduct);
router.get("/my", verifyToken, authorizeRoles("admin", "shop"), getMyProducts);
router.get("/lastest/:limit", getLastest);
router.get("/hotest/:limit", getHostest);
router.get("/", getProducts);
router.get("/:id", getProduct);
router.put("/:id", verifyToken, authorizeRoles("admin", "shop"), updateProduct);
router.delete("/:id", verifyToken, authorizeRoles("admin", "shop"), deleteProduct);
router.put("/activeProduct/:id", verifyToken, authorizeRoles("admin"), activeProduct);

export default router;