import mongoose from "mongoose";

const resoursetype = new mongoose.Schema(
  {
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

export default mongoose.model("ResourceType", resoursetype);
