import mongoose from "mongoose";

const faculty = new mongoose.Schema(
  {
    schoolId: {
      type: String,
      required: [true, "schoolId is required"],
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

export default mongoose.model("Faculty", faculty);
