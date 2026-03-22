import Category from "../models/Category.js";
import mongoose from "mongoose";

export const create = async (req, res, next) => {
  try {
    const newCat = new Category(req.body);
    await newCat.save();
    res.status(200).json("tạo mới danh mục thành công");
  } catch (error) {
    next(error);
  }
};

export const getAll = async (req, res, next) => {
  try {
    const cats = await Category.find();
    if (!cats) return res.status(403).json("Không có dữ liệu danh mục");
    res.status(200).json(cats);
  } catch (error) {
    next(error);
  }
};

export const get = async (req, res, next) => {
  try {
    const cats = await Category.find({ status: 1 });
    if (!cats) return res.status(403).json("Không có dữ liệu danh mục");
    res.status(200).json(cats);
  } catch (error) {
    next(error);
  }
};

export const getById = async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json("ID không hợp lệ");
    }
    const cat = await Category.findById(req.params.id);
    if (!cat) return res.status(404).json("Không tìm được danh mục chỉ định");
    res.status(200).json(cat);
  } catch (error) {
    next(error);
  }
};

export const updateById = async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json("ID không hợp lệ");
    }
    const cat = await Category.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!cat) return res.status(404).json("Không tìm được danh mục chỉ định");
    res.status(200).json("Cập nhật danh mục thành công");
  } catch (error) {
    next(error);
  }
};

export const deleteById = async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json("ID không hợp lệ");
    }
    const cat = await Category.findByIdAndDelete(req.params.id);
    if (!cat) return res.status(404).json("Không tìm được danh mục chỉ định");
    res.status(200).json("Xóa danh mục thành công");
  } catch (error) {
    next(error);
  }
};
