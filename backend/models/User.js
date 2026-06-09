import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      minlength: 3,
      maxlength: 50,
      match: [
        /^[\p{L}\p{M}0-9_ ]+$/u,
        "Tên đăng nhập chỉ được chứa chữ cái, số, khoảng trắng, dấu gạch dưới và ký tự tiếng Việt có dấu",
      ],
    },
    displayName: {
      type: String,
    },
    email: {
      type: String,
      unique: true,
      sparse: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    img: {
      type: String,
    },
    phone: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
      enum: ["male", "female"],
    },
    birthDate: {
      type: Date,
    },
    role: {
      type: String,
      enum: ["user", "shop", "shipper", "admin"],
      default: "user",
    },
    // -1: xoa, 0: khoa, 1: hoat dong, 2: chua kich hoat
    status: {
      type: Number,
      default: 2,
      enum: [-1, 0, 1, 2],
    },
    address: {
      type: String,
    },
    cityCode: {
      type: String,
    },
    cityName: {
      type: String,
    },
    cityFullName: {
      type: String,
    },
    districtCode: {
      type: String,
    },
    districtName: {
      type: String,
    },
    districtFullName: {
      type: String,
    },
    wardCode: {
      type: String,
    },
    wardName: {
      type: String,
    },
    wardFullName: {
      type: String,
    },
    businessLicensePdfUrl: {
      type: String,
    },
    liked: {
      type: [String],
      default: [],
    },
    likedBy: {
      type: [String],
      default: [],
    },
    numberFolower: {
      type: Number,
      default: 0,
      min: 0,
    },
    followed: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

UserSchema.index({ phone: 1 });

export default mongoose.model("User", UserSchema);
