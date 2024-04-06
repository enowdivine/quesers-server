import mongoose from "mongoose";

const resource = new mongoose.Schema(
  {
    category: {
      type: String,
    },
    screenshots: {
      type: Array,
      default: [],
    },
    doc: {
      type: Object,
      default: null,
    },
    //
    vendorId: {
      type: String,
      required: [true, "vendor is required"],
    },
    title: {
      type: String,
      required: [true, "title is required"],
    },
    slug: {
      type: String,
    },
    features: {
      type: String,
      default: "",
    },
    desc: {
      type: String,
    },
    exam: {
      type: String,
    },
    school: {
      type: String,
    },
    faculty: {
      type: String,
    },
    department: {
      type: String,
    },
    level: {
      type: String,
    },
    semester: {
      type: String,
    },
    price: {
      type: Number,
      default: 0,
    },
    saleCount: {
      type: Number,
      default: 0,
    },
    language: {
      type: String,
      default: "",
    },
    rating: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Resource", resource);
