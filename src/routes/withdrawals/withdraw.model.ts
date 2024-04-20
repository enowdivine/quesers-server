import mongoose from "mongoose";

const withdraw = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: [true, "userId is required"],
    },
    amount: {
      type: Number,
      required: [true, "amount is required"],
    },
    status: {
      type: String,
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Withdraw", withdraw);
