import mongoose from "mongoose";

const session = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: [true, "userId is required"],
    },
    token: {
      type: String,
      required: [true, "token is required"],
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Session", session);
