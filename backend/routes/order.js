import express from "express";
import { createOrder, getOrders, getMyOrders, getOrder, updateById, cancel } from '../controllers/order.js';
import { verifyToken } from "../verifyToken.js";

const router = express.Router();

router.post("/", verifyToken, createOrder);
router.get("/", verifyToken, getOrders);
router.get("/my", verifyToken, getMyOrders);
router.get("/my-orders", verifyToken, getMyOrders);
router.get("/:id", verifyToken, getOrder);
router.put("/:id", verifyToken, updateById);
router.post("/:id/cancel", verifyToken, cancel);

export default router;
