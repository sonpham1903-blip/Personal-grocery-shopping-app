import { createError } from "../error.js";
import User from "../models/User.js";
import Product from "../models/Product.js";
const permission = ["admin", "staff"];
import bcrypt from "bcryptjs";
const STATUS_ALLOWED = [-1, 0, 1, 2];
const DEFAULT_RESET_PASSWORD = process.env.DEFAULT_RESET_PASSWORD || "admin";

const parseRoles = (value = "") =>
  value
    .split(",")
    .map((role) => role.trim())
    .filter(Boolean);

//get một user
export const getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select(["-password"]);
    if (!user) {
      return res.status(404).json("Không tìm thấy thông tin người dùng");
    }
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};
//get nhiều user, áp dụng cho admin/staff
export const getUsers = async (req, res, next) => {
  if (!permission.includes(req.user.role)) {
    // Chỉ user/staff mới được phép thực hiện chức năng này
    return res.status(403).json("Tham số truyền vào không đúng");
  }
  try {
    const users = await User.find().select(["-password"]);
    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
};
// tim user theo username/displayName/phone/email
export const searchUsers = async (req, res, next) => {
  if (!permission.includes(req.user.role)) {
    return res
      .status(403)
      .json("Bạn không được cấp quyền thực hiện chức năng này");
  }
  try {
    const q = (req.query.q || "").trim();
    if (!q) {
      return res.status(200).json([]);
    }
    const regex = new RegExp(q, "i");
    const users = await User.find({
      $or: [
        { username: regex },
        { displayName: regex },
        { phone: regex },
        { email: regex },
      ],
    }).select(["-password"]);
    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
};
// tim user chua kich hoat
export const getInactiveUsers = async (req, res, next) => {
  if (!permission.includes(req.user.role)) {
    return res
      .status(403)
      .json("Bạn không được cấp quyền thực hiện chức năng này");
  }
  try {
    const users = await User.find({ status: 2 }).select(["-password"]);
    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
};
//get user theo số phone
export const getByPhone = async (req, res, next) => {
  if (!permission.includes(req.user.role)) {
    // Chỉ user/staff mới được phép thực hiện chức năng này
    return res
      .status(403)
      .json("Bạn không được cấp quyền thực hiện chức năng này");
  }
  try {
    const users = await User.find({ phone: req.params.phone }).select([
      "-password",
    ]);
    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
};
//update thông tin user
export const updateUser = async (req, res, next) => {
  const isSelf = req.params.id === req.user.id;
  const canManageUsers = permission.includes(req.user.role);
  if (!isSelf && !canManageUsers) {
    return next(
      createError(
        403,
        "Bạn chỉ được phép cập nhật thông tin tài khoản của mình"
      )
    );
  }
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(403).json("Không tìm thấy thông tin user");
    } else {
      if (user.role === "admin" && req.user.role !== "admin")
        return res.status(403).json("Tài khoản admin không được phép truy cập");
      const updatedUser = await User.findByIdAndUpdate(
        req.params.id,
        { $set: req.body },
        { new: true }
      ).select(["-password"]);
      res.status(200).json({
        message:
          "Cập nhật thông tin tài khoản thành công, bạn cần đăng nhập lại để áp dụng (các) thay đổi",
        data: updatedUser,
      });
    }
  } catch (error) {
    next(error);
  }
};
//update quyền của user
export const updateUserRole = async (req, res, next) => {
  const allowedRoles = parseRoles(process.env.ROLE);
  if (!allowedRoles.includes(req.user.role)) {
    return next(createError(403, "Bạn không được cấp quyền thực hiện chức năng này"));
  }
  if (!req.body.userID || !req.body.new_role) {
    return next(createError(400, "Thiếu thông tin userID hoặc new_role"));
  }
  if (req.body.new_role === "admin" && req.user.role !== "admin") {
    return next(createError(403, "Tham số truyền lên không đúng"));
  }
  try {
    await User.findByIdAndUpdate(req.body.userID, {
      $set: { role: req.body.new_role },
    });
    res.status(200).json("Cập nhật quyền user thành công");
  } catch (error) {
    next(error);
  }
};
export const changePwd = async (req, res, next) => {
  try {
    if (!(req.user.id === req.params.id || permission.includes(req.user.role)))
      return res
        .status(403)
        .json("Bạn không được cấp quyền thực hiện chức năng này");
    const user = await User.findById(req.params.id);
    if (!user || user.status > 0)
      return res.status(404).json("User không khả dụng");
    const bypassPasswordCheckRoles = parseRoles(process.env.AUTO_TRUE_ROLE_LV1);
    const checkPass = bypassPasswordCheckRoles.includes(req.user.role)
      ? true
      : await bcrypt.compare(req.body.password || "", user.password);
    if (!checkPass) return res.status(403).json("Mật khẩu hiện tại không đúng");
    if (!req.body.newpwd)
      return res.status(403).json("Mật khẩu mới không được để trống");
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(req.body.newpwd, salt);
    await User.findByIdAndUpdate(
      req.params.id,
      { $set: { password: hash } },
      { new: true }
    );
    res
      .status(200)
      .json(
        "Thay đổi mật khẩu thành công, bạn cần đăng nhập lại để áp dụng (các) thay đổi"
      );
  } catch (error) {
    next(error);
  }
};
export const setUserStatus = async (req, res, next) => {
  if (!permission.includes(req.user.role)) {
    return next(createError(403, "Bạn không được cấp quyền thực hiện chức năng này"));
  }
  const newStatus = Number(req.params.newstatus);
  if (!STATUS_ALLOWED.includes(newStatus)) {
    return next(createError(400, "Giá trị status không hợp lệ"));
  }
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return next(createError(404, "Không tìm thấy thông tin user"));
    }
    if (user.role === "admin" && req.user.role !== "admin") {
      return next(createError(403, "Bạn không được phép cập nhật trạng thái admin"));
    }
    await User.findByIdAndUpdate(req.params.id, {
      $set: { status: newStatus },
    });
    res.status(200).json("Cập nhật trạng thái user thành công");
  } catch (error) {
    next(error);
  }
};
// reset mat khau ve mac dinh
export const resetDefaultPassword = async (req, res, next) => {
  if (!permission.includes(req.user.role)) {
    return next(createError(403, "Bạn không được cấp quyền thực hiện chức năng này"));
  }
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return next(createError(404, "Không tìm thấy thông tin user"));
    }
    if (user.role === "admin" && req.user.role !== "admin") {
      return next(createError(403, "Bạn không được phép reset mật khẩu admin"));
    }
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(DEFAULT_RESET_PASSWORD, salt);
    await User.findByIdAndUpdate(req.params.id, {
      $set: { password: hash },
    });
    res.status(200).json({
      message: "Đặt lại mật khẩu mặc định thành công",
      defaultPassword: DEFAULT_RESET_PASSWORD,
    });
  } catch (error) {
    next(error);
  }
};
// delete một user
export const deleteUser = async (req, res, next) => {
  if (!permission.includes(req.user.role)) {
    return next(
      createError(403, "Bạn không được phép thực hiện chức năng này")
    );
  }
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return next(createError(404, "Không tìm thấy thông tin user"));
    }
    if (user.role === "admin" && req.user.role !== "admin") {
      return next(createError(403, "Bạn không được phép xóa tài khoản admin"));
    }
    await User.findByIdAndUpdate(req.params.id, {
      $set: { status: -1 },
    });
    res.status(200).json("User đã bị xóa (soft delete)");
  } catch (error) {
    next(error);
  }
};
export const like = async (req, res, next) => {
  const id = req.user.id;
  const productid = req.params.productid;
  try {
    const p = await Product.findByIdAndUpdate(productid, {
      $addToSet: { likedBy: id },
      // $pull: { dislikedBy: id },
    });
    res.status(200).json("Liked");
  } catch (err) {
    next(err);
  }
};
export const dislike = async (req, res, next) => {
  const id = req.user.id;
  const productid = req.params.productid;
  try {
    const p = await Product.findByIdAndUpdate(
      productid,
      {
        // $addToSet: { dislikedBy: id },
        $pull: { likedBy: id },
      },
      { new: true }
    );
    res.status(200).json("Disliked");
  } catch (err) {
    next(err);
  }
};
export const follow = async (req, res, next) => {
  const id = req.user.id;
  const shopId = req.params.shopId;
  try {
    const p = await User.findByIdAndUpdate(shopId, {
      $addToSet: { likedBy: id },
      // $pull: { dislikedBy: id },
    });
    res.status(200).json("followed");
  } catch (err) {
    next(err);
  }
};
export const unFollow = async (req, res, next) => {
  const id = req.user.id;
  const shopId = req.params.shopId;
  try {
    const p = await User.findByIdAndUpdate(
      shopId,
      {
        // $addToSet: { dislikedBy: id },
        $pull: { likedBy: id },
      },
      { new: true }
    );
    res.status(200).json("UnFollowed");
  } catch (err) {
    next(err);
  }
};
