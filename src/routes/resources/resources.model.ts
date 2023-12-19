import mongoose from "mongoose";

const resource = new mongoose.Schema(
  {
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
      required: [true, "instructorId is required"],
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
    resourceType: {
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
    isApproved: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Resource", resource);
