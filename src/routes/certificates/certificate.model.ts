import mongoose from "mongoose";

const certificate = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: [true, "user ID is required"],
    },
    courseId: {
      type: String,
      required: [true, "course ID is required"],
    },
    certId: {
      type: String,
      required: [true, "certificate ID is required"],
    },
    issued: {
      type: String,
      required: [true, "issued date is required"],
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Cert", certificate);
