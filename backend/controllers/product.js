import Product from "../models/Product.js";
import { createError } from "../error.js";

const normalizeText = (value = "") =>
  String(value)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();

const getSearchTokens = (value = "") =>
  normalizeText(value).split(/\s+/).filter(Boolean);

const matchesSearchTokens = (source = "", tokens = []) => {
  if (tokens.length === 0) {
    return true;
  }

  const sourceTokens = getSearchTokens(source);
  return tokens.every((token) => sourceTokens.includes(token));
};

export const createProduct = async (req, res, next) => {
  try {
    if (!req.body.stockPrice)
      return res.status(403).json("Giá niêm yết không hợp lệ");
    if (!req.body.currentPrice)
      return res.status(403).json("Giá bán không hợp lệ");
    if (!Array.isArray(req.body?.imgs) || req.body.imgs.length < 1)
      return res.status(403).json("Hình ảnh sản phẩm không hợp lệ");
    if (!req.user?.id) return res.status(401).json("Bạn chưa đăng nhập");
    const payload = { ...req.body };
    if (req.user?.role !== "admin") {
      delete payload.active;
    }
    const newProduct = new Product({ shopID: req.user.id, ...payload });
    await newProduct.save();
    res.status(200).json("Tạo mới sản phẩm thành công");
  } catch (error) {
    next(error);
  }
};

export const activeProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return next(createError(404, "Không tìm thấy thông tin sản phẩm"));
    }
    const isAdmin = req.user?.role === "admin";

    if (isAdmin) {
      await Product.findByIdAndUpdate(
        req.params.id,
        { $set: { active: true } },
        { new: true },
      );
      res.status(200).json("Kích hoạt sản phẩm thành công");
    } else {
      return next(
        createError(403, "Bạn không được phép thực hiện chức năng này"),
      );
    }
  } catch (error) {
    next(error);
  }
};

export const getProducts = async (req, res, next) => {
  try {
    const { search, limit } = req.query;

    const searchTokens = getSearchTokens(search);

    const products = await Product.find({ active: true });
    const matchedProducts =
      searchTokens.length > 0
        ? products.filter((product) => {
            return (
              matchesSearchTokens(product.productName, searchTokens) ||
              matchesSearchTokens(product.cat, searchTokens)
            );
          })
        : products;

    const sortedProducts = matchedProducts.sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
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

export const getMyProducts = async (req, res, next) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json("Bạn chưa đăng nhập");
    }

    const isAdmin = req.user?.role === "admin";
    const products = isAdmin
      ? await Product.find()
      : await Product.find({ shopID: req.user.id });

    const list = products.sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
    );

    res.status(200).json(list);
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
      const isAdmin = req.user?.role === "admin";
      const isShopOwner =
        req.user?.role === "shop" && product.shopID === req.user?.id;
      const updateData = { ...req.body };
      const triesToChangeActive =
        Object.prototype.hasOwnProperty.call(updateData, "active") &&
        Boolean(updateData.active) !== Boolean(product.active);

      // Chỉ admin mới được phép thay đổi trạng thái bày bán.
      if (!isAdmin) {
        if (triesToChangeActive) {
          return next(
            createError(
              403,
              "Chỉ admin mới được phép thay đổi trạng thái bày bán",
            ),
          );
        }
        delete updateData.active;
      }

      if (isAdmin || isShopOwner) {
        await Product.findByIdAndUpdate(
          req.params.id,
          { $set: updateData },
          { new: true },
        );
        res.status(200).json("Cập nhật sản phẩm thành công");
      } else {
        return next(
          createError(403, "Bạn không được phép thực hiện chức năng này"),
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
      const isAdmin = req.user?.role === "admin";
      const isShopOwner =
        req.user?.role === "shop" && product.shopID === req.user?.id;

      if (isAdmin || isShopOwner) {
        await Product.findByIdAndDelete(req.params.id);
        res.status(200).json("Xóa sản phẩm thành công");
      } else {
        return next(
          createError(403, "Bạn không được phép thực hiện chức năng này"),
        );
      }
    }
  } catch (error) {
    next(error);
  }
};

export const getLastest = async (req, res, next) => {
  const limit = req.params.limit || 0;
  try {
    const products = await Product.find({ active: true });
    const list =
      limit > 0
        ? products.sort((a, b) => b.createdAt - a.createdAt).slice(0, limit)
        : products.sort((a, b) => b.createdAt - a.createdAt);
    res.status(200).json(list);
  } catch (error) {
    next(error);
  }
};
export const getHostest = async (req, res, next) => {
  const limit = req.params.limit || 0;
  try {
    const products = await Product.find({ active: true });
    const list =
      limit > 0
        ? products.sort((a, b) => b.outStock - a.outStock).slice(0, limit)
        : products.sort((a, b) => b.outStock - a.outStock);
    res.status(200).json(list);
  } catch (error) {
    next(error);
  }
};
