import { Request, Response } from "express";
import bcrypt from "bcrypt";
import Withdraw from "./withdraw.model";
import vendorModel from "../vendor/vendor.model";
import sendEmail from "../../services/email/sendEmail";
import {
  widthdrawalRequest,
  approveRequest,
  rejectRequest,
} from "./templates/emails";

class ChapterController {
  async create(req: Request, res: Response) {
    try {
      const user = await vendorModel.findOne({ _id: req.body.userId });
      if (user) {
        bcrypt.compare(
          req.body.password,
          user.password!,
          async (err: any, result: any) => {
            if (err) {
              res.status(401).json({
                message: "password incorrect",
              });
            }
            if (result) {
              const withdraw = new Withdraw({
                userId: req.body.userId,
                amount: req.body.amount,
              });
              await withdraw
                .save()
                .then((withdrawal) => {
                  // sendEmail({
                  //   to: user?.email as string,
                  //   subject: `New Withdrawal Request`,
                  //   message: widthdrawalRequest(
                  //     user?.username as string,
                  //     req.body.amount as number
                  //   ),
                  // });
                  res.status(201).json({
                    message: "request sent",
                    withdrawal,
                  });
                })
                .catch((err) => {
                  res.status(500).json({
                    message: "error sending request",
                    error: err,
                  });
                });
            }
          }
        );
      }
    } catch (error) {
      console.error("error sending request", error);
      return res.status(500).json({
        message: "an error occured",
      });
    }
  }

  async WithdrawRequest(req: Request, res: Response) {
    try {
      const request = await Withdraw.findOne({ _id: req.params.id });
      if (request) {
        return res.status(200).json(request);
      } else {
        return res.status(404).json({
          message: "request not found",
        });
      }
    } catch (error) {
      console.error("error fetching request", error);
    }
  }

  async userWithdrawalsRequest(req: Request, res: Response) {
    try {
      const requests = await Withdraw.find({
        userId: req.params.userId,
      }).sort({ createdAt: -1 });
      if (requests) {
        return res.status(200).json(requests);
      } else {
        return res.status(404).json({
          message: "no chapter found",
        });
      }
    } catch (error) {
      console.error("error fetching requests", error);
    }
  }

  async allWithdrawalsRequest(req: Request, res: Response) {
    try {
      const requests = await Withdraw.find({}).sort({ createdAt: -1 });
      if (requests) {
        return res.status(200).json(requests);
      } else {
        return res.status(404).json({
          message: "no request found",
        });
      }
    } catch (error) {
      console.error("error fetching requests", error);
    }
  }

  async updateStatus(req: Request, res: Response) {
    try {
      const request = await Withdraw.findOne({ _id: req.params.id });
      if (request) {
        request.status = req.body.status;
        await request.save().then(async (response) => {
          const user = await vendorModel.findOne({ _id: response.userId });

          if (user && response.amount) {
            if (req.body.status === "approved") {
              let revenue = user.totalRevenue;
              let revenueBalance = revenue - response.amount;
              const res = await vendorModel.updateOne(
                { _id: response.userId },
                { $set: { totalRevenue: revenueBalance } }
              );
            }

            sendEmail({
              to: user?.email as string,
              subject: `Withdrawal Request ${req.body.status}`,
              message:
                req.body.status === "approved"
                  ? approveRequest(user?.username as string, req.body.status)
                  : rejectRequest(user?.username as string, req.body.status),
            });
            const updated = await Withdraw.findOne({ _id: req.params.id });
            return res.status(200).json({
              message: "request status updated",
              updated,
            });
          }
        });
      } else {
        return res.status(404).json({
          message: "request not found",
        });
      }
    } catch (error) {
      console.error(error);
    }
  }
}

export default ChapterController;
