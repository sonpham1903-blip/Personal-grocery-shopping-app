import Category from "../models/Category.js";
import {createError} from "../error.js";

export const create = async (req, res, next) => {
  try {
    const newCat = new Category(req.body);
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
