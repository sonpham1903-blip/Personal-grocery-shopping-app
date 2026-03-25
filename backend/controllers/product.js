import Product from '../models/Product.js';
import { createError } from '../error.js';

const permission = ["admin", "shop"];

export const createProduct = async (req, res, next) => {
  try {
    if (!req.body.stockPrice)
      return res.status(403).json("Giá niêm yết không hợp lệ");
    if (!req.body.currentPrice)
      return res.status(403).json("Giá bán không hợp lệ");
    if (!Array.isArray(req.body?.imgs) || req.body.imgs.length < 1)
      return res.status(403).json("Hình ảnh sản phẩm không hợp lệ");
    if (!req.user?.id)
      return res.status(401).json("Bạn chưa đăng nhập");
    const newProduct = new Product({ shopID: req.user.id, ...req.body });
    await newProduct.save();
    res.status(200).json("Tạo mới sản phẩm thành công");
  } catch (error) {
    next(error);
  }
};

export const getProducts = async (req, res, next) => {
  try {
    const { search, limit } = req.query;

    const keyword = search ? search.replaceAll(" - ", " ") : "";

    const products = await Product.find({
      active: true,
      cat: { $regex: keyword, $options: "i" },
    });

    if (products.length === 0) {
      return res.status(404).json("chưa có dữ liệu");
    }

    const sortedProducts = products.sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );

    const limitNumber = Number(limit);
    const result =
      Number.isInteger(limitNumber) && limitNumber > 0
        ? sortedProducts.slice(0, limitNumber)
        : sortedProducts;

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};


export const getProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product)
      return res.status(403).json("Không tìm thấy thông tin sản phẩm");
    res.status(200).json(product);
  } catch (error) {
    next(error);
  }
};


//update thông tin sản phẩm
export const updateProduct = async (req, res, next) => {
  try {
    if (!req.body.stockPrice)
      return res.status(403).json("Giá niêm yết không hợp lệ");
    if (!req.body.currentPrice)
      return res.status(403).json("Giá bán không hợp lệ");
    if (!Array.isArray(req.body?.imgs) || req.body.imgs.length < 1)
      return res.status(403).json("Hình ảnh sản phẩm không hợp lệ");
    const product = await Product.findById(req.params.id);
    if (!product) {
      return next(createError(404, "Không tìm thấy thông tin sản phẩm"));
    } else {
      if (
        product.shopID === req.user?.id ||
        permission.includes(req.user?.role)
      ) {
        await Product.findByIdAndUpdate(
          req.params.id,
          { $set: req.body },
          { new: true }
        );
        res.status(200).json("Cập nhật sản phẩm thành công");
      } else {
        return next(
          createError(403, "Bạn không được phép thực hiện chức năng này")
        );
      }
    }
  } catch (error) {
    next(error);
  }
};


//xóa sản phẩm
export const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return next(createError(404, "Không tìm thấy thông tin sản phẩm"));
    } else {
      if (
        product.shopID === req.user?.id ||
        permission.includes(req.user?.role)
      ) {
        await Product.findByIdAndDelete(req.params.id);
        res.status(200).json("Xóa sản phẩm thành công");
      } else {
        return next(
          createError(403, "Bạn không được phép thực hiện chức năng này")
        );
      }
    }
  } catch (error) {
    next(error);
  }
};