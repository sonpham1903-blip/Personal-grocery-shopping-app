import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import ktsRequest from "../../ultis/ktsrequest";
import { vnd } from "../../ultis/ktsFunc";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from "recharts";

const COLORS = [
  "#3B82F6",
  "#10B981",
  "#F59E0B",
  "#EF4444",
  "#8B5CF6",
  "#EC4899",
];

const Reports = () => {
  const { currentUser } = useSelector((state) => state.user);
  const { token, role } = currentUser;

  const isAdmin = role === "admin";
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reportData, setReportData] = useState(null);

  useEffect(() => {
    const fetchReport = async () => {
      setLoading(true);
      setError(null);
      try {
        const endpoint = isAdmin ? "/reports/admin" : "/reports/shop";
        const res = await ktsRequest.get(endpoint, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        setReportData(res.data);
      } catch (err) {
        console.error("Lỗi khi tải báo cáo:", err);
        setError(err.response?.data || "Không thể tải báo cáo thống kê");
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, [isAdmin, token]);

  if (loading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-green-500 border-t-transparent"></div>
          <p className="text-gray-600 font-medium">
            Đang tải dữ liệu thống kê...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-[80vh] items-center justify-center p-4">
        <div className="max-w-md rounded-lg bg-red-50 p-6 text-center shadow-md">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-600">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="h-6 w-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z"
              />
            </svg>
          </div>
          <h3 className="mb-2 text-lg font-bold text-red-800">Đã xảy ra lỗi</h3>
          <p className="text-sm text-red-600 mb-4">
            {typeof error === "string" ? error : JSON.stringify(error)}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="rounded bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 transition"
          >
            Tải lại trang
          </button>
        </div>
      </div>
    );
  }

  if (!reportData) return null;

  // Custom tooltip for charts
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="rounded-lg border border-gray-200 bg-white p-3 shadow-md">
          <p className="font-semibold text-gray-800 mb-1">{label}</p>
          {payload.map((p, idx) => (
            <p
              key={idx}
              className="text-sm font-medium"
              style={{ color: p.color }}
            >
              {p.name}:{" "}
              {p.name.includes("Doanh thu") ? vnd(p.value) : `${p.value} đơn`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  // Pie chart helper label
  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
    index,
  }) => {
    const RADIAN = Math.PI / 185;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return percent > 0.05 ? (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
        className="text-xs font-bold"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    ) : null;
  };

  const { summary, ordersByStatus, trendData } = reportData;

  // Order status distribution data for PieChart
  const orderStatusPieData = ordersByStatus
    .filter((status) => status.count > 0)
    .map((status) => ({
      name: status.name,
      value: status.count,
    }));

  return (
    <div className="w-full p-4 space-y-6 bg-gray-100 min-h-screen">
      {/* Title */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-gray-200 pb-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-gray-800">
            {isAdmin
              ? "Báo cáo Thống kê Hệ thống"
              : `Thống kê Kinh doanh - ${currentUser.displayName || "Cửa hàng"}`}
          </h2>
          <p className="text-gray-500 text-sm mt-1">
            {isAdmin
              ? "Tổng quan hoạt động kinh doanh toàn sàn thương mại điện tử"
              : "Chi tiết doanh thu, đơn hàng và lượng hàng tồn kho của shop"}
          </p>
        </div>
        <div className="mt-3 md:mt-0 flex gap-2">
          <span className="inline-flex items-center rounded-md bg-white border border-gray-300 px-3 py-1 text-xs text-gray-700">
            Hôm nay: {new Date().toLocaleDateString("vi-VN")}
          </span>
        </div>
      </div>

      {/* Grid: Overview Cards */}
      {isAdmin ? (
        /* Admin Overview Grid */
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {/* Card 1: Total Revenue */}
          <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 p-5 text-white shadow-md transition-transform duration-300 hover:-translate-y-1">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-semibold uppercase tracking-wider text-blue-100">
                  Tổng doanh thu sàn
                </p>
                <h3 className="mt-2 text-2xl md:text-3xl font-extrabold">
                  {vnd(summary.totalRevenue)}
                </h3>
              </div>
              <div className="rounded-lg bg-blue-400 bg-opacity-30 p-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="h-6 w-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5h.007m-.007 3h.007m-.007 3h.007m-.007 3h.007m-.007 3h.007m-.007 3h.007M9 3h.008v.008H9V3Zm0 3h.008v.008H9V6Zm0 3h.008v.008H9V9Zm0 3h.008v.008H9v-.008Zm0 3h.008v.008H9v-.008Zm0 3h.008v.008H9v-.008Zm3-6h.008v.008H12V9Zm0 3h.008v.008H12v-.008Zm0 3h.008v.008H12v-.008Zm3-3h.008v.008H15V12Zm0 3h.008v.008H15v-.008Zm3-3h.008v.008H18V12Zm0 3h.008v.008H18v-.008Zm0 3h.008v.008H18v-.008Zm-6-12h.008v.008H12V3Zm0 3h.008v.008H12V6Zm3-3h.008v.008H15V3Zm0 3h.008v.008H15V6Zm3-3h.008v.008H18V3Zm0 3h.008v.008H18V6ZM3 18.75h18"
                  />
                </svg>
              </div>
            </div>
            <p className="mt-4 text-xs text-blue-100 flex items-center gap-1">
              <span>Đơn hàng đã bàn giao & thanh toán thành công</span>
            </p>
          </div>

          {/* Card 2: Total Users */}
          <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-600 p-5 text-white shadow-md transition-transform duration-300 hover:-translate-y-1">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-semibold uppercase tracking-wider text-indigo-100">
                  Tổng người dùng
                </p>
                <h3 className="mt-2 text-2xl md:text-3xl font-extrabold">
                  {summary.totalUsers}
                </h3>
              </div>
              <div className="rounded-lg bg-indigo-400 bg-opacity-30 p-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="h-6 w-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z"
                  />
                </svg>
              </div>
            </div>
            <div className="mt-4 text-xs text-indigo-100 flex flex-wrap gap-x-2">
              <span>Khách: {summary.usersByRole.user}</span>
              <span>•</span>
              <span>Shop: {summary.usersByRole.shop}</span>
              <span>•</span>
              <span>Shipper: {summary.usersByRole.shipper}</span>
            </div>
          </div>

          {/* Card 3: Active Shops */}
          <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 p-5 text-white shadow-md transition-transform duration-300 hover:-translate-y-1">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-semibold uppercase tracking-wider text-emerald-100">
                  Cửa hàng liên kết
                </p>
                <h3 className="mt-2 text-2xl md:text-3xl font-extrabold">
                  {summary.totalShops}
                </h3>
              </div>
              <div className="rounded-lg bg-emerald-400 bg-opacity-30 p-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="h-6 w-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13.5 21v-7.5a.75.75 0 0 1 .75-.75h3a.75.75 0 0 1 .75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349M3.75 21V9.349m0 0a3.001 3.001 0 0 0 3.75-.615 3.001 3.001 0 0 0 3.75.615m-7.5 0h7.5m3-3.75h.008v.008H12V5.25Zm0 3h.008v.008H12v-.008Zm3-3h.008v.008H15V5.25Zm0 3h.008v.008H15v-.008Zm3-3h.008v.008H18V5.25Zm0 3h.008v.008H18v-.008Zm-12-3h.008v.008H6V5.25Zm0 3h.008v.008H6v-.008Zm3-3h.008v.008H9V5.25Zm0 3h.008v.008H9v-.008Z"
                  />
                </svg>
              </div>
            </div>
            <p className="mt-4 text-xs text-emerald-100">
              Hoạt động: {summary.activeShops} | Đang khóa:{" "}
              {summary.totalShops - summary.activeShops}
            </p>
          </div>

          {/* Card 4: Total Orders */}
          <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 p-5 text-white shadow-md transition-transform duration-300 hover:-translate-y-1">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-semibold uppercase tracking-wider text-amber-100">
                  Tổng đơn hàng
                </p>
                <h3 className="mt-2 text-2xl md:text-3xl font-extrabold">
                  {summary.totalOrders}
                </h3>
              </div>
              <div className="rounded-lg bg-amber-400 bg-opacity-30 p-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="h-6 w-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
                  />
                </svg>
              </div>
            </div>
            <p className="mt-4 text-xs text-amber-100">
              Giao xong: {summary.successOrders} (
              {summary.totalOrders > 0
                ? ((summary.successOrders / summary.totalOrders) * 100).toFixed(
                    1,
                  )
                : 0}
              %) | Hủy: {summary.cancelledOrders}
            </p>
          </div>
        </div>
      ) : (
        /* Shop Overview Grid */
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {/* Card 1: Shop Revenue */}
          <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-green-600 to-green-700 p-5 text-white shadow-md transition-transform duration-300 hover:-translate-y-1">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-semibold uppercase tracking-wider text-green-100">
                  Doanh thu Shop
                </p>
                <h3 className="mt-2 text-2xl md:text-3xl font-extrabold">
                  {vnd(summary.totalRevenue)}
                </h3>
              </div>
              <div className="rounded-lg bg-green-500 bg-opacity-30 p-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="h-6 w-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 6v12m-3-2.818.75-1.56a1.5 1.5 0 0 1 2.25 0l.75 1.56M9 12h6m-6 0a3 3 0 1 1 6 0m-6 0a3 3 0 1 0 6 0M4 19.5h16"
                  />
                </svg>
              </div>
            </div>
            <p className="mt-4 text-xs text-green-100">
              Chỉ tính phần doanh thu sản phẩm của shop
            </p>
          </div>

          {/* Card 2: Total Orders of Shop */}
          <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 p-5 text-white shadow-md transition-transform duration-300 hover:-translate-y-1">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-semibold uppercase tracking-wider text-blue-100">
                  Đơn hàng của Shop
                </p>
                <h3 className="mt-2 text-2xl md:text-3xl font-extrabold">
                  {summary.totalOrders}
                </h3>
              </div>
              <div className="rounded-lg bg-blue-400 bg-opacity-30 p-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="h-6 w-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"
                  />
                </svg>
              </div>
            </div>
            <p className="mt-4 text-xs text-blue-100">
              Giao xong: {summary.successOrders} | Đã hủy:{" "}
              {summary.cancelledOrders}
            </p>
          </div>

          {/* Card 3: Shop Products in Stock */}
          <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 p-5 text-white shadow-md transition-transform duration-300 hover:-translate-y-1">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-semibold uppercase tracking-wider text-purple-100">
                  Tổng sản phẩm
                </p>
                <h3 className="mt-2 text-2xl md:text-3xl font-extrabold">
                  {summary.totalProducts}
                </h3>
              </div>
              <div className="rounded-lg bg-purple-400 bg-opacity-30 p-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="h-6 w-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z"
                  />
                </svg>
              </div>
            </div>
            <p className="mt-4 text-xs text-purple-100">
              Tổng số lượng tồn: {summary.totalInStock} sản phẩm
            </p>
          </div>

          {/* Card 4: Products Out of Stock */}
          <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-rose-500 to-rose-600 p-5 text-white shadow-md transition-transform duration-300 hover:-translate-y-1">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-semibold uppercase tracking-wider text-rose-100">
                  Sản phẩm hết hàng
                </p>
                <h3 className="mt-2 text-2xl md:text-3xl font-extrabold">
                  {summary.outOfStockCount}
                </h3>
              </div>
              <div className="rounded-lg bg-rose-400 bg-opacity-30 p-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="h-6 w-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
                  />
                </svg>
              </div>
            </div>
            <p className="mt-4 text-xs text-rose-100">
              Cần nhập hàng bổ sung để tiếp tục bán
            </p>
          </div>
        </div>
      )}

      {/* Grid: Charts */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Main Revenue Trend Chart */}
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-bold text-gray-800">
              Biểu đồ Doanh thu (6 tháng gần đây)
            </h3>
            <span className="text-xs text-gray-500">Đơn vị: VNĐ</span>
          </div>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={trendData}
                margin={{ top: 10, right: 30, left: 10, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#E5E7EB"
                />
                <XAxis
                  dataKey="name"
                  stroke="#9CA3AF"
                  fontSize={11}
                  tickLine={false}
                />
                <YAxis
                  stroke="#9CA3AF"
                  fontSize={11}
                  tickLine={false}
                  tickFormatter={(val) =>
                    val >= 1000000
                      ? `${val / 1000000}M`
                      : val >= 1000
                        ? `${val / 1000}k`
                        : val
                  }
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend iconType="circle" />
                <Area
                  name="Doanh thu"
                  type="monotone"
                  dataKey="revenue"
                  stroke="#10B981"
                  fillOpacity={1}
                  fill="url(#colorRevenue)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Order Status Distribution Chart */}
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <h3 className="text-lg font-bold text-gray-800 mb-4">
            Trạng thái đơn hàng
          </h3>
          <div className="h-60 w-full flex items-center justify-center">
            {orderStatusPieData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={orderStatusPieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={renderCustomizedLabel}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {orderStatusPieData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value, name) => [`${value} đơn hàng`, name]}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-gray-400 text-sm italic">
                Chưa có dữ liệu đơn hàng
              </div>
            )}
          </div>
          {/* Legend indicators */}
          <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
            {ordersByStatus.map((status, index) => (
              <div
                key={status.statusId}
                className="flex items-center gap-1.5 text-gray-700"
              >
                <span
                  className="h-3 w-3 rounded-sm inline-block"
                  style={{
                    backgroundColor: COLORS[status.statusId % COLORS.length],
                  }}
                ></span>
                <span className="truncate">
                  {status.name} ({status.count})
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Grid: Secondary analytics (Top Lists, Inventory details) */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left/Middle area: Top entities */}
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm lg:col-span-2">
          {isAdmin ? (
            /* Top Shops List for Admin */
            <>
              <h3 className="text-lg font-bold text-gray-800 mb-4">
                Top 5 cửa hàng doanh thu cao nhất
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-gray-200 text-sm font-semibold text-gray-600 bg-gray-50">
                      <th className="py-3 px-4 rounded-l-lg">Tên Cửa Hàng</th>
                      <th className="py-3 px-4 text-center">Số đơn hàng</th>
                      <th className="py-3 px-4 text-right rounded-r-lg">
                        Doanh Thu mang lại
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-sm">
                    {reportData.topShops?.length > 0 ? (
                      reportData.topShops.map((shop, i) => (
                        <tr
                          key={shop._id}
                          className="hover:bg-gray-50 transition"
                        >
                          <td className="py-3.5 px-4 font-semibold text-gray-800 flex items-center gap-2">
                            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-green-100 text-xs font-bold text-green-700">
                              {i + 1}
                            </span>
                            {shop.shopName || "Tên Shop ẩn"}
                          </td>
                          <td className="py-3.5 px-4 text-center text-gray-600">
                            {shop.ordersCount} đơn
                          </td>
                          <td className="py-3.5 px-4 text-right font-bold text-green-600">
                            {vnd(shop.revenue)}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan="3"
                          className="py-6 text-center text-gray-400 italic"
                        >
                          Chưa có dữ liệu giao dịch thành công
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </>
          ) : (
            /* Top Products List for Shop Owners */
            <>
              <h3 className="text-lg font-bold text-gray-800 mb-4">
                Top 5 sản phẩm bán chạy nhất
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-gray-200 text-sm font-semibold text-gray-600 bg-gray-50">
                      <th className="py-3 px-4 rounded-l-lg">Sản phẩm</th>
                      <th className="py-3 px-4 text-center">Số lượng bán</th>
                      <th className="py-3 px-4 text-right rounded-r-lg">
                        Tổng doanh thu
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-sm">
                    {reportData.topProducts?.length > 0 ? (
                      reportData.topProducts.map((p, i) => (
                        <tr key={p._id} className="hover:bg-gray-50 transition">
                          <td className="py-3.5 px-4 font-semibold text-gray-800 flex items-center gap-3">
                            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-green-100 text-xs font-bold text-green-700">
                              {i + 1}
                            </span>
                            <img
                              src={p.img || "https://placehold.co/40"}
                              alt=""
                              className="h-10 w-10 rounded object-cover border border-gray-200"
                            />
                            <span
                              className="truncate max-w-[200px]"
                              title={p.productName}
                            >
                              {p.productName}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-center text-gray-600">
                            {p.soldQty} sản phẩm
                          </td>
                          <td className="py-3.5 px-4 text-right font-bold text-green-600">
                            {vnd(p.revenue)}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan="3"
                          className="py-6 text-center text-gray-400 italic"
                        >
                          Chưa có sản phẩm nào bán ra
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>

        {/* Right side: Extra statistics (Shop Inventory details or Admin User distribution) */}
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-bold text-gray-800 mb-4">
              {isAdmin ? "Cấu trúc Người dùng" : "Thống kê Nhập xuất kho"}
            </h3>

            {isAdmin ? (
              /* User Role distribution details for Admin */
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-blue-500"></span>
                    <span className="text-sm font-medium text-gray-600">
                      Khách mua hàng (User)
                    </span>
                  </div>
                  <span className="text-sm font-bold text-gray-800">
                    {summary.usersByRole.user} tài khoản
                  </span>
                </div>
                <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-green-500"></span>
                    <span className="text-sm font-medium text-gray-600">
                      Cửa hàng (Shop)
                    </span>
                  </div>
                  <span className="text-sm font-bold text-gray-800">
                    {summary.usersByRole.shop} tài khoản
                  </span>
                </div>
                <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-orange-500"></span>
                    <span className="text-sm font-medium text-gray-600">
                      Người giao hàng (Shipper)
                    </span>
                  </div>
                  <span className="text-sm font-bold text-gray-800">
                    {summary.usersByRole.shipper} tài khoản
                  </span>
                </div>
                <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-purple-500"></span>
                    <span className="text-sm font-medium text-gray-600">
                      Quản trị viên (Admin)
                    </span>
                  </div>
                  <span className="text-sm font-bold text-gray-800">
                    {summary.usersByRole.admin} tài khoản
                  </span>
                </div>
              </div>
            ) : (
              /* Good Receipts details for Shop */
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                  <span className="text-sm font-medium text-gray-600">
                    Tổng số lô hàng nhập (Phiếu nhập)
                  </span>
                  <span className="text-sm font-bold text-gray-800">
                    {reportData.inventoryStats.totalReceipts} phiếu
                  </span>
                </div>
                <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                  <span className="text-sm font-medium text-gray-600">
                    Tổng sản phẩm đã nhập
                  </span>
                  <span className="text-sm font-bold text-gray-800">
                    {reportData.inventoryStats.totalQtyImported} SP
                  </span>
                </div>
                <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                  <span className="text-sm font-medium text-gray-600">
                    Đã tiêu thụ qua đơn hàng
                  </span>
                  <span className="text-sm font-bold text-gray-800 text-green-600">
                    {reportData.inventoryStats.totalQtySold} SP
                  </span>
                </div>
                <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                  <span className="text-sm font-medium text-gray-600">
                    Tồn kho thực tế còn lại
                  </span>
                  <span className="text-sm font-bold text-gray-800">
                    {reportData.inventoryStats.totalQtyImported -
                      reportData.inventoryStats.totalQtySold}{" "}
                    SP
                  </span>
                </div>
                <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                  <span className="text-sm font-medium text-gray-600">
                    Số lô hàng đã hết hạn
                  </span>
                  <span className="text-sm font-bold text-red-500">
                    {reportData.inventoryStats.expiredReceiptsCount} lô
                  </span>
                </div>
              </div>
            )}
          </div>

          <div className="mt-4 pt-4 border-t border-gray-100 text-xs text-gray-400 italic">
            * Báo cáo này được cập nhật tự động khi có bất cứ giao dịch hoặc
            thay đổi kho nào trên hệ thống.
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
