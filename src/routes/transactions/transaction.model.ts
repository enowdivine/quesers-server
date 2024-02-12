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
      required: [true, "userId is reuired"],
    },
    transactionId: {
      type: String,
    },
    financialTransId: {
      type: String,
    },
    amount: {
      type: Number,
      required: [true, "amount is reuired"],
    },
    revenue: {
      type: Number,
    },
    username: {
      type: String,
      required: [true, "username is reuired"],
    },
    email: {
      type: String,
    },
    phonenumber: {
      type: String,
      required: [true, "phonenumber is reuired"],
    },
    paymentMethod: {
      type: String,
    },
    status: {
      type: String,
    },
    statusCode: {
      type: String,
    },
    webhook: {
      type: String,
    },
    dateInitiated: {
      type: Date,
    },
    dateConfirmed: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Transaction", transaction);
