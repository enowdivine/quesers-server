import mongoose from "mongoose";

const department = new mongoose.Schema(
  {
    facultyId: {
      type: String,
      required: [true, "facultyId is required"],
    },
    title: {
      type: String,
      required: [true, "title is required"],
    },
    slug: {
      type: String,
      required: [true, "slug is required"],
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Department", department);
