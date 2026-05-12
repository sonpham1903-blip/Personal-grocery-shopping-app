import Category from "../models/Category.js";
import {createError} from "../error.js";

const CATEGORY_CODE_PREFIX = "CAT";
const CATEGORY_CODE_PADDING = 3;

const getNextCategoryCode = async () => {
  const cats = await Category.find({
    code: new RegExp(`^${CATEGORY_CODE_PREFIX}\\d+$`),
  }).select(["code"]);

  const maxCodeNumber = cats.reduce((max, cat) => {
    const numericPart = Number(
      String(cat.code || "").replace(CATEGORY_CODE_PREFIX, "")
    );
    if (!Number.isFinite(numericPart)) return max;
    return numericPart > max ? numericPart : max;
  }, 0);

  return `${CATEGORY_CODE_PREFIX}${String(maxCodeNumber + 1).padStart(
    CATEGORY_CODE_PADDING,
    "0"
  )}`;
};

export const create = async (req, res, next) => {
  try {
    const nextCode = await getNextCategoryCode();
    const { code, ...payload } = req.body || {};
    const newCat = new Category({ ...payload, code: nextCode });
    await newCat.save();
    res.status(200).json("tạo mới danh mục thành công");
  } catch (error) {
    next(createError(403, "Tạo mới danh mục thất bại"));
  }
};

export const getAll = async (req, res, next) => {
  try {
    const cats = await Category.find();
    if (!cats) return res.status(403).json("Không có dữ liệu danh mục");
    res.status(200).json(cats);
  } catch (error) {
    next(createError(403, "Không có dữ liệu danh mục"));
  }
};

export const get = async (req, res, next) => {
  try {
    const cats = await Category.find({ status: 1 });
    if (!cats) return res.status(403).json("Không có dữ liệu danh mục");
    res.status(200).json(cats);
  } catch (error) {
    next(createError(403, "Không có dữ liệu danh mục"));
  }
};

export const getById = async (req, res, next) => {
  try {
    const cat = await Category.findById(req.params.id);
    if (!cat) return res.status(403).json("Không tìm được danh mục chỉ định");
    res.status(200).json(cat);
  } catch (error) {
    next(createError(403, "Không tìm được danh mục chỉ định"));
  }
};

export const updateById = async (req, res, next) => {
  try {
    const cat = await Category.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!cat) return res.status(403).json("Không tìm được danh mục chỉ định");
    res.status(200).json("Cập nhật danh mục thành công");
  } catch (error) {
    next(createError(403, "Cập nhật danh mục thất bại"));
  }
};

export const deleteById = async (req, res, next) => {
  try {
    const cat = await Category.findByIdAndDelete(req.params.id);
    if (!cat) return res.status(403).json("Không tìm được danh mục chỉ định");
    res.status(200).json("Xóa danh mục thành công");
  } catch (error) {
    next(createError(403, "Xóa danh mục thất bại"));
  }
};
