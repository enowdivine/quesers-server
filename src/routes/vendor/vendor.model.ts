import mongoose from "mongoose";

const vendor = new mongoose.Schema(
  {
    role: {
      type: String,
      default: "vendor",
    },
    username: {
      type: String,
      required: [true, "username is required"],
    },
    email: {
      type: String,
    },
    phone: {
      type: String,
      required: [true, "phone number is required"],
    },
    occupation: {
      type: String,
      required: [true, "occupation is required"],
    },
    educationLevel: {
      type: String,
      required: [true, "level of education is required"],
    },
    resume: {
      type: Object,
      required: [true, "resume is required"],
    },
    password: {
      type: String,
      required: [true, "instructor pasword is required"],
    },
    avatar: {
      type: Object,
      default: null,
    },
    status: {
      type: String,
      default: "pending",
    },
    totalRevenue: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Vendor", vendor);
