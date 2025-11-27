const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    googleId: {
      type: String,
      unique: true,
    },
    username: {
      type: String,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      unique: true,
    },
    password: {
      type: String,
    },
    avatar: {
      type: String,
    },
    number: {
      type: String,
      default: undefined,
    },
    otp: {
      type: Number,
      default: undefined,
    },
    otpExpires: {
      type: Date,
      default: undefined,
    },
    isverified: {
      type: Boolean,
      default: false,
    },
    mfa: {
      type: Boolean,
      default: false,
    },
    refreshToken: [String],
    role: {
      type: String,
      required: true,
      enum: ["super admin", "admin", "user"],
      default: "user",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("user", userSchema);
