# Hệ Thống Cơ Sở Dữ Liệu - Sơ Đồ Schema

## Tổng Quan
Database sử dụng MongoDB với 11 collections chính, thiết kế theo sơ đồ lớp và use case của hệ thống thương mại điện tử.

---

## 1. COLLECTIONS

### 1.1 Người Dùng (Users)
**Collection Name:** `users`

```javascript
{
  _id: ObjectId,
  // Thông tin đăng nhập
  username: String (required, unique),
  password: String (required, hashed),
  email: String (unique),
  
  // Thông tin cá nhân
  displayName: String,
  phone: String (required),
  img: String (URL avatar),
  gender: String (male/female),
  birthDate: Date,
  
  // Địa chỉ
  address: String,
  cityCode: String,
  cityName: String,
  cityFullName: String,
  districtCode: String,
  districtName: String,
  districtFullName: String,
  wardCode: String,
  wardName: String,
  wardFullName: String,
  
  // Vai trò và trạng thái
  role: String (enum: 'user', 'shop', 'admin', 'special', 'staff'),
  // status: -1 (xóa), 0 (khóa), 1 (hoạt động), 2 (chưa kích hoạt)
  status: Number (default: 2),
  
  // Thêm thông tin
  parentUser: String (ID người tạo),
  liked: [String] (danh sách sản phẩm đã thích),
  likedBy: [String] (danh sách người thích),
  numberFolower: Number (số người theo dõi, dành cho shop),
  followed: Boolean (có theo dõi bạn không),
  
  // Timestamps
  createdAt: Date,
  updatedAt: Date
}
```

---

### 1.2 Danh Mục (Categories)
**Collection Name:** `categories`

```javascript
{
  _id: ObjectId,
  code: String (required, unique),
  name: String (required),
  description: String,
  status: Number (1: hoạt động, 0: không hoạt động, -1: xóa),
  createdBy: String (ID admin),
  updatedBy: String (ID admin),
  createdAt: Date,
  updatedAt: Date
}
```

---

### 1.3 Sản Phẩm (Products)
**Collection Name:** `products`

```javascript
{
  _id: ObjectId,
  // Thông tin cơ bản
  productName: String (required),
  description: String,
  thumbnail: String (URL ảnh đại diện),
  imgs: [String] (danh sách URL ảnh),
  
  // Liên kết
  shopID: String (required, ID người bán),
  shopName: String,
  cat: String (ID danh mục),
  
  // Giá
  stockPrice: Number (giá gốc),
  currentPrice: Number (giá bán),
  
  // Tồn kho
  inStock: Number (số lượng tồn),
  outStock: Number (số lượng đã bán),
  available: Boolean (còn hàng),
  
  // Trạng thái
  // active: true (đang bán), false (tạm ẩn)
  active: Boolean (default: true),
  
  // Tương tác
  like: Number (số lượt thích),
  likedBy: [String],
  dislikeBy: [String],
  
  // Thêm
  tags: [String] (từ khóa, các giá trị CRUDhorizontal),
  updatedBy: String (ID người cập nhật),
  
  createdAt: Date,
  updatedAt: Date
}
```

**Index:**
- `shopID`, `cat` (tìm kiếm sản phẩm theo cửa hàng, danh mục)
- `productName` (tìm kiếm theo tên)

---

### 1.4 Giỏ Hàng (Carts)
**Collection Name:** `carts`

```javascript
{
  _id: ObjectId,
  userId: String (required, ID người mua),
  items: [
    {
      productId: String (required),
      productName: String,
      shopID: String,
      quantity: Number (required),
      unitPrice: Number,
      currentPrice: Number,
      lineTotal: Number (quantity * currentPrice)
    }
  ],
  total: Number (tổng tiền giỏ hàng),
  createdAt: Date,
  updatedAt: Date
}
```

**Index:**
- `userId` (tìm giỏ hàng của người dùng)

---

### 1.5 Đơn Hàng (Orders)
**Collection Name:** `orders`

```javascript
{
  _id: ObjectId,
  // Mã đơn
  orderNumber: String (required, timestamp),
  
  // Thông tin người mua
  buyerId: String (required, ID người mua),
  buyerName: String (required),
  buyerPhone: String (required),
  note: String,
  
  // Địa chỉ giao hàng
  toAddress: String (required),
  toWard: String (required),
  toDistrict: String (required),
  toCity: String (required),
  
  // Chi tiết đơn
  products: [
    {
      productId: String,
      productName: String,
      shopID: String (ID người bán),
      quantity: Number,
      unitPrice: Number,
      lineTotal: Number
    }
  ],
  total: Number,
  
  // Vận chuyển
  // 0: tiêu chuẩn, 1: nhanh
  shipMode: Number (default: 0),
  
  // Thanh toán
  // cod: thanh toán khi nhận, bank: chuyển khoản
  payment: String (enum: 'cod', 'bank', default: 'cod'),
  payCode: String (mã giao dịch nếu có),
  
  // Trạng thái
  // 0: mới tạo, 1: chờ xác nhận, 2: đang giao, 3: giao thành công, 4: hủy
  status: Number (default: 0),
  
  // Theo dõi
  tracking: [
    {
      status: Number,
      desc: String,
      time: Date
    }
  ],
  
  createdAt: Date,
  updatedAt: Date
}
```

**Index:**
- `orderNumber`, `buyerId`, `status` (tìm kiếm đơn hàng)

---

### 1.6 Bài Viết (Posts)
**Collection Name:** `posts`

```javascript
{
  _id: ObjectId,
  title: String (required),
  content: String (required),
  thumbnail: String (URL hình đại diện),
  image: String (URL ảnh bài viết),
  createdBy: String (ID admin),
  updatedBy: String,
  status: Number (1: công khai, 0: nháp, -1: xóa),
  createdAt: Date,
  updatedAt: Date
}
```

---

### 1.7 Thông Báo (Notifications)
**Collection Name:** `notifications`

```javascript
{
  _id: ObjectId,
  buyerId: String (ID người mua),
  salerId: String (ID người bán),
  title: String,
  short: String (nôm tắt),
  desc: String (mô tả đầy đủ),
  read: Boolean (default: false),
  createdAt: Date,
  updatedAt: Date
}
```

**Index:**
- `buyerId`, `salerId` (tìm thông báo)

---

### 1.8 Tin Nhắn (Messages)
**Collection Name:** `messages`

```javascript
{
  _id: ObjectId,
  chatId: String (ID cuộc hội thoại),
  senderId: String (ID người gửi),
  content: String,
  createdAt: Date,
  updatedAt: Date
}
```

---

### 1.9 Cuộc Hội Thoại (Chats)
**Collection Name:** `chats`

```javascript
{
  _id: ObjectId,
  customerId: String (ID khách hàng),
  shopId: String (ID shop),
  lastMessage: String,
  lastMessageTime: Date,
  createdAt: Date,
  updatedAt: Date
}
```

**Index:**
- `customerId`, `shopId`

---

### 1.10 Bình Luận (Comments)
**Collection Name:** `comments`

```javascript
{
  _id: ObjectId,
  userId: String (ID người bình luận),
  productId: String (ID sản phẩm),
  content: String (nội dung bình luận),
  rating: Number (1-5 sao),
  createdAt: Date,
  updatedAt: Date
}
```

**Index:**
- `productId`, `userId`

---

### 1.11 Báo Cáo Thống Kê (Reports)
**Collection Name:** `reports`

```javascript
{
  _id: ObjectId,
  visitorsCount: Number (lượt truy cập),
  totalProducts: Number (tổng sản phẩm),
  newProducts: Number (sản phẩm mới),
  totalShop: Number (tổng shop),
  newShop: Number (shop mới),
  totalOrders: Number (tổng đơn hàng),
  successOrders: Number (đơn hàng thành công),
  failOrders: Number (đơn hàng thất bại),
  successValue: Number (giá trị thành công),
  createdAt: Date,
  updatedAt: Date
}
```

---

### 1.12 Cấu Hình (Config)
**Collection Name:** `configs`

```javascript
{
  _id: ObjectId,
  visitorsCount: Number (tổng lượt truy cập),
  updatedAt: Date
}
```

---

## 2. QUAN HỆ GIỮA COLLECTIONS

```
Người Dùng (Users)
├── 1-N → Sản Phẩm (shopID)
├── 1-N → Đơn Hàng (buyerId)
├── 1-N → Bài Viết (createdBy)
├── 1-N → Cuộc Hội Thoại (customerId, shopId)
├── 1-N → Bình Luận (userId)
└── 1-N → Thông Báo (buyerId, salerId)

Danh Mục (Categories)
└── N-N → Sản Phẩm (cat)

Sản Phẩm (Products)
├── 1-N → Giỏ Hàng (productId)
├── 1-N → Đơn Hàng (productId)
└── 1-N → Bình Luận (productId)

Giỏ Hàng (Carts)
└── 1-1 → Người Dùng (userId)

Đơn Hàng (Orders)
└── 1-N → Thông Báo (salerId)

Cuộc Hội Thoại (Chats)
└── 1-N → Tin Nhắn (chatId)
```

---

## 3. QUY TẮC DỮ LIỆU

### 3.1 Validation
- `username`: độ dài 3-50 ký tự, chỉ chứa chữ, số, dấu gạch dưới
- `password`: tối thiểu 6 ký tự (nên mã hóa bcrypt)
- `email`: định dạng email hợp lệ
- `phone`: định dạng số điện thoại Việt Nam
- `currentPrice`, `stockPrice` ≥ 0
- `quantity`, `inStock`, `outStock` ≥ 0
- `rating` (comment): 1-5

### 3.2 Indexing
- Users: `username`, `email`, `phone`
- Products: `shopID`, `cat`, `productName`, `active`
- Orders: `orderNumber`, `buyerId`, `status`
- Notifications: `buyerId`, `salerId`, `read`
- Chats: `customerId`, `shopId`
- Comments: `productId`, `userId`
- Categories: `code`

### 3.3 Trạng Thái
**Người Dùng (status):**
- -1: Đã xóa
- 0: Bị khóa
- 1: Đang hoạt động
- 2: Chưa kích hoạt

**Sản Phẩm (active/available):**
- active: true (đang bán), false (tạm ẩn)
- available: true (còn hàng), false (hết hàng)

**Đơn Hàng (status):**
- 0: Mới tạo
- 1: Chờ xác nhận
- 2: Đang giao
- 3: Giao thành công
- 4: Đã hủy

**Sản Phẩm (theo workflow):**
- Mới tạo → Đang bán → Tạm ẩn ↔ Hết hàng → Ngừng kinh doanh

---

## 4. RÀNG BUỘC DỮ LIỆU

1. **Tính toàn vẹn tham chiếu:**
   - shopID trong Products phải tồn tại trong Users (role='shop')
   - productId trong Orders phải tồn tại trong Products
   - userId trong Carts phải tồn tại trong Users

2. **Duy nhất:**
   - username, email, phone trong Users
   - code trong Categories
   - orderNumber trong Orders

3. **Bắt buộc:**
   - username, password, phone, role (Users)
   - productName, shopID, cat (Products)
   - code, name (Categories)
   - orderNumber, buyerId, buyerName, buyerPhone, toAddress (Orders)

---

## 5. BACKUP & SECURITY

- Backup hàng ngày tất cả collections
- Mã hóa password: bcrypt (salt rounds: 10)
- Mã hóa nhạy cảm: email, phone nên sử dụng encryption
- Token JWT: 7 ngày hết hạn
- Rate limiting: API calls

---

## 6. MIGRATION NOTES

Nếu từ schema hiện tại sang schema mới:
1. Tách Users thành 3 vai trò riêng (nếu cần) hoặc giữ nguyên 1 User chung
2. Thêm indexes lên các trường tìm kiếm thường xuyên
3. Thêm validation rules
4. Migration script cho dữ liệu cũ

