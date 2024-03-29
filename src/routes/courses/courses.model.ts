import mongoose from "mongoose";

const category = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "title is required"],
    },
    slug: {
      type: String,
      required: [true, "slug is required"],
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
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Categories", category);
