import { Request, Response } from "express";
import Transaction from "./transaction.model";
import userModel from "../user/user.model";
import vendorModel from "../vendor/vendor.model";
import resourceModel from "../resources/resources.model";
import _ from "lodash";

class TransactionController {
  async create(req: Request, res: Response) {
    try {
      const transaction = new Transaction({
        resourceId: req.body.resourceId,
        userId: req.body.userId,
        vendorId: req.body.vendorId,
        transactionId: req.body.transactionId,
        financialTransId: req.body.financialTransId,
        amount: req.body.amount,
        revenue: req.body.revenue,
        phonenumber: req.body.phone,
        username: req.body.name,
        email: req.body.email,
        paymentMethod: req.body.medium,
        status: req.body.status,
        statusCode: req.body.statusCode,
        webhook: req.body.webhook,
        dateInitiated: req.body.dateInitiated,
        dateConfirmed: req.body.dateConfirmed,
      });
      await transaction
        .save()
        .then(async () => {
          let resource = await resourceModel.findOne({
            _id: req.body.resourceId,
          });
          if (resource) {
            const saleCountIncrement = {
              saleCount: resource.saleCount + 1,
            };
            resource = _.extend(resource, saleCountIncrement);
            resource.save().then(async () => {
              const user = await userModel.findOne({ _id: req.body.userId });
              if (user) {
                let revenue = user.walletBalance;
                let balance = revenue - req.body.amount;

                const userupdate = await userModel.updateOne(
                  { _id: req.body.userId },
                  {
                    $push: { resources: req.body.resourceId },
                    $set: { walletBalance: balance },
                  }
                );
                const vendor = await vendorModel.updateOne(
                  { _id: req.body.vendorId },
                  { $inc: { totalRevenue: req.body.revenue } }
                );
                if (userupdate.acknowledged && vendor.acknowledged) {
                  res.status(201).json({
                    message: "Successful",
                  });
                }
              }
            });
          } else {
            res.status(404).json({
              message: "resource not found",
            });
          }
        })
        .catch((err) => {
          res.status(500).json({
            message: "error making purchase",
            error: err,
          });
        });
    } catch (error) {
      console.error("error creating transaction", error);
    }
  }

  async transaction(req: Request, res: Response) {
    try {
      const transaction = await Transaction.findOne({ _id: req.params.id });
      if (transaction) {
        return res.status(200).json({
          transaction,
        });
      } else {
        return res.status(404).json({
          message: "transaction not found",
        });
      }
    } catch (error) {
      console.error("error fetching transaction", error);
    }
  }

  async vendorTransaction(req: Request, res: Response) {
    try {
      const transactions = await Transaction.find({
        vendorId: req.params.vendorId,
      }).sort({ createdAt: -1 });
      if (transactions) {
        return res.status(200).json(transactions);
      } else {
        return res.status(404).json({
          message: "No transaction found",
        });
      }
    } catch (error) {
      console.error("error fetching transactions", error);
    }
  }

  async transactions(req: Request, res: Response) {
    try {
      const transactions = await Transaction.find().sort({ createdAt: -1 });
      if (transactions) {
        return res.status(200).json(transactions);
      } else {
        return res.status(404).json({
          message: "no transaction found",
        });
      }
    } catch (error) {
      console.error("error fetching transaction", error);
    }
  }
}

export default TransactionController;
