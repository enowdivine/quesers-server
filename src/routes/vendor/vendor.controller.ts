import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import _ from "lodash";
import Vendor from "./vendor.model";
import AdminModel from "../admin/admin.model";
import sendEmail from "../../services/email/sendEmail";
import { deleteObject } from "../../middleware/s3/s3";
import {
  forgotPassword,
  accountActivated,
  accountSuspended,
  accountDeactivated,
} from "./templates/welcomeEmail";

class VendorController {
  async register(req: Request, res: Response) {
    try {
      const multerFiles = JSON.parse(JSON.stringify(req.file));
      if (multerFiles) {
        const resume = {
          doc: multerFiles?.location,
          key: multerFiles?.key,
        };
        const admin = await AdminModel.findOne({ email: req.body.email });
        const user = await Vendor.findOne({ email: req.body.email });
        if (user || admin) {
          return res.status(409).json({
            message: "email already exist",
          });
        }
        const hash = await bcrypt.hash(req.body.password, 10);
        const newUser = new Vendor({
          username: req.body.username,
          email: req.body.email,
          phone: req.body.phone,
          occupation: req.body.occupation,
          educationLevel: req.body.educationLevel,
          resume: resume,
          password: hash,
        });
        newUser
          .save()
          .then((response) => {
            res.status(201).json({
              message: "success",
            });
          })
          .catch((err) => {
            console.error(err);
            res.status(500).json({
              message: "error submitting form",
              error: err,
            });
          });
      } else {
        return res.status(500).json({
          message: "resume upload failed",
        });
      }
    } catch (error) {
      console.error("error in instructor registration", error);
    }
  }

  async uploadProfileImage(req: Request, res: Response) {
    try {
      const instructor = await Vendor.findOne({ _id: req.params.id });
      if (instructor) {
        if (instructor.avatar !== null) {
          const imageKey = instructor.avatar.key;
          await deleteObject(imageKey);
        }
      }
      const multerFiles = JSON.parse(JSON.stringify(req.file));
      if (multerFiles) {
        const image = {
          doc: multerFiles?.location,
          key: multerFiles?.key,
        };
        const user = await Vendor.updateOne(
          {
            _id: req.params.id,
          },
          {
            $set: {
              avatar: image,
            },
          }
        );
        if (user.acknowledged) {
          const vendor = await Vendor.findOne({ _id: req.params.id });
          res.status(200).json({
            message: "update successful",
            vendor,
          });
        } else {
          res.status(404).json({
            message: "user not found",
          });
        }
      } else {
        return res.status(500).json({
          message: "image upload failed",
        });
      }
    } catch (error) {
      console.error("error uploading profile image", error);
    }
  }

  async login(req: Request, res: Response) {
    try {
      const user = await Vendor.findOne({ email: req.body.email });
      if (user) {
        if (user.status === "pending") {
          return res.status(500).json({
            message: "Account is under review",
          });
        }
        bcrypt.compare(
          req.body.password,
          user.password!,
          (err: any, result: any) => {
            if (err) {
              return res.status(401).json({
                message: "authentication failed",
              });
            }
            if (result) {
              const token: string = jwt.sign(
                {
                  id: user._id,
                  username: user.username,
                  phone: user.phone,
                },
                process.env.JWT_SECRET as string
              );
              return res.status(200).json({
                message: "login successful",
                token: token,
              });
            }
            res.status(401).json({
              message: "authentication failed",
            });
          }
        );
      } else {
        return res.status(401).json({
          message: "authentication failed",
        });
      }
    } catch (error) {
      console.error("user login error", error);
      return res.status(500);
    }
  }

  async update(req: Request, res: Response) {
    const user = await Vendor.updateOne(
      {
        _id: req.params.id,
      },
      {
        $set: {
          username: req.body.username,
          email: req.body.email,
          phone: req.body.phone,
          occupation: req.body.occupation,
          educationLevel: req.body.educationLevel,
        },
      }
    );
    if (user.acknowledged) {
      const newuser = await Vendor.findOne({ _id: req.params.id });
      const token: string = jwt.sign(
        {
          id: newuser?._id,
          username: newuser?.username,
          phone: newuser?.phone,
        },
        process.env.JWT_SECRET as string
      );
      res.status(200).json({
        message: "update successful",
        token: token,
      });
    } else {
      res.status(404).json({
        message: "user not found",
      });
    }
  }

  async updatePassword(req: Request, res: Response) {
    let user = await Vendor.findOne({ _id: req.params.id });
    if (user) {
      const { currentPassword, newPassword } = req.body;
      bcrypt
        .compare(currentPassword, user.password!)
        .then((match: any) => {
          if (match) {
            bcrypt.hash(newPassword, 10, (error: any, hash: any) => {
              if (error) {
                return res.status(500).json({
                  error: error,
                });
              }
              const passwordUpdate = {
                password: hash,
              };
              user = _.extend(user, passwordUpdate);
              if (user) {
                user
                  .save()
                  .then((result: any) => {
                    res.status(200).json({
                      message: "password updated",
                    });
                  })
                  .catch((error: any) => {
                    res.status(500).json({
                      error: error,
                    });
                  });
              }
            });
          } else {
            return res.status(500).json({
              message: "passwords do not match",
            });
          }
        })
        .catch((err: any) => {
          return res.status(401).json({
            error: err,
          });
        });
    }
  }

  async vendor(req: Request, res: Response) {
    try {
      const user = await Vendor.findOne({ _id: req.params.id });
      if (user) {
        return res.status(200).json(user);
      } else {
        return res.status(404).json({
          message: "instructor not found",
        });
      }
    } catch (error) {
      console.error("error fetching instructor", error);
    }
  }

  async vendors(req: Request, res: Response) {
    try {
      const users = await Vendor.find().sort({ createdAt: -1 });
      if (users) {
        return res.status(200).json(users);
      } else {
        return res.status(404).json({
          message: "no instructor found",
        });
      }
    } catch (error) {
      console.error("error fetching instructors", error);
    }
  }

  async forgotPassword(req: Request, res: Response) {
    try {
      const user = await Vendor.findOne({ email: req.body.email });
      if (user) {
        const resetToken: string = jwt.sign(
          {
            userId: user._id,
            email: user.email,
          },
          process.env.JWT_SECRET as string,
          {
            expiresIn: "1h",
          }
        );
        const url = `<a href="${process.env.FRONTEND_URL}/new-password/${resetToken}">Click here</a>`;
        sendEmail({
          to: user.email as string,
          subject: "Quesers: Reset Password",
          message: forgotPassword(url),
        });
        return res.status(200).json({
          message: "success, check your inbox",
        });
      } else {
        return res.status(500).json({
          message: "email does not exist",
        });
      }
    } catch (error) {
      console.error("error in forgot password", error);
    }
  }

  async newPassword(req: Request, res: Response) {
    try {
      const decoded: any = jwt.verify(
        req.params.token,
        process.env.JWT_SECRET as string
      );
      let user = await Vendor.findOne({
        _id: decoded.userId,
      });
      if (user) {
        const { password } = req.body;
        bcrypt.hash(password, 10, async (error: any, hash: any) => {
          if (error) {
            return res.status(500).json({
              error: error,
            });
          }
          const passwordUpdate = {
            password: hash,
          };
          user = _.extend(user, passwordUpdate);
          user
            .save()
            .then((result: any) => {
              const token: string = jwt.sign(
                {
                  id: result._id,
                  username: result.username,
                  phone: result.phone,
                },
                process.env.JWT_SECRET as string
              );
              res.status(200).json({
                message: "password updated",
                token: token,
              });
            })
            .catch((error: any) => {
              res.status(500).json({
                error: error,
              });
            });
        });
      } else {
        return res.status(500).json({
          message: "email does not exist",
        });
      }
    } catch (error) {
      console.error("error in new password", error);
      res.status(500).json({
        message: "an error occured",
        error: error,
      });
    }
  }

  async updateStatus(req: Request, res: Response) {
    try {
      const user = await Vendor.findOne({ _id: req.params.id });
      if (user) {
        user.status = req.body.status;
        await user.save().then(async () => {
          sendEmail({
            to: user?.email as string,
            subject: `Account ${req.body.status}`,
            message:
              req.body.status === "active"
                ? accountActivated(user?.username as string, req.body.status)
                : req.body.status === "suspended"
                ? accountSuspended(user?.username as string, req.body.status)
                : accountDeactivated(user?.username as string, req.body.status),
          });
          const response = await Vendor.findOne({ _id: req.params.id });
          return res.status(200).json({
            message: "vendor status updated",
            response,
          });
        });
      } else {
        return res.status(404).json({
          message: "vendor not found",
        });
      }
    } catch (error) {
      console.error(error);
    }
  }

  async deleteVendor(req: Request, res: Response) {
    try {
      const user = await Vendor.findOne({ _id: req.params.id });
      if (user) {
        if (user.avatar !== null) {
          const imageKey = user.avatar.key;
          await deleteObject(imageKey);
        }
      }
      const response = await Vendor.deleteOne({ _id: req.params.id });
      if (response.deletedCount > 0) {
        res.status(200).json({
          message: "instructor deleted successfully",
        });
      } else {
        res.status(404).json({
          message: "instructor not found",
        });
      }
    } catch (error) {
      console.error("error fetching instructor", error);
    }
  }
}

export default VendorController;
