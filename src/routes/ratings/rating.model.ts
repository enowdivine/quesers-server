import mongoose from "mongoose";

const rating = new mongoose.Schema(
  {
    resourceId: {
      type: String,
      required: [true, "resourceId is required"],
    },
    userId: {
      type: String,
      required: [true, "userId is required"],
    },
    rating: {
      type: Number,
      required: [true, "rating is required"],
    },
    comment: {
      type: String,
      required: [true, "comment is required"],
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Rating", rating);
