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

export const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user?.role) {
      return res.status(401).json("Bạn chưa đăng nhập");
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res
        .status(403)
        .json("Bạn không được phép thực hiện chức năng này");
    }

    next();
  };
};
