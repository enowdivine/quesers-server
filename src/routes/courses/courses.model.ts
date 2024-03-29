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
    examId: {
      type: String,
    },
    schoolId: {
      type: String,
    },
    facultyId: {
      type: String,
    },
    departmentId: {
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
