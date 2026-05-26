import express from "express";
import { authorizeRoles, verifyToken } from "../verifyToken.js";
import { createGoodReceipt, getGoodReceipts, getGoodReceiptByShopId, getGoodReceiptByProductId, deleteGoodReceipt, updateGoodReceipt } from "../controllers/GoodReceipt.js";

const router = express.Router()

router.post("/", verifyToken, authorizeRoles("admin", "shop"), createGoodReceipt)
router.get("/", getGoodReceipts)
router.get("/shop/:shopId", getGoodReceiptByShopId)
router.get("/product/:productId", verifyToken, authorizeRoles("admin", "shop"), getGoodReceiptByProductId)
router.delete("/:id", verifyToken, authorizeRoles("admin", "shop"), deleteGoodReceipt)
router.put("/:id", verifyToken, authorizeRoles("admin", "shop"), updateGoodReceipt)
export default router