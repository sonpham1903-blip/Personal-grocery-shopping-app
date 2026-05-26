import express from "express";
import { findOrCreateChat, getUserChats } from "../controllers/chat.js";

const router = express.Router();

router.get("/find/:user1Id/:user2Id", findOrCreateChat);
router.get("/user/:userId", getUserChats);

export default router;
