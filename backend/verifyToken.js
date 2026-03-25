import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1]; // Bearer <token>

  if (!token) {
    return res.status(401).json("Token không được tìm thấy");
  }

  try {
    const secret = process.env.JWT_KEY;
    if (!secret) {
      return res.status(500).json("Thiếu cấu hình JWT_KEY");
    }
    const decoded = jwt.verify(token, secret);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json("Token không hợp lệ");
  }
};
