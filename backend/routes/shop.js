import express from "express";
import {
    getAllShops, getShopDetails
} from "../controllers/shop.js";

const router = express.Router();

// Lấy thông tin chi tiết của một cửa hàng
router.get("/:id", getShopDetails);
// Lấy danh sách tất cả cửa hàng
router.get("/", getAllShops);

export default router;