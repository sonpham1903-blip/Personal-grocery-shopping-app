import express from "express";
import {
  changePwd,
  deleteUser,
  dislike,
  follow,
  getByPhone,
  getInactiveUsers,
  getUser,
  getUsers,
  like,
  resetDefaultPassword,
  searchUsers,
  setUserStatus,
  unFollow,
  updateUser,
  updateUserRole,
} from "../controllers/user.js";
import { verifyToken } from "../verifyToken.js";

const router = express.Router();

// tim kiem user
router.get("/search", verifyToken, searchUsers);
// user chua kich hoat
router.get("/inactive", verifyToken, getInactiveUsers);
//get một user
router.get("/:id", verifyToken, getUser);
//get nhiều user, áp dụng cho admin
router.get("/", verifyToken, getUsers);
//get user theo số phone
router.get("/find/:phone", verifyToken, getByPhone);
//update thông tin user
router.put("/:id", verifyToken, updateUser);
router.put("/:id/status/:newstatus", verifyToken, setUserStatus);
router.put("/like/:productid", verifyToken, like);
router.put("/dislike/:productid", verifyToken, dislike);
router.put("/follow/:shopId", verifyToken, follow);
router.put("/unfollow/:shopId", verifyToken, unFollow);
router.put("/changepwd/:id", verifyToken, changePwd);
router.put("/:id/reset-password", verifyToken, resetDefaultPassword);
//update quyền của user
router.post("/updaterole", verifyToken, updateUserRole);

//delete một user
router.delete("/:id", verifyToken, deleteUser);

export default router;
