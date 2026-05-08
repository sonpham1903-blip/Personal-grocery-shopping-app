import { create, getByProductId } from '../controllers/comment.js'
import express from 'express'

const router = express.Router()

router.post("/", create);
router.get("/product/:productId", getByProductId);


export default router;