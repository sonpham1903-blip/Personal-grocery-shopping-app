import express from "express"
import { create, deleteById, get, getAll, getById, updateById } from "../controllers/category.js"

const router = express.Router()

router.get("/", get)
router.get("/all", getAll)
router.get("/:id", getById)
router.put("/:id", updateById)
router.post("/", create)
router.delete("/:id", deleteById)

export default router