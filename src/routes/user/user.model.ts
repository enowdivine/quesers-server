import mongoose from "mongoose";

const user = new mongoose.Schema(
  {
    avatar: {
      type: Object,
      default: null,
    },
    username: {
      type: String,
      required: [true, "username is required"],
    },
    phone: {
      type: String,
      required: [true, "user email is required"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "user pasword is required"],
    },
    cart: {
      type: Array,
      default: [],
    },
    resources: {
      type: Array,
      default: [],
    },
    preference: {
      type: Object,
      default: null,
    },
    walletBalance: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      default: "active",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("User", user);
