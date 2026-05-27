import express from "express";
import { handleAssistantChat } from "../controllers/assistant.js";

const router = express.Router();

// Public route for assistant chat, can be authenticated if currentUser token is available
router.post("/chat", handleAssistantChat);

export default router;
