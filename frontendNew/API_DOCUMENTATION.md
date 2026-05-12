# API Documentation - Personal Grocery Shopping App

**Base URL:** `http://localhost:3000`

---

## 📋 Mục Lục

1. [Authentication APIs (Xác thực)](#authentication-apis)
2. [Category APIs (Danh mục)](#category-apis)
3. [Product APIs (Sản phẩm)](#product-apis)
4. [Order APIs (Đơn hàng)](#order-apis)

---

## Authentication APIs

### 1. Đăng Ký Tài Khoản (Sign Up)

**Phương thức:** `POST`  
**Path:** `/auth/signup`  
**Yêu cầu xác thực:** Không  

**Request Body - JSON:**
```json
{
  "username": "string (required)",
  "password": "string (required)",
  "email": "string (optional)",
  "phone": "string (optional)",
  "fullname": "string (optional)",
  "role": "string (optional, mặc định: 'user')",
  "address": "string (optional)"
}
```

**Response (200):**
```
"Đăng ký tài khoản thành công"
```

**Response (403):**
```
"Tên đăng nhập đã có người sử dụng"
hoặc
"Tham số truyền lên không hợp lệ"
hoặc
"Đăng ký tài khoản thất bại"
```

---

### 2. Đăng Nhập Admin/Shipper/Shop (Sign In)

**Phương thức:** `POST`  
**Path:** `/auth/signin`  
**Yêu cầu xác thực:** Không  
**Cho phép roles:** admin, shipper, shop  

**Request Body - JSON:**
```json
{
  "username": "string (required)",
  "password": "string (required)"
}
```

**Response (200) - Admin:**
```json
{
  "username": "string",
  "role": "admin",
  "token": "string (JWT token with 4h expiration)"
}
```

**Response (200) - Shipper/Shop:**
```json
{
  "_id": "string",
  "username": "string",
  "email": "string",
  "phone": "string",
  "fullname": "string",
  "role": "string (shipper/shop)",
  "address": "string",
  "status": "number",
  "createdAt": "timestamp",
  "updatedAt": "timestamp",
  "token": "string (JWT token with 4h expiration)"
}
```

**Response (403/404):**
```
"Sai tên đăng nhập hoặc mật khẩu"
hoặc
"Tài khoản đã bị khóa do vi phạm chính sách cộng đồng..."
hoặc
"Bạn chưa được cấp phép truy cập trang này"
hoặc
"Đăng nhập thất bại"
```

**Lưu ý:** 
- Admin: Chỉ nhận về username, role và token
- Shipper/Shop: Nhận về thông tin đầy đủ + token
- Role "user" không được phép truy cập endpoint này

---

### 3. Đăng Nhập Người Dùng (Login)

**Phương thức:** `POST`  
**Path:** `/auth/login`  
**Yêu cầu xác thực:** Không  

**Request Body - JSON:**
```json
{
  "username": "string (required)",
  "password": "string (required)"
}
```

**Response (200):**
```json
{
  "_id": "string",
  "username": "string",
  "email": "string",
  "phone": "string",
  "fullname": "string",
  "role": "string (user)",
  "address": "string",
  "status": "number",
  "createdAt": "timestamp",
  "updatedAt": "timestamp",
  "token": "string (JWT token with 4h expiration)"
}
```

**Response (403/404):**
```
"Sai tên đăng nhập hoặc mật khẩu"
hoặc
"Tài khoản đã bị khóa..."
hoặc
"Bạn chưa được cấp phép truy cập trang này"
hoặc
"Đăng nhập thất bại"
```

---

## Category APIs

### 1. Lấy Danh Sách Danh Mục (Active)

**Phương thức:** `GET`  
**Path:** `/categories`  
**Yêu cầu xác thực:** Không  

**Query Parameters:** Không có

**Response (200):**
```json
[
  {
    "_id": "string",
    "name": "string",
    "description": "string",
    "img": "string (URL ảnh)",
    "status": 1,
    "createdAt": "timestamp",
    "updatedAt": "timestamp"
  }
]
```

**Response (403):**
```
"Không có dữ liệu danh mục"
```

---

### 2. Lấy Tất Cả Danh Mục

**Phương thức:** `GET`  
**Path:** `/categories/all`  
**Yêu cầu xác thực:** Không  

**Query Parameters:** Không có

**Response (200):**
```json
[
  {
    "_id": "string",
    "name": "string",
    "description": "string",
    "img": "string (URL ảnh)",
    "status": "number (0 hoặc 1)",
    "createdAt": "timestamp",
    "updatedAt": "timestamp"
  }
]
```

**Response (403):**
```
"Không có dữ liệu danh mục"
```

---

### 3. Lấy Thông Tin Danh Mục Theo ID

**Phương thức:** `GET`  
**Path:** `/categories/:id`  
**Yêu cầu xác thực:** Không  

**Path Parameters:**
- `id` (string): MongoDB ID của danh mục

**Response (200):**
```json
{
  "_id": "string",
  "name": "string",
  "description": "string",
  "img": "string (URL ảnh)",
  "status": "number",
  "createdAt": "timestamp",
  "updatedAt": "timestamp"
}
```

**Response (403):**
```
"Không tìm được danh mục chỉ định"
```

---

### 4. Cập Nhật Danh Mục

**Phương thức:** `PUT`  
**Path:** `/categories/:id`  
**Yêu cầu xác thực:** Không  

**Path Parameters:**
- `id` (string): MongoDB ID của danh mục

**Request Body - JSON:**
```json
{
  "name": "string (optional)",
  "description": "string (optional)",
  "img": "string (optional)",
  "status": "number (optional)"
}
```

**Response (200):**
```
"Cập nhật danh mục thành công"
```

**Response (403):**
```
"Không tìm được danh mục chỉ định"
hoặc
"Cập nhật danh mục thất bại"
```

---

### 5. Tạo Danh Mục Mới

**Phương thức:** `POST`  
**Path:** `/categories`  
**Yêu cầu xác thực:** Không  

**Request Body - JSON:**
```json
{
  "name": "string (required)",
  "description": "string (optional)",
  "img": "string (optional)",
  "status": "number (optional, mặc định: 1)"
}
```

**Response (200):**
```
"tạo mới danh mục thành công"
```

**Response (403):**
```
"Tạo mới danh mục thất bại"
```

---

### 6. Xóa Danh Mục

**Phương thức:** `DELETE`  
**Path:** `/categories/:id`  
**Yêu cầu xác thực:** Không  

**Path Parameters:**
- `id` (string): MongoDB ID của danh mục

**Response (200):**
```
"Xóa danh mục thành công"
```

**Response (403):**
```
"Không tìm được danh mục chỉ định"
hoặc
"Xóa danh mục thất bại"
```

---

## Product APIs

### 1. Tạo Sản Phẩm Mới

**Phương thức:** `POST`  
**Path:** `/products`  
**Yêu cầu xác thực:** Có (Bearer Token)  
**Quyền yêu cầu:** admin hoặc shop  

**Request Header:**
```
Authorization: Bearer <JWT_TOKEN>
```

**Request Body - JSON:**
```json
{
  "name": "string (required)",
  "description": "string (optional)",
  "stockPrice": "number (required - giá niêm yết)",
  "currentPrice": "number (required - giá bán)",
  "cat": "string (optional - danh mục)",
  "imgs": "array of strings (required - tối thiểu 1 ảnh)",
  "quantity": "number (optional - số lượng tồn kho)"
}
```

**Response (200):**
```
"Tạo mới sản phẩm thành công"
```

**Response (401/403):**
```
"Bạn chưa đăng nhập"
hoặc
"Giá niêm yết không hợp lệ"
hoặc
"Giá bán không hợp lệ"
hoặc
"Hình ảnh sản phẩm không hợp lệ"
```

---

### 2. Lấy Danh Sách Sản Phẩm

**Phương thức:** `GET`  
**Path:** `/products`  
**Yêu cầu xác thực:** Không  

**Query Parameters:**
- `search` (string, optional): Tìm kiếm theo tên/danh mục
- `limit` (number, optional): Giới hạn số lượng kết quả

**Response (200):**
```json
[
  {
    "_id": "string",
    "name": "string",
    "description": "string",
    "stockPrice": "number",
    "currentPrice": "number",
    "cat": "string",
    "imgs": ["string"],
    "shopID": "string",
    "quantity": "number",
    "outStock": "number",
    "active": true,
    "createdAt": "timestamp",
    "updatedAt": "timestamp"
  }
]
```

**Response (404):**
```
"chưa có dữ liệu"
```

---

### 3. Lấy Thông Tin Sản Phẩm Theo ID

**Phương thức:** `GET`  
**Path:** `/products/:id`  
**Yêu cầu xác thực:** Không  

**Path Parameters:**
- `id` (string): MongoDB ID của sản phẩm

**Response (200):**
```json
{
  "_id": "string",
  "name": "string",
  "description": "string",
  "stockPrice": "number",
  "currentPrice": "number",
  "cat": "string",
  "imgs": ["string"],
  "shopID": "string",
  "quantity": "number",
  "outStock": "number",
  "active": "boolean",
  "createdAt": "timestamp",
  "updatedAt": "timestamp"
}
```

**Response (403):**
```
"Không tìm thấy thông tin sản phẩm"
```

---

### 4. Cập Nhật Sản Phẩm

**Phương thức:** `PUT`  
**Path:** `/products/:id`  
**Yêu cầu xác thực:** Có (Bearer Token)  
**Quyền yêu cầu:** admin hoặc shop owner (chủ sở hữu sản phẩm)  

**Request Header:**
```
Authorization: Bearer <JWT_TOKEN>
```

**Path Parameters:**
- `id` (string): MongoDB ID của sản phẩm

**Request Body - JSON:**
```json
{
  "name": "string (optional)",
  "description": "string (optional)",
  "stockPrice": "number (required nếu cập nhật - giá niêm yết)",
  "currentPrice": "number (required nếu cập nhật - giá bán)",
  "cat": "string (optional)",
  "imgs": "array of strings (required nếu cập nhật - tối thiểu 1)",
  "quantity": "number (optional)"
}
```

**Response (200):**
```
"Cập nhật sản phẩm thành công"
```

**Response (403/404):**
```
"Giá niêm yết không hợp lệ"
hoặc
"Giá bán không hợp lệ"
hoặc
"Hình ảnh sản phẩm không hợp lệ"
hoặc
"Không tìm thấy thông tin sản phẩm"
hoặc
"Bạn không được phép thực hiện chức năng này"
```

---

### 5. Xóa Sản Phẩm

**Phương thức:** `DELETE`  
**Path:** `/products/:id`  
**Yêu cầu xác thực:** Có (Bearer Token)  
**Quyền yêu cầu:** admin hoặc shop owner (chủ sở hữu sản phẩm)  

**Request Header:**
```
Authorization: Bearer <JWT_TOKEN>
```

**Path Parameters:**
- `id` (string): MongoDB ID của sản phẩm

**Response (200):**
```
"Xóa sản phẩm thành công"
```

**Response (403/404):**
```
"Không tìm thấy thông tin sản phẩm"
hoặc
"Bạn không được phép thực hiện chức năng này"
```

---

### 6. Kích Hoạt Sản Phẩm

**Phương thức:** `PUT`  
**Path:** `/products/activeProduct/:id`  
**Yêu cầu xác thực:** Có (Bearer Token)  
**Quyền yêu cầu:** admin  

**Request Header:**
```
Authorization: Bearer <JWT_TOKEN>
```

**Path Parameters:**
- `id` (string): MongoDB ID của sản phẩm

**Response (200):**
```
"Kích hoạt sản phẩm thành công"
```

**Response (403/404):**
```
"Không tìm thấy thông tin sản phẩm"
hoặc
"Bạn không được phép thực hiện chức năng này"
```

---

## Order APIs

### 1. Tạo Đơn Hàng Mới

**Phương thức:** `POST`  
**Path:** `/orders`  
**Yêu cầu xác thực:** Có (Bearer Token)  

**Request Header:**
```
Authorization: Bearer <JWT_TOKEN>
```

**Request Body - JSON:**
```json
{
  "products": [
    {
      "id": "string (MongoDB ID sản phẩm)",
      "quantity": "number",
      "shopID": "string",
      "price": "number (optional)"
    }
  ],
  "shippingAddress": "string (optional)",
  "phone": "string (optional)",
  "note": "string (optional)"
}
```

**Response (200):**
```json
{
  "message": "Tạo đơn hàng thành công",
  "data": "number (ordering number - timestamp)"
}
```

**Response (500):**
```
"Lỗi không xác định"
```

---

### 2. Lấy Danh Sách Đơn Hàng

**Phương thức:** `GET`  
**Path:** `/orders`  
**Yêu cầu xác thực:** Có (Bearer Token)  

**Request Header:**
```
Authorization: Bearer <JWT_TOKEN>
```

**Query Parameters:**
- `limit` (number, optional): Giới hạn số lượng kết quả

**Response (200):**
```json
[
  {
    "_id": "string",
    "buyerId": "string",
    "shipperId": "string (optional)",
    "orderNumber": "number",
    "products": [
      {
        "id": "string",
        "quantity": "number",
        "shopID": "string",
        "price": "number"
      }
    ],
    "shippingAddress": "string",
    "phone": "string",
    "note": "string",
    "status": "number (0-4)",
    "tracking": [
      {
        "status": "number",
        "desc": "string",
        "time": "timestamp"
      }
    ],
    "createdAt": "timestamp",
    "updatedAt": "timestamp"
  }
]
```

**Lưu ý:**
- Admin xem tất cả đơn hàng
- Shipper xem đơn được giao cho mình
- Shop xem đơn chứa sản phẩm của mình
- User xem đơn của mình

**Response (403):**
```
"Không có dữ liệu đơn hàng nào"
```

---

### 3. Lấy Đơn Hàng của Tôi

**Phương thức:** `GET`  
**Path:** `/orders/my-orders`  
**Yêu cầu xác thực:** Có (Bearer Token)  

**Request Header:**
```
Authorization: Bearer <JWT_TOKEN>
```

**Response (200):**
```json
[
  {
    "_id": "string",
    "buyerId": "string",
    "shipperId": "string",
    "orderNumber": "number",
    "products": [
      {
        "id": "string",
        "quantity": "number",
        "shopID": "string",
        "price": "number"
      }
    ],
    "shippingAddress": "string",
    "phone": "string",
    "note": "string",
    "status": "number",
    "tracking": [
      {
        "status": "number",
        "desc": "string",
        "time": "timestamp"
      }
    ],
    "createdAt": "timestamp",
    "updatedAt": "timestamp"
  }
]
```

**Lưu ý:**
- Admin/Shipper: xem tất cả đơn
- Shop: xem chỉ sản phẩm của mình trong đơn

---

### 4. Lấy Thông Tin Đơn Hàng Theo ID

**Phương thức:** `GET`  
**Path:** `/orders/:id`  
**Yêu cầu xác thực:** Có (Bearer Token)  

**Request Header:**
```
Authorization: Bearer <JWT_TOKEN>
```

**Path Parameters:**
- `id` (string): MongoDB ID của đơn hàng

**Response (200):**
```json
{
  "_id": "string",
  "buyerId": "string",
  "shipperId": "string",
  "orderNumber": "number",
  "products": [
    {
      "id": "string",
      "quantity": "number",
      "shopID": "string",
      "price": "number"
    }
  ],
  "shippingAddress": "string",
  "phone": "string",
  "note": "string",
  "status": "number",
  "tracking": [
    {
      "status": "number",
      "desc": "string",
      "time": "timestamp"
    }
  ],
  "createdAt": "timestamp",
  "updatedAt": "timestamp"
}
```

**Quyền truy cập:**
- Admin, Buyer, Shipper (nếu được giao), Shop owner (nếu chứa sản phẩm của mình)

**Response (403/404):**
```
"Không tìm được dữ liệu đơn hàng tương ứng"
hoặc
"Bạn không được cấp quyền thực hiện chức năng"
```

---

### 5. Cập Nhật Đơn Hàng

**Phương thức:** `PUT`  
**Path:** `/orders/:id`  
**Yêu cầu xác thực:** Có (Bearer Token)  

**Request Header:**
```
Authorization: Bearer <JWT_TOKEN>
```

**Path Parameters:**
- `id` (string): MongoDB ID của đơn hàng

**Request Body - JSON:**
```json
{
  "status": "number (required)",
  "shipperId": "string (optional - admin set)",
  "shippingAddress": "string (optional)",
  "phone": "string (optional)",
  "note": "string (optional)"
}
```

**Quyền cập nhật:**
- Admin: cập nhật tất cả fields
- Shipper: chỉ cập nhật status
- Shop: cập nhật thông tin khác (không thể cập nhật status)

**Response (200):**
```
"Cập nhật đơn hàng thành công"
```

**Lưu ý:** Hệ thống tự động thêm entry vào `tracking` array khi có cập nhật

**Response (403/404):**
```
"Đơn hàng không khả dụng"
hoặc
"Bạn không được cấp quyền thực hiện chức năng này!"
```

---

### 6. Hủy Đơn Hàng

**Phương thức:** `POST`  
**Path:** `/orders/:id/cancel`  
**Yêu cầu xác thực:** Có (Bearer Token)  

**Request Header:**
```
Authorization: Bearer <JWT_TOKEN>
```

**Path Parameters:**
- `id` (string): MongoDB ID của đơn hàng

**Response (200):**
```
"Hủy đơn hàng thành công"
```

**Quyền hủy:**
- Admin/Shipper: hủy bất kỳ đơn nào
- Buyer: hủy đơn của mình (chỉ khi status = 0)

**Response (403/404):**
```
"Đơn hàng không khả dụng"
hoặc
"Bạn không được cấp quyền thực hiện chức năng này!"
hoặc
"Trạng thái đơn hàng không cho phép hủy đơn"
```

---

## Ghi Chú Chung

### Status Codes
- `200`: Thành công
- `403`: Lỗi (Unauthorized, Invalid input, etc.)
- `404`: Không tìm thấy
- `401`: Chưa xác thực
- `500`: Lỗi server

### Order Status
- `0`: Chờ xác nhận
- `1`: Đã xác nhận
- `2`: Đang giao
- `3`: Hủy
- `4`: Hoàn thành

### User Roles
- `user`: Người mua
- `shop`: Cửa hàng
- `admin`: Quản trị viên
- `shipper`: Người giao hàng

### Authentication
- Sử dụng JWT token trong header: `Authorization: Bearer <TOKEN>`
- Token có thời hạn: 4 giờ
- Lấy token từ endpoint `/auth/signin` (admin/shop) hoặc `/auth/login` (user)

---

**Cập nhật lần cuối:** March 31, 2026
