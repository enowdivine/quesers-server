import { Request, Response } from "express";
import Transaction from "./transaction.model";
import userModel from "../user/user.model";
import vendorModel from "../vendor/vendor.model";
import resourceModel from "../resources/resources.model";
import _ from "lodash";
import bcrypt from "bcrypt";

class TransactionController {
  async create(req: Request, res: Response) {
    try {
      const user = await userModel.findOne({ phone: req.body.phone });
      if (user) {
        bcrypt.compare(
          req.body.password,
          user.password!,
          async (err: any, result: any) => {
            if (err) {
              return res.status(401).json({
                message: "Password Incorrect",
              });
            }
            if (result) {
              const transaction = new Transaction({
                items: req.body.items,
                userId: req.body.userId,
                amount: req.body.amount,
                phonenumber: req.body.phone,
                username: req.body.username,
                transactionType: "purchase",
              });
              await transaction
                .save()
                .then(async () => {
                  console.log("saveedddddddddddd");
                  const allItems: any[] = req.body.items;
                  allItems.map(async (item: any) => {
                    console.log(item);
                    let resource = await resourceModel.findOne({
                      _id: item._id,
                    });
                    if (resource) {
                      const saleCountIncrement = {
                        saleCount: resource.saleCount + 1,
                      };
                      resource = _.extend(resource, saleCountIncrement);
                      resource.save();
                    }
                    await userModel.updateOne(
                      { _id: req.body.userId },
                      {
                        $push: { resources: item._id },
                      }
                    );
                    await vendorModel.updateOne(
                      { _id: item.vendorId },
                      { $inc: { totalRevenue: item.price } }
                    );
                  });

                  console.log("one step getting here");
                  console.log("one step getting here");

                  // updating user and vendor

                  const user = await userModel.findOne({
                    _id: req.body.userId,
                  });
                  console.log("hellllllooooooo step getting here");
                  if (user) {
                    let revenue = user.walletBalance;
                    let balance = revenue - req.body.amount;

                    const userupdate = await userModel.updateOne(
                      { _id: req.body.userId },
                      {
                        $set: { walletBalance: balance },
                      }
                    );

                    console.log("sssssssssssssssss jjjjjjjjjjjjjjjjjjjjjjj");

                    if (userupdate.acknowledged) {
                      res.status(201).json({
                        message: "Successful",
                      });
                    }
                  }

                  // end updating user and vendor
                })
                .catch((err) => {
                  res.status(500).json({
                    message: "error making purchase",
                    error: err,
                  });
                });
            } else {
              res.status(401).json({
                message: "Error processing transaction",
              });
            }
          }
        );
      }
    } catch (error) {
      console.error("error creating transaction", error);
    }
  }

  async topUpWallet(req: Request, res: Response) {
    try {
      const transaction = new Transaction({
        userId: req.body.userId,
        transactionId: req.body.transactionId,
        financialTransId: req.body.financialTransId,
        amount: req.body.amount,
        revenue: req.body.revenue,
        phonenumber: req.body.phone,
        username: req.body.name,
        paymentMethod: req.body.medium,
        status: req.body.status,
        statusCode: req.body.statusCode,
        webhook: req.body.webhook,
        dateInitiated: req.body.dateInitiated,
        dateConfirmed: req.body.dateConfirmed,
        transactionType: "topup",
      });
      await transaction
        .save()
        .then(async () => {
          let user = await userModel.findOne({ _id: req.params.id });
          if (user) {
            const newWalletBalance = {
              walletBalance: user.walletBalance + req.body.revenue,
            };
            user = _.extend(user, newWalletBalance);
            user
              .save()
              .then(() => {
                res.status(201).json({
                  message: "success",
                });
              })
              .catch((err) => {
                res.status(500).json({
                  message: "error making topup",
                  error: err,
                });
              });
          }
        })
        .catch((err) => {
          res.status(500).json({
            message: "error finalizing transaction",
            error: err,
          });
        });
    } catch (error) {
      console.error("error deleting user", error);
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
