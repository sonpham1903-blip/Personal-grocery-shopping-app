export const ktsConfig = {
  navLinks: [
    { title: "trang chủ", path: "/" },
    { title: "giới thiệu", path: "/about" },
    { title: "sản phẩm", path: "/products" },
    { title: "tin tức", path: "/news" },
    { title: "liên hệ", path: "/contact" },
  ],
  footer: {
    address: " 20C/75/213 Thiên Lôi",
    wokingTime: " 8h-17h30",
    phone: " (+84) 788 300 894",
    email: " ktscropvn@gmail.com",
    copyRight: "Copyright 2022 © Thiết kế bởi Hoa Sen Đỏ",
  },
};
export const dashboard = {
  navLinks: [
    {
      title: "trang chính",
      path: "/admin",
      role: ["admin", "shop", "staff"],
      d: "M3.75 3v11.25A2.25 2.25 0 006 16.5h12A2.25 2.25 0 0020.25 14.25V3.75m-16.5 0A2.25 2.25 0 016 1.5h12a2.25 2.25 0 012.25 2.25m-16.5 0v.75m16.5-.75v.75M3.75 21h16.5",
    },
    {
      title: "sản phẩm",
      path: "/admin/san-pham",
      role: ["admin", "shop"],
      d: "M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z",
    },
    {
      title: "đơn hàng",
      path: "/admin/don-hang",
      role: ["admin", "shop"],
      d: "M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z",
    },
  ],
};

export const adminDashboard = {
  navLinks: [
    {
      title: "sản phẩm",
      path: "/admin/san-pham",
      role: ["admin"],
      d: "M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z",
    },
    {
      title: "loại hàng hóa",
      path: "/admin/loai-hang-hoa",
      role: ["admin"],
      d: "M19.5 6.75l-7.5-4.5-7.5 4.5m15 0l-7.5 4.5m7.5-4.5v9l-7.5 4.5m0-9l-7.5-4.5m7.5 4.5v9m-7.5-13.5l7.5 4.5",
    },
    {
      title: "nhà cung cấp",
      path: "/admin/nha-cung-cap",
      role: ["admin"],
      d: "M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975M12 12a4.5 4.5 0 100-9 4.5 4.5 0 000 9zM15.75 21a6.75 6.75 0 10-13.5 0h13.5z",
    },
  ],
};

const defaultSocketUrl = import.meta.env.DEV
  ? `${window.location.protocol === "https:" ? "wss" : "ws"}://${window.location.hostname}:9200`
  : "https://api.sale168.vn:9200";

export const ktsSocket = import.meta.env.VITE_SOCKET_URL || defaultSocketUrl;
