import User from "../models/User.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { createError } from "../error.js";

export const signup = async (req, res, next) => {
  try {
    const user = await User.findOne({ username: req.body.username });
    if (user) {
      return res.status(403).json("Tên đăng nhập đã có người sử dụng");
    }
    if (["admin"].includes(req.body?.role))
      return res.status(403).json("Tham số truyền lên không hợp lệ");
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(req.body.password, salt);
    const newUser = new User({ ...req.body, password: hash });
    await newUser.save();
    res.status(200).json("Đăng ký tài khoản thành công");
  } catch (createError) {
    next(createError(403, "Đăng ký tài khoản thất bại"));
  }
};
// admin
export const signin = async (req, res, next) => {
  try {
    const user = await User.findOne({ username: req.body.username });
    if (!user) return res.status(404).json("Sai tên đăng nhập hoặc mật khẩu");
    if (user.status === 0)
      return res
        .status(403)
        .json(
          "Tài khoản đã bị khóa do vi phạm chính sách cộng đồng, hãy liên hệ CSKH để được hỗ trợ"
        );
    if (["user"].includes(user.role))
      return res.status(403).json("Bạn chưa được cấp phép truy cập trang này");
    const checkPass = await bcrypt.compare(req.body.password, user.password);
    if (!checkPass)
      return res.status(404).json("Sai tên đăng nhập hoặc mật khẩu");
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_KEY,
      { expiresIn: "4h" }
    );
    const { password, ...other } = user._doc;
    res.status(200).json({ ...other, token });
  } catch (error) {
    next(createError(403, "Đăng nhập thất bại"));
  }
};

// People/User - người mua
export const login = async (req, res, next) => {
  try {
    const user = await User.findOne({ username: req.body.username });
    if (!user) return res.status(404).json("Sai tên đăng nhập hoặc mật khẩu");
    if (user.status === 0)
      return res
        .status(403)
        .json(
          "Tài khoản đã bị khóa do vi phạm chính sách cộng đồng, hãy liên hệ CSKH để được hỗ trợ"
        );
    if (user.role !== "user")
      return res.status(403).json("Bạn chưa được cấp phép truy cập trang này");
    const checkPass = await bcrypt.compare(req.body.password, user.password);
    if (!checkPass)
      return res.status(404).json("Sai tên đăng nhập hoặc mật khẩu");
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_KEY,
      { expiresIn: "4h" }
    );
    const { password, ...other } = user._doc;
    res.status(200).json({ ...other, token });
  } catch (error) {
    next(createError(403, "Đăng nhập thất bại"));
  }
};
