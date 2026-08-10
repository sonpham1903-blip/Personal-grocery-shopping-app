# 🛍️ Hệ thống Đi chợ hộ & Phân phối sản phẩm OCOP Hải Phòng

[![Node.js Version](https://img.shields.io/badge/node-%3E%3D18.0.0-blue.svg)](https://nodejs.org)
[![React Version](https://img.shields.io/badge/react-18%20%2F%2019-cyan.svg)](https://react.dev)
[![Database](https://img.shields.io/badge/database-MongoDB-green.svg)](https://www.mongodb.com)
[![AI Integration](https://img.shields.io/badge/AI-Gemini%20Flash-violet.svg)](https://deepmind.google/technologies/gemini/)

Dự án **Hệ thống Đi chợ hộ & Phân phối sản phẩm OCOP Hải Phòng** là một giải pháp công nghệ toàn diện nhằm kết nối trực tiếp các hộ sản xuất, hợp tác xã nông nghiệp OCOP (Mỗi xã một sản phẩm) tại Hải Phòng với người tiêu dùng cuối cùng. Hệ thống giải quyết các bài toán về quản lý chuỗi cung ứng nông sản sạch, tự động hóa xuất-nhập kho, tối ưu hóa quy trình logistics đi chợ hộ và tích hợp trợ lý thông minh AI (Gemini) để hỗ trợ phân tích nhu cầu và gợi ý mua sắm cho khách hàng.

---

## 👥 Nhóm Thực Hiện (Đại học Hàng hải Việt Nam)
* **Giảng viên hướng dẫn:** TS. Nguyễn Duy Trường Giang
* **Sinh viên thực hiện:**
  * Đinh Văn Thắng (MSV: 96885)
  * Bùi Hoàng Long (MSV: 99096)
  * Phạm Đức Anh (MSV: 91961)

---

## 🛠️ Công Nghệ Sử Dụng

### Phía Backend (`/backend`)
* **Môi trường chạy:** Node.js (ES Modules)
* **Web Framework:** Express.js (v5)
* **Giao tiếp thời gian thực:** Socket.io (v4) - Hỗ trợ nhắn tin chat và thông báo tức thời giữa khách hàng, người bán và người đi chợ.
* **Cơ sở dữ liệu:** MongoDB & Mongoose ORM (Lưu trữ linh hoạt dạng tài liệu JSON).
* **Bảo mật & Xác thực:** JSON Web Token (JWT) & bcryptjs để mã hóa mật khẩu.
* **Tích hợp AI:** Gemini API (model Gemini Flash) làm trợ lý ảo hỗ trợ gợi ý đi chợ hộ dựa trên sản phẩm sẵn có trong kho.

### Phía Frontend
1. **Giao diện Khách hàng (`/frontendNew`):**
   * **Core:** React (v19) & Vite (v8)
   * **Styling:** Tailwind CSS (v4)
   * **State Management:** Redux Toolkit
   * **Thư viện chính:** React Router DOM (v7), Axios, Swiper, React Toastify, Socket.io Client.
2. **Giao diện Quản trị & Người bán (`/frontend-admin`):**
   * **Core:** React (v18) & Vite (v4)
   * **Styling:** Tailwind CSS (v3)
   * **State Management:** Redux Toolkit & Redux Persist
   * **Thư viện chính:** Recharts (Báo cáo thống kê), React Quill (Soạn bài viết tin tức), Socket.io Client.

---

## 📂 Cấu Trúc Dự Án

```text
Personal-grocery-shopping-app/
├── backend/                  # Mã nguồn server API Node.js/Express
│   ├── controllers/          # Bộ điều khiển xử lý logic nghiệp vụ (Auth, Product, Order, Chat...)
│   ├── models/               # Định nghĩa các Schema Mongoose (User, Product, Order, Cart...)
│   ├── routes/               # Các tuyến đường API phân tách theo tài nguyên
│   ├── utils/                # Các hàm tiện ích (quản lý kho, scheduler hết hạn phiếu nhập...)
│   └── index.js              # Điểm khởi chạy Server chính (Express API & Socket.io)
├── frontendNew/              # Giao diện web cho khách hàng (React 19)
│   ├── public/               # Tài nguyên tĩnh (ảnh, icon...)
│   └── src/                  # Mã nguồn React (pages, components, Redux store...)
├── frontend-admin/           # Giao diện web cho Admin & Người bán (React 18)
│   ├── public/               # Tài nguyên tĩnh
│   └── src/                  # Mã nguồn React (giao diện quản trị, biểu đồ doanh thu...)
└── README.md                 # Tài liệu hướng dẫn dự án
```

---

## 🔑 Các Vai Trò Trong Hệ Thống

| Vai trò | Chức năng nghiệp vụ chính |
| :--- | :--- |
| **Quản trị viên (Admin)** | Quản lý người dùng, duyệt/khóa tài khoản, phê duyệt danh mục OCOP, quản lý tin tức truyền thông, theo dõi báo cáo doanh thu toàn hệ thống. |
| **Người bán (Shop)** | Đăng ký gian hàng OCOP, quản lý sản phẩm, lập phiếu nhập kho (kiểm soát số lượng, hạn sử dụng, thông tin chứng nhận OCOP), xử lý & chuẩn bị đơn hàng, nhắn tin CSKH, xem báo cáo thống kê của riêng shop. |
| **Khách hàng (User)** | Tìm kiếm sản phẩm OCOP, quản lý giỏ hàng cá nhân, đặt đơn hàng (giao tận nhà hoặc tự đến lấy tại kho), nhắn tin trao đổi với người bán, đánh giá/bình luận sản phẩm, sử dụng Trợ lý đi chợ hộ AI. |
| **Người giao hàng (Shipper)** | Nhận thông báo đơn hàng mới, cập nhật tiến trình và trạng thái vận chuyển. |

---

## 🚀 Hướng Dẫn Cài Đặt và Chạy Dự Án

### 1. Chuẩn bị môi trường
* Đảm bảo máy tính đã cài đặt [Node.js](https://nodejs.org/) (phiên bản `>= 18.0.0`).
* Đảm bảo [MongoDB](https://www.mongodb.com/try/download/community) đã được cài đặt và đang chạy cục bộ (mặc định tại cổng `27017`) hoặc chuẩn bị một URI kết nối MongoDB Atlas.

---

### 2. Cấu hình biến môi trường
Tạo file `.env` bên trong thư mục `backend/` với nội dung sau:

```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/dichoho_app
JWT_KEY=kts_secret_key_2026
GEMINI_API_KEY=YOUR_GEMINI_API_KEY_HERE
```
*Lưu ý: Thay thế `YOUR_GEMINI_API_KEY_HERE` bằng API key thực tế của bạn được cấp từ Google AI Studio.*

---

### 3. Khởi chạy Backend API Server
Mở terminal mới tại thư mục gốc của dự án và chạy các lệnh:

```bash
cd backend
npm install
npm run dev
```
* **Express API Server** sẽ khởi động tại: [http://localhost:3000](http://localhost:3000)
* **Socket.io Server** sẽ tự động chạy song song tại cổng: `9200`

---

### 4. Khởi chạy Frontend Khách hàng (Customer Web Client)
Mở một terminal mới khác tại thư mục gốc dự án:

```bash
cd frontendNew
npm install
npm run dev
```
* Giao diện người dùng sẽ chạy tại: [http://localhost:5173](http://localhost:5173) (hoặc cổng được Vite hiển thị trên terminal).

---

### 5. Khởi chạy Frontend Quản trị & Người bán (Admin & Seller Portal)
Mở một terminal mới thứ ba tại thư mục gốc dự án:

```bash
cd frontend-admin
npm install
npm run dev
```
* Trang quản trị và bán hàng sẽ chạy tại: [http://localhost:5174](http://localhost:5174) (hoặc cổng được Vite hiển thị trên terminal).

---

## 📝 Ghi Chú Vận Hành
1. **Phân quyền Admin:** Để truy cập được trang quản trị Admin, tài khoản đăng nhập cần có trường `role: "admin"` trong Database. Bạn có thể đăng ký tài khoản thông thường rồi cập nhật thủ công trường `role` này trong MongoDB.
2. **Kích hoạt trợ lý AI:** Đảm bảo `GEMINI_API_KEY` hoạt động tốt để khách hàng sử dụng được tính năng đề xuất/đi chợ hộ thông minh.