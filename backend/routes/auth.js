import express from 'express'
import { signin, signup, login } from '../controllers/auth.js' 


const router = express.Router()

router.post("/signup", signup)
router.post("/signin", signin)
router.post("/login", login)

export default router