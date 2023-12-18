import mongoose from "mongoose";

const transaction = new mongoose.Schema(
  {
    resourceId: {
      type: String,
      required: [true, "resourceId is reuired"],
    },
    userId: {
      type: String,
      required: [true, "userId is reuired"],
    },
    vendorId: {
      type: String,
      required: [true, "vendorId is reuired"],
    },
    transactionId: {
      type: String,
      required: [true, "transactionId is reuired"],
    },
    financialTransId: {
      type: String,
      required: [true, "financialTransId is reuired"],
    },
    amount: {
      type: Number,
      required: [true, "amount is reuired"],
    },
    revenue: {
      type: Number,
      required: [true, "revenue is reuired"],
    },
    username: {
      type: String,
      required: [true, "username is reuired"],
    },
    email: {
      type: String,
      required: [true, "email is reuired"],
    },
    phonenumber: {
      type: String,
      required: [true, "phonenumber is reuired"],
    },
    paymentMethod: {
      type: String,
      required: [true, "payment method is reuired"],
    },
    status: {
      type: String,
      required: [true, "status method is reuired"],
    },
    statusCode: {
      type: String,
      required: [true, "statusCode method is reuired"],
    },
    webhook: {
      type: String,
      required: [true, "webhook method is reuired"],
    },
    dateInitiated: {
      type: Date,
      required: [true, "dateInitiated method is reuired"],
    },
    dateConfirmed: {
      type: Date,
      required: [true, "dateConfirmed method is reuired"],
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Transaction", transaction);
