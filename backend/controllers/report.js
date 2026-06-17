import Order from "../models/Order.js";
import Product from "../models/Product.js";
import User from "../models/User.js";
import GoodReceipt from "../models/GoodReceipt.js";
import Report from "../models/Report.js";

// Helper to get Vietnamese status name
const getStatusName = (status) => {
  const statuses = {
    0: "Chờ xác nhận",
    1: "Đang chuẩn bị",
    2: "Đang giao",
    3: "Giao thành công",
    4: "Đã hủy",
  };
  return statuses[status] || "Khác";
};

// GET /reports/admin
export const getAdminReport = async (req, res, next) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json("Bạn không có quyền truy cập báo cáo Admin");
    }

    // 1. User stats
    const totalUsers = await User.countDocuments();
    const usersByRoleRaw = await User.aggregate([
      { $group: { _id: "$role", count: { $sum: 1 } } }
    ]);
    const usersByRole = { user: 0, shop: 0, shipper: 0, admin: 0 };
    usersByRoleRaw.forEach(item => {
      if (item._id in usersByRole) {
        usersByRole[item._id] = item.count;
      }
    });

    const totalShops = usersByRole.shop;
    const activeShops = await User.countDocuments({ role: "shop", status: 1 });

    // 2. Product stats
    const totalProducts = await Product.countDocuments();

    // 3. Order stats
    const totalOrders = await Order.countDocuments();
    const successOrders = await Order.countDocuments({ status: 3 });
    const cancelledOrders = await Order.countDocuments({ status: 4 });

    // 4. Revenue stats
    const totalRevenueData = await Order.aggregate([
      { $match: { status: 3 } },
      { $group: { _id: null, total: { $sum: "$total" } } }
    ]);
    const totalRevenue = totalRevenueData[0]?.total || 0;

    // 5. Order Status Breakdown
    const ordersByStatusRaw = await Order.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } }
    ]);
    const ordersByStatus = Array.from({ length: 5 }, (_, i) => ({
      statusId: i,
      name: getStatusName(i),
      count: 0
    }));
    ordersByStatusRaw.forEach(item => {
      if (item._id >= 0 && item._id <= 4) {
        ordersByStatus[item._id].count = item.count;
      }
    });

    // 6. Top 5 Shops by Sales
    const topShops = await Order.aggregate([
      { $match: { status: 3 } },
      { $unwind: "$products" },
      {
        $group: {
          _id: "$products.shopID",
          shopName: { $first: "$products.shopName" },
          revenue: { $sum: "$products.lineTotal" },
          ordersCount: { $addToSet: "$_id" } // Unique orders
        }
      },
      {
        $project: {
          _id: 1,
          shopName: 1,
          revenue: 1,
          ordersCount: { $size: "$ordersCount" }
        }
      },
      { $sort: { revenue: -1 } },
      { $limit: 5 }
    ]);

    // 7. Monthly Revenue Trend (last 6 months)
    const startOf6MonthsAgo = new Date();
    startOf6MonthsAgo.setMonth(startOf6MonthsAgo.getMonth() - 5);
    startOf6MonthsAgo.setDate(1);
    startOf6MonthsAgo.setHours(0, 0, 0, 0);

    const monthlyRevenueRaw = await Order.aggregate([
      {
        $match: {
          status: 3,
          createdAt: { $gte: startOf6MonthsAgo }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" }
          },
          revenue: { $sum: "$total" },
          ordersCount: { $sum: 1 }
        }
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } }
    ]);

    // Format monthly trend data for chart
    const trendData = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      const year = d.getFullYear();
      const month = d.getMonth() + 1; // 1-indexed
      
      const matched = monthlyRevenueRaw.find(
        (item) => item._id.year === year && item._id.month === month
      );

      trendData.push({
        name: `Tháng ${month}/${year}`,
        revenue: matched ? matched.revenue : 0,
        orders: matched ? matched.ordersCount : 0,
      });
    }

    // 8. Update/Upsert the Report model daily snapshot
    const todayStr = new Date().toISOString().split("T")[0];
    await Report.findOneAndUpdate(
      { shopID: null, date: todayStr },
      {
        totalProducts,
        totalShop: totalShops,
        newShop: 0, // Placeholders or calculate if needed
        totalOrders,
        successOrders,
        failOrders: cancelledOrders,
        successValue: totalRevenue,
        visitorsCount: 0 // Placeholder
      },
      { upsert: true, new: true }
    );

    res.status(200).json({
      summary: {
        totalUsers,
        usersByRole,
        totalShops,
        activeShops,
        totalProducts,
        totalOrders,
        successOrders,
        cancelledOrders,
        totalRevenue
      },
      ordersByStatus,
      topShops,
      trendData
    });
  } catch (error) {
    res.status(500).json({ message: "Lỗi máy chủ khi lấy thống kê admin", error: error.message });
  }
};

// GET /reports/shop
export const getShopReport = async (req, res, next) => {
  try {
    if (req.user.role !== "shop") {
      return res.status(403).json("Bạn không có quyền truy cập báo cáo Shop");
    }

    const shopID = req.user.id;

    // 1. Product stats
    const totalProducts = await Product.countDocuments({ shopID });
    
    const productStockData = await Product.aggregate([
      { $match: { shopID } },
      {
        $group: {
          _id: null,
          totalInStock: { $sum: "$inStock" },
          totalOutStock: { $sum: "$outStock" },
          outOfStockCount: {
            $sum: { $cond: [{ $eq: ["$inStock", 0] }, 1, 0] }
          }
        }
      }
    ]);

    const totalInStock = productStockData[0]?.totalInStock || 0;
    const totalOutStock = productStockData[0]?.totalOutStock || 0;
    const outOfStockCount = productStockData[0]?.outOfStockCount || 0;

    // 2. Order stats for this shop
    const shopOrdersRaw = await Order.find({ "products.shopID": shopID });
    
    // Group orders containing this shop's products by status
    const ordersByStatusRaw = await Order.aggregate([
      { $match: { "products.shopID": shopID } },
      { $group: { _id: "$status", count: { $sum: 1 } } }
    ]);

    const ordersByStatus = Array.from({ length: 5 }, (_, i) => ({
      statusId: i,
      name: getStatusName(i),
      count: 0
    }));

    ordersByStatusRaw.forEach(item => {
      if (item._id >= 0 && item._id <= 4) {
        ordersByStatus[item._id].count = item.count;
      }
    });

    const totalOrders = ordersByStatus.reduce((acc, curr) => acc + curr.count, 0);
    const successOrders = ordersByStatus[3].count;
    const cancelledOrders = ordersByStatus[4].count;

    // 3. Revenue stats (sum of lineTotal of this shop's products in successful orders)
    const revenueData = await Order.aggregate([
      { $match: { status: 3, "products.shopID": shopID } },
      { $unwind: "$products" },
      { $match: { "products.shopID": shopID } },
      { $group: { _id: null, total: { $sum: "$products.lineTotal" } } }
    ]);
    const totalRevenue = revenueData[0]?.total || 0;

    // 4. Top 5 Selling Products of this Shop
    const topProducts = await Order.aggregate([
      { $match: { status: 3, "products.shopID": shopID } },
      { $unwind: "$products" },
      { $match: { "products.shopID": shopID } },
      {
        $group: {
          _id: "$products.productId",
          productName: { $first: "$products.productName" },
          img: { $first: "$products.img" },
          soldQty: { $sum: "$products.quantity" },
          revenue: { $sum: "$products.lineTotal" }
        }
      },
      { $sort: { soldQty: -1 } },
      { $limit: 5 }
    ]);

    // 5. Monthly Revenue Trend (last 6 months)
    const startOf6MonthsAgo = new Date();
    startOf6MonthsAgo.setMonth(startOf6MonthsAgo.getMonth() - 5);
    startOf6MonthsAgo.setDate(1);
    startOf6MonthsAgo.setHours(0, 0, 0, 0);

    const monthlyRevenueRaw = await Order.aggregate([
      {
        $match: {
          status: 3,
          "products.shopID": shopID,
          createdAt: { $gte: startOf6MonthsAgo }
        }
      },
      { $unwind: "$products" },
      { $match: { "products.shopID": shopID } },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" }
          },
          revenue: { $sum: "$products.lineTotal" },
          ordersCount: { $addToSet: "$_id" }
        }
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } }
    ]);

    const trendData = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      const year = d.getFullYear();
      const month = d.getMonth() + 1;
      
      const matched = monthlyRevenueRaw.find(
        (item) => item._id.year === year && item._id.month === month
      );

      trendData.push({
        name: `Tháng ${month}/${year}`,
        revenue: matched ? matched.revenue : 0,
        orders: matched ? matched.ordersCount.length : 0,
      });
    }

    // 6. Good Receipts Stats
    const totalReceipts = await GoodReceipt.countDocuments({ shopId: shopID });
    const receiptStatsRaw = await GoodReceipt.aggregate([
      { $match: { shopId: shopID } },
      {
        $group: {
          _id: null,
          totalQtyImported: { $sum: "$quantity" },
          totalQtySold: { $sum: "$soldQuantity" },
          expiredCount: {
            $sum: { $cond: [{ $ne: ["$expiredAt", null] }, 1, 0] }
          }
        }
      }
    ]);

    const totalQtyImported = receiptStatsRaw[0]?.totalQtyImported || 0;
    const totalQtySold = receiptStatsRaw[0]?.totalQtySold || 0;
    const expiredReceiptsCount = receiptStatsRaw[0]?.expiredCount || 0;

    // 7. Update/Upsert the Report model daily snapshot for this shop
    const todayStr = new Date().toISOString().split("T")[0];
    await Report.findOneAndUpdate(
      { shopID, date: todayStr },
      {
        totalProducts,
        totalOrders,
        successOrders,
        failOrders: cancelledOrders,
        successValue: totalRevenue,
        visitorsCount: 0 // Placeholder
      },
      { upsert: true, new: true }
    );

    res.status(200).json({
      summary: {
        totalProducts,
        totalInStock,
        totalOutStock,
        outOfStockCount,
        totalOrders,
        successOrders,
        cancelledOrders,
        totalRevenue
      },
      ordersByStatus,
      topProducts,
      trendData,
      inventoryStats: {
        totalReceipts,
        totalQtyImported,
        totalQtySold,
        expiredReceiptsCount
      }
    });
  } catch (error) {
    res.status(500).json({ message: "Lỗi máy chủ khi lấy thống kê shop", error: error.message });
  }
};
