import mongoose from "mongoose";

const transaction = new mongoose.Schema(
  {
    transactionType: {
      type: String,
    },
    items: {
      type: Array,
      default: [],
    },
    userId: {
      type: String,
      required: [true, "userId is required"],
    },
    amount: {
      type: Number,
      required: [true, "amount is required"],
    },
    revenue: {
      type: Number,
    },
    username: {
      type: String,
      required: [true, "username is required"],
    },
    email: {
      type: String,
    },
    phonenumber: {
      type: String,
      required: [true, "phonenumber is required"],
    },
    paymentMethod: {
      type: String,
    },
    status: {
      type: String,
    },

    code: {
      type: String,
    },
    operator_reference: {
      type: String,
    },
    reference: {
      type: String,
    },
    signature: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Transaction", transaction);
