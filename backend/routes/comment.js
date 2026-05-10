import express from "express";
import { verifyToken } from "../verifyToken.js";
import { createComment, getCommentsByProductID, updateComment, deleteComment} from "../controllers/comment.js"
const router = express.Router()


router.post("/", verifyToken, createComment)
router.get("/product/:productId", getCommentsByProductID)
router.put("/:id", verifyToken, updateComment)
router.delete("/:id", verifyToken, deleteComment)
export default router
// import express from "express"
// import { create, deleteById, get, getAll, getById, updateById } from "../controllers/category.js"

// const router = express.Router()

// router.get("/", get)
// router.get("/all", getAll)
// router.get("/:id", getById)
// router.put("/:id", updateById)
// router.post("/", create)
// router.delete("/:id", deleteById)

// export default router
