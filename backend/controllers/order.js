import { createError } from "../error.js";
import Order from "../models/Order.js";
import Product from "../models/Product.js";
const permistion = ["admin", "shipper"];
export const createOrder = async (req, res, next) => {
  try {
    const orderNumber = new Date().getTime();
    const newOrder = new Order({
      ...req.body,
      buyerId: req.user.id,
      orderNumber,
      tracking: {
        status: 0,
        desc: "tạo đơn thành công",
        time: new Date(),
      },
    });
    await newOrder.save();
    Promise.all(
      req.body.products.map(async (i) => {
        const p = await Product.findByIdAndUpdate(i.id, {
          $inc: { outStock: i.quantity },
        });
      })
    );
    res
      .status(200)
      .json({ message: "Tạo đơn hàng thành công", data: orderNumber });
  } catch (error) {
    next(createError(500, `Lỗi không xác định`));
  }
};

export const getOrders = async (req, res, next) => {
  try {
    const { limit } = req.query;
    let orders;
    
    if (req.user.role === "admin") {
      // Admin xem tất cả đơn hàng
      orders = await Order.find();
    } else if (req.user.role === "shipper") {
      // Shipper xem đơn được giao cho mình
      orders = await Order.find({ shipperId: req.user.id });
    } else if (req.user.role === "shop") {
      // Shop xem đơn chứa sản phẩm của mình
      orders = await Order.find({ products: { $elemMatch: { shopID: req.user.id } } });
    } else {
      // User (buyer) xem đơn của mình
      orders = await Order.find({ buyerId: req.user.id });
    }
    
    if (!orders || orders.length === 0) {
      res.status(403).json("Không có dữ liệu đơn hàng nào");
    }
    res
      .status(200)
      .json(
        limit
          ? orders.sort((a, b) => b.createdAt - a.createdAt).slice(0, limit)
          : orders.sort((a, b) => b.createdAt - a.createdAt)
      );
  } catch (error) {
    console.log(error);
    next(createError(500, `Lỗi không xác định`));
  }
};
export const getMyOrders = async (req, res, next) => {
  let myOrders = [];
  try {
    const orders = permistion.includes(req.user.role)
      ? await Order.find()
      : await Order.find({ products: { $elemMatch: { shopID: req.user.id } } });
    if (!orders) {
      res.status(403).json("Không có dữ liệu đơn hàng nào");
    }
    if (permistion.includes(req.user.role))
      return res
        .status(200)
        .json(orders.sort((a, b) => b.createdAt - a.createdAt));
    orders.map((o) => {
      const products = o.products.filter((i) => i.shopID === req.user.id);
      const order = {
        ...o._doc,
        products,
      };
      myOrders.push(order);
    });
    const list = myOrders.sort((a, b) => b.createdAt - a.createdAt);
    res.status(200).json(list);
  } catch (error) {
    next(createError(500, `Lỗi không xác định`));
  }
};
export const getOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json("Không tìm được dữ liệu đơn hàng tương ứng");
    } else {
      const isAdmin = req.user.role === "admin";
      const isBuyer = order.buyerId === req.user.id;
      const isShipper = req.user.role === "shipper" && order.shipperId === req.user.id;
      const isShopOwner = req.user.role === "shop" && order.products?.some(p => p.shopID === req.user.id);
      
      if (isAdmin || isBuyer || isShipper || isShopOwner) {
        res.status(200).json(order);
      } else {
        return res
          .status(403)
          .json("Bạn không được cấp quyền thực hiện chức năng");
      }
    }
  } catch (error) {
    next(createError(500, `Lỗi không xác định`));
  }
};
export const updateById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json("Đơn hàng không khả dụng");
    
    // Kiểm tra quyền
    const isAdmin = req.user.role === "admin";
    const isShipper = req.user.role === "shipper" && order.shipperId === req.user.id;
    const isShopOwner = req.user.role === "shop" && order.products?.some(p => p.shopID === req.user.id);
    
    if (!isAdmin && !isShipper && !isShopOwner) {
      return res
        .status(403)
        .json("Bạn không được cấp quyền thực hiện chức năng này!");
    }
    
    // Xác định dữ liệu được phép cập nhật
    let updateData = {};
    if (isAdmin) {
      // Admin cập nhật tất cả
      updateData = req.body;
    } else if (isShipper) {
      // Shipper chỉ được cập nhật status
      updateData = { status: req.body.status };
    } else if (isShopOwner) {
      // Shop không được cập nhật status, chỉ cập nhật thông tin khác
      const { status, ...otherData } = req.body;
      updateData = otherData;
    }
    
    await Order.findByIdAndUpdate(
      req.params.id,
      {
        $set: updateData,
        $push: {
          tracking: {
            status: req.body.status,
            desc: isShipper ? "Shipper cập nhật trạng thái" : isShopOwner ? "Shop cập nhật thông tin" : "Thay đổi trạng thái đơn hàng",
            time: new Date(),
          },
        },
      },
      { new: true }
    );
    res.status(200).json("Cập nhật đơn hàng thành công");
  } catch (error) {
    next(createError(500, `Lỗi không xác định`));
  }
};
export const cancel = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json("Đơn hàng không khả dụng");
    if (!permistion.includes(req.user.role) && req.user.id !== order.buyerId)
      return res
        .status(403)
        .json("Bạn không được cấp quyền thực hiện chức năng này!");
    if (order.status > 0)
      return res.status(403).json("Trạng thái đơn hàng không cho phép hủy đơn");
    await Order.findByIdAndUpdate(
      req.params.id,
      { $set: { status: 3 } },
      { new: true }
    );
    res.status(200).json("Hủy đơn hàng thành công");
  } catch (error) {
    next(createError(500, `Lỗi không xác định`));
  }
};
