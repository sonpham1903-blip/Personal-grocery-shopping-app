import { createError } from "../error.js";
import Order from "../models/Order.js";
import Product from "../models/Product.js";
import {
  allocateReceiptStock,
  releaseReceiptAllocations,
  recalculateProductStock,
} from "../utils/inventory.js";
const permistion = ["admin", "shipper"];
const ORDER_STATUS = {
  PENDING_CONFIRMATION: 0,
  PREPARING: 1,
  SHIPPING: 2,
  DELIVERED: 3,
  CANCELED: 4,
};

const getTrackingDescByStatus = (status) => {
  switch (status) {
    case ORDER_STATUS.PENDING_CONFIRMATION:
      return "Đơn hàng chờ xác nhận";
    case ORDER_STATUS.PREPARING:
      return "Người bán đã xác nhận, hàng đang chuẩn bị";
    case ORDER_STATUS.SHIPPING:
      return "Đơn hàng đã bàn giao cho đơn vị vận chuyển";
    case ORDER_STATUS.DELIVERED:
      return "Đơn hàng đã giao thành công";
    case ORDER_STATUS.CANCELED:
      return "Đơn hàng đã bị hủy";
    default:
      return "Cập nhật trạng thái đơn hàng";
  }
};

export const createOrder = async (req, res, next) => {
  try {
    console.log("[orders:create] incoming request", {
      userId: req.user?.id,
      role: req.user?.role,
      body: {
        ...req.body,
        products: Array.isArray(req.body?.products) ? req.body.products.map((item) => ({
          productId: item.id || item.productId,
          quantity: item.quantity,
          shopID: item.shopID,
        })) : [],
      },
    });

    const rawProducts = Array.isArray(req.body.products) ? req.body.products : [];

    if (rawProducts.length === 0) {
      return res.status(400).json("Danh sách sản phẩm không hợp lệ");
    }

    const buyerName =
      req.body.buyerName || req.user.fullname || req.user.displayName || req.user.username;
    const buyerPhone = req.body.buyerPhone || req.body.phone || req.user.phone || "";
    const toCity = req.body.toCity || req.body.city || "";
    const toDistrict = req.body.toDistrict || req.body.district || "";
    const toWard = req.body.toWard || req.body.ward || "";
    const toAddress = req.body.toAddress || req.body.shippingAddress || req.user.address || "";

    if (!buyerName || !buyerPhone || !toCity || !toDistrict || !toWard || !toAddress) {
      return res.status(400).json("Vui lòng điền đầy đủ thông tin giao hàng");
    }

    const normalizedProducts = [];
    let total = 0;
    const allocatedReceiptBatches = [];
    const updatedProductItems = [];

    for (const item of rawProducts) {
      const productId = item.id || item.productId;
      const quantity = Number(item.quantity || 0);

      console.log("[orders:create] validating item", { productId, quantity });

      if (!productId || quantity <= 0) {
        return res.status(400).json("Sản phẩm trong giỏ hàng không hợp lệ");
      }

      const product = await Product.findById(productId);
      if (!product) {
        return res.status(404).json("Không tìm thấy sản phẩm trong đơn hàng");
      }

      await recalculateProductStock(productId);
      const freshProduct = await Product.findById(productId);

      const availableStock = Number(freshProduct?.inStock || 0);
      if (availableStock < quantity) {
        console.warn("[orders:create] insufficient stock", {
          productId,
          productName: product.productName,
          availableStock,
          requestedQuantity: quantity,
        });
        return res
          .status(400)
          .json(`Sản phẩm ${product.productName} không đủ tồn kho`);
      }

      const unitPrice = Number(item.price ?? item.currentPrice ?? freshProduct?.currentPrice ?? product.currentPrice ?? 0);
      const lineTotal = unitPrice * quantity;
      const receiptAllocations = await allocateReceiptStock(product._id.toString(), quantity);

      console.log("[orders:create] FIFO allocations", {
        productId: product._id.toString(),
        quantity,
        receiptAllocations,
      });
      allocatedReceiptBatches.push(...receiptAllocations);

      normalizedProducts.push({
        productId: product._id.toString(),
        productName: product.productName,
        img: item.img || product.imgs?.[0] || product.thumbnail || "",
        shopID: item.shopID || product.shopID,
        shopName: item.shopName || product.shopName || "Shop",
        quantity,
        unitPrice,
        currentPrice: unitPrice,
        lineTotal,
        receiptAllocations,
      });

      total += lineTotal;
    }

    const orderNumber = String(Date.now());
    const newOrder = new Order({
      buyerId: req.user.id,
      buyerName,
      buyerPhone,
      toCity,
      toDistrict,
      toWard,
      toAddress,
      note: req.body.note || "",
      shipMode: ["ems", "vnpost", "best"].includes(req.body.shipMode)
        ? req.body.shipMode
        : "ems",
      payment: req.body.payment === "bank" ? "bank" : "cod",
      total,
      products: normalizedProducts,
      orderNumber,
      tracking: [
        {
          status: ORDER_STATUS.PENDING_CONFIRMATION,
          desc: getTrackingDescByStatus(ORDER_STATUS.PENDING_CONFIRMATION),
          time: new Date(),
        },
      ],
    });

    await newOrder.save();

    console.log("[orders:create] order draft saved", {
      orderId: newOrder._id.toString(),
      orderNumber,
      products: normalizedProducts.length,
      total,
    });

    try {
      await Promise.all(
        normalizedProducts.map(async (item) => {
          await Product.findByIdAndUpdate(item.productId, {
            $inc: { outStock: item.quantity, inStock: -item.quantity },
          });
          updatedProductItems.push(item);
          console.log("[orders:create] product stock updated", {
            productId: item.productId,
            quantity: item.quantity,
          });
        }),
      );
    } catch (stockError) {
      console.error("[orders:create] product stock update failed, rolling back", stockError);
      await Promise.all(
        updatedProductItems.map(async (item) => {
          await Product.findByIdAndUpdate(item.productId, {
            $inc: { outStock: -item.quantity, inStock: item.quantity },
          });
          console.log("[orders:create] product stock rollback applied", {
            productId: item.productId,
            quantity: item.quantity,
          });
        }),
      );
      throw stockError;
    }

    console.log("[orders:create] order completed successfully", {
      orderNumber,
      orderId: newOrder._id.toString(),
    });

    res
      .status(200)
      .json({ message: "Tạo đơn hàng thành công", data: orderNumber });
  } catch (error) {
    console.error("[orders:create] failed", {
      message: error?.message,
      status: error?.status,
      stack: error?.stack,
    });

    if (error && allocatedReceiptBatches.length > 0) {
      await releaseReceiptAllocations(allocatedReceiptBatches);
      console.log("[orders:create] receipt allocations rolled back", {
        count: allocatedReceiptBatches.length,
      });
    }

    if (error?.status) {
      return next(error);
    }

    return next(createError(500, error.message || `Lỗi không xác định`));
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
      const products = o.products.filter(
        (i) => String(i.shopID) === String(req.user.id)
      );
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
      const isShopOwner =
        req.user.role === "shop" &&
        order.products?.some((p) => String(p.shopID) === String(req.user.id));
      
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

    const isAdmin = req.user.role === "admin";
    const isShipper = req.user.role === "shipper" && order.shipperId === req.user.id;
    const isBuyer = String(order.buyerId) === String(req.user.id);
    const isShopOwner =
      req.user.role === "shop" &&
      order.products?.some((p) => String(p.shopID) === String(req.user.id));

    if (!isAdmin && !isShipper && !isShopOwner && !isBuyer) {
      return res
        .status(403)
        .json("Bạn không được cấp quyền thực hiện chức năng này!");
    }

    const requestedStatus =
      req.body.status === undefined ? undefined : Number(req.body.status);

    if (Number.isNaN(requestedStatus)) {
      return res.status(400).json("Trạng thái đơn hàng không hợp lệ");
    }

    if (isShopOwner) {
      if (requestedStatus !== ORDER_STATUS.PREPARING) {
        return res
          .status(403)
          .json("Người bán chỉ được xác nhận đơn hàng sang trạng thái đang chuẩn bị");
      }
      if (order.status !== ORDER_STATUS.PENDING_CONFIRMATION) {
        return res
          .status(400)
          .json("Chỉ có thể xác nhận đơn hàng đang chờ xác nhận");
      }
    }

    if (isShipper) {
      if (requestedStatus !== ORDER_STATUS.DELIVERED) {
        return res.status(403).json("Shipper chỉ được phép xác nhận giao xong");
      }
      if (order.status !== ORDER_STATUS.SHIPPING) {
        return res
          .status(400)
          .json("Chỉ có thể xác nhận giao xong khi đơn đang giao");
      }
    }

    if (isBuyer) {
      if (requestedStatus !== ORDER_STATUS.DELIVERED) {
        return res
          .status(403)
          .json("Người mua chỉ được phép xác nhận đã nhận hàng");
      }

      if (order.status !== ORDER_STATUS.SHIPPING) {
        return res
          .status(400)
          .json("Chỉ có thể xác nhận đã nhận hàng khi đơn đang giao");
      }
    }

    if (
      requestedStatus !== undefined &&
      !Object.values(ORDER_STATUS).includes(requestedStatus)
    ) {
      return res.status(400).json("Trạng thái đơn hàng không hợp lệ");
    }

    const updateData = isAdmin
      ? { ...req.body }
      : {
          status: requestedStatus,
        };

    if (requestedStatus === undefined) {
      return res.status(400).json("Thiếu trạng thái cần cập nhật");
    }

    updateData.status = requestedStatus;

    const updatePayload = {
      $set: updateData,
    };

    if (order.status !== requestedStatus) {
      updatePayload.$push = {
        tracking: {
          status: requestedStatus,
          desc: getTrackingDescByStatus(requestedStatus),
          time: new Date(),
        },
      };
    }

    await Order.findByIdAndUpdate(
      req.params.id,
      updatePayload,
      { new: true }
    );
    res.status(200).json("Cập nhật đơn hàng thành công");
  } catch (error) {
    next(createError(500, `Lỗi không xác định`));
  }
};
export const handover = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json("Đơn hàng không khả dụng");

    const isAdmin = req.user.role === "admin";
    const isShopOwner =
      req.user.role === "shop" &&
      order.products?.some((p) => String(p.shopID) === String(req.user.id));

    if (!isAdmin && !isShopOwner) {
      return res
        .status(403)
        .json("Bạn không được cấp quyền thực hiện chức năng này!");
    }

    if (order.status !== ORDER_STATUS.PREPARING) {
      return res
        .status(400)
        .json("Chỉ có thể bàn giao vận chuyển khi đơn đang chuẩn bị hàng");
    }

    const carrierName = String(req.body.carrierName || "").trim();
    const trackingCode = String(req.body.trackingCode || "").trim();
    const shippingOrderCode = String(req.body.shippingOrderCode || "").trim();
    const shippingNote = String(req.body.note || "").trim();

    if (!carrierName || !trackingCode) {
      return res
        .status(400)
        .json("Vui lòng nhập đơn vị vận chuyển và mã vận đơn");
    }

    await Order.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          status: ORDER_STATUS.SHIPPING,
          shippingInfo: {
            carrierName,
            trackingCode,
            shippingOrderCode,
            note: shippingNote,
            handedOverAt: new Date(),
          },
        },
        $push: {
          tracking: {
            status: ORDER_STATUS.SHIPPING,
            desc: `${getTrackingDescByStatus(ORDER_STATUS.SHIPPING)} (${carrierName} - ${trackingCode})`,
            time: new Date(),
          },
        },
      },
      { new: true }
    );

    res.status(200).json("Bàn giao vận chuyển thành công");
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
    if (order.status >= ORDER_STATUS.DELIVERED)
      return res.status(403).json("Đơn hàng đã giao, không thể hủy đơn");
    if (!permistion.includes(req.user.role) && order.status > 0)
      return res.status(403).json("Trạng thái đơn hàng không cho phép hủy đơn");

    await Promise.all(
      (order.products || []).map(async (item) => {
        const productId = item.productId || item.id;

        if (!productId) {
          return;
        }

        await Product.findByIdAndUpdate(productId, {
          $inc: {
            outStock: -Number(item.quantity || 0),
            inStock: Number(item.quantity || 0),
          },
        });

        if (Array.isArray(item.receiptAllocations) && item.receiptAllocations.length > 0) {
          await releaseReceiptAllocations(item.receiptAllocations);
        }
      })
    );

    await Order.findByIdAndUpdate(
      req.params.id,
      {
        $set: { status: ORDER_STATUS.CANCELED },
        $push: {
          tracking: {
            status: ORDER_STATUS.CANCELED,
            desc: getTrackingDescByStatus(ORDER_STATUS.CANCELED),
            time: new Date(),
          },
        },
      },
      { new: true }
    );
    res.status(200).json("Hủy đơn hàng thành công");
  } catch (error) {
    next(createError(500, `Lỗi không xác định`));
  }
};
