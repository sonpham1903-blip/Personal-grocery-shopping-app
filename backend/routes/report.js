import express from "express";
import { getAdminReport, getShopReport } from "../controllers/report.js";
import { verifyToken, authorizeRoles } from "../verifyToken.js";

const router = express.Router();

// Route cho admin: chỉ cho phép role admin
router.get("/admin", verifyToken, authorizeRoles("admin"), getAdminReport);

// Route cho shop: chỉ cho phép role shop
router.get("/shop", verifyToken, authorizeRoles("shop"), getShopReport);

export default router;
