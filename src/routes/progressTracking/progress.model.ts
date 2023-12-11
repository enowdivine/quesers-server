import mongoose from "mongoose";

const progress = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: [true, "user ID is required"],
    },
    courseId: {
      type: String,
      required: [true, "course ID is required"],
    },
    lessonId: {
      type: String,
      required: [true, "lesson ID is required"],
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Progress", progress);
