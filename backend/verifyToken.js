import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1]; // Bearer <token>

  if (!token) {
    return res.status(401).json("Token không được tìm thấy");
  }

  try {
    const secret = "your-secret-key"; // TODO: Thay bằng secret key thực tế từ .env
    const decoded = jwt.verify(token, secret);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json("Token không hợp lệ");
  }
};
