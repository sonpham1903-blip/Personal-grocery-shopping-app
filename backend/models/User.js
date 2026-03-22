import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      minlength: 3,
      maxlength: 50,
      match: /^[a-zA-Z0-9_]+$/,
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
      enum: ["user", "shop", "admin", "special", "staff"],
      default: "user",
    },
    // -1: xoa, 0: khoa, 1: hoat dong, 2: chua kich hoat
    status: {
      type: Number,
      default: 2,
      enum: [-1, 0, 1, 2],
    },
    parentUser: {
      type: String,
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

UserSchema.index({ username: 1 }, { unique: true });
UserSchema.index({ email: 1 }, { unique: true, sparse: true });
UserSchema.index({ phone: 1 });

export default mongoose.model("User", UserSchema);
