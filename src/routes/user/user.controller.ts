import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import _ from "lodash";
import User from "./user.model";
import Session from "../sessions/session.model";
import sendEmail from "../../services/email/sendEmail";
import { deleteObject } from "../../middleware/s3/s3";
import {
  welcomeEmail,
  emailVerification,
  forgotPasswordEmail,
  accountActivated,
  accountSuspended,
  accountDeactivated,
} from "./templates/emails";

class UserController {
  async register(req: Request, res: Response) {
    try {
      const user = await User.findOne({ phone: req.body.phone });
      if (user) {
        return res.status(409).json({
          message: "user already exist",
        });
      }
      const hash = await bcrypt.hash(req.body.password, 10);
      const newUser = new User({
        username: req.body.username,
        phone: req.body.phone,
        password: hash,
      });
      newUser
        .save()
        .then(async (response) => {
          const token: string = jwt.sign(
            {
              id: response._id,
              username: response.username,
              phone: response.phone,
            },
            process.env.JWT_SECRET as string
          );
          // Store new session in database
          const newSession = new Session({
            userId: response._id,
            token: token,
          });
          await newSession.save();
          res.status(201).json({
            message: "success, welcome",
            token,
          });
        })
        .catch((err) => {
          res.status(500).json({
            message: "error creating user",
            error: err,
          });
        });
    } catch (error) {
      console.error("error in user registration", error);
    }
  }

  async login(req: Request, res: Response) {
    try {
      const user = await User.findOne({ phone: req.body.phone });
      if (user) {
        bcrypt.compare(
          req.body.password,
          user.password!,
          async (err: any, result: any) => {
            if (err) {
              return res.status(401).json({
                message: "authentication failed",
              });
            }
            if (result) {
              // Check for existing active session
              // const existingSession = await Session.findOne({
              //   userId: user._id,
              // });

              // if (existingSession) {
              //   // Invalidate previous session token
              //   existingSession.token = "";
              //   await existingSession.save();
              // }

              // Generate new JWT
              const token: string = jwt.sign(
                {
                  id: user._id,
                  username: user.username,
                  phone: user.phone,
                },
                process.env.JWT_SECRET as string
              );

              // Store new session in database
              // const newSession = new Session({
              //   userId: user._id,
              //   token: token,
              // });
              // await newSession.save();
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
    const user = await User.updateOne(
      {
        _id: req.params.id,
      },
      {
        $set: {
          username: req.body.username,
          phone: req.body.phone,
        },
      }
    );
    if (user.acknowledged) {
      const newuser = await User.findOne({ _id: req.params.id });
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

  async updatePreference(req: Request, res: Response) {
    const user = await User.updateOne(
      {
        _id: req.params.id,
      },
      {
        $set: {
          preference: req.body,
        },
      }
    );
    if (user.acknowledged) {
      const updated = await User.findOne({ _id: req.params.id });
      res.status(200).json({
        message: "update successful",
        preference: updated?.preference,
      });
    } else {
      res.status(404).json({
        message: "user not found",
      });
    }
  }

  async uploadProfileImage(req: Request, res: Response) {
    try {
      const user = await User.findOne({ _id: req.params.id });
      if (user) {
        if (user.avatar !== null) {
          const imageKey = user.avatar.key;
          await deleteObject(imageKey);
        }
      }
      const multerFiles = JSON.parse(JSON.stringify(req.file));
      console.log(multerFiles);
      if (multerFiles) {
        const image = {
          doc: multerFiles?.location,
          key: multerFiles?.key,
        };
        const user = await User.updateOne(
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
          const newuser = await User.findOne({ _id: req.params.id });
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
      } else {
        return res.status(500).json({
          message: "image upload failed",
        });
      }
    } catch (error) {
      console.error("error uploading profile image", error);
    }
  }

  async updatePassword(req: Request, res: Response) {
    let user = await User.findOne({ _id: req.params.id });
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

  async user(req: Request, res: Response) {
    try {
      const user = await User.findOne({ _id: req.params.id });
      if (user) {
        return res.status(200).json(user);
      } else {
        return res.status(404).json({
          message: "user not found",
        });
      }
    } catch (error) {
      console.error("error fetching user", error);
    }
  }

  async users(req: Request, res: Response) {
    try {
      const users = await User.find().sort({ createdAt: -1 });
      if (users) {
        return res.status(200).json(users);
      } else {
        return res.status(404).json({
          message: "no user found",
        });
      }
    } catch (error) {
      console.error("error fetching users", error);
    }
  }

  async forgotPassword(req: Request, res: Response) {
    try {
      const user = await User.findOne({ phone: req.body.phone });
      if (user) {
        const resetToken: string = jwt.sign(
          {
            userId: user._id,
            phone: user.phone,
          },
          process.env.JWT_SECRET as string,
          {
            expiresIn: "1h",
          }
        );
        const url = `${process.env.FRONTEND_URL}/new-password/${resetToken}`;
        sendEmail({
          to: "quesers@gmail.com",
          subject: "Deonicode: Password Reset",
          message: forgotPasswordEmail(user.username as string, url),
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
      let user = await User.findOne({ phone: req.body.phone });
      if (user) {
        const { newPassword } = req.body;
        bcrypt.hash(newPassword, 10, async (error: any, hash: any) => {
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
          message: "password update error",
        });
      }
    } catch (error) {
      console.error("error in new password", error);
    }
  }

  // async addToWishlist(req: Request, res: Response) {
  //   try {
  //     const user = await User.findOne({ _id: req.params.id });
  //     if (user) {
  //       const itemID = req.body.item._id;
  //       const userWishlist = user.wishlist;
  //       const temp = userWishlist.filter((item) => item.id === itemID);
  //       if (temp.length > 0) {
  //         return res.status(400).json({
  //           message: "item already exist in wislist",
  //         });
  //       }
  //       user.wishlist.push(req.body.item);
  //       user.save().then(() => {
  //         return res.status(200).json({
  //           message: "item added to wishlist",
  //         });
  //       });
  //     }
  //   } catch (error) {
  //     console.error("error adding item to wishlist", error);
  //   }
  // }

  // async viewWishlist(req: Request, res: Response) {
  //   try {
  //     const user = await User.findOne({ _id: req.params.id });
  //     if (user) {
  //       const wishlist = user.wishlist;
  //       return res.status(200).json({
  //         wishlist: wishlist,
  //       });
  //     } else {
  //       return res.status(404).json({
  //         message: "user not found",
  //       });
  //     }
  //   } catch (error) {
  //     console.error("error fetching wishlist", error);
  //   }
  // }

  // async removeFromWishlist(req: Request, res: Response) {
  //   try {
  //     const user = await User.updateOne(
  //       { _id: req.params.id },
  //       {
  //         $pull: {
  //           wishlist: {
  //             _id: req.body.item._id,
  //           },
  //         },
  //       }
  //     );
  //     if (user.acknowledged) {
  //       return res.status(200).json({
  //         message: "item removed from wishlist",
  //       });
  //     } else {
  //       return res.status(404).json({
  //         message: "item not found",
  //       });
  //     }
  //   } catch (error) {
  //     console.error("error removing item from wishlist", error);
  //   }
  // }

  async addToCart(req: Request, res: Response) {
    try {
      const user = await User.findOne({ _id: req.params.id });
      if (user) {
        const itemID = req.body.item._id;
        const userCart = user.cart;
        const temp = userCart.filter((item) => item._id === itemID);
        if (temp.length > 0) {
          return res.status(400).json({
            message: "item already exist in cart",
          });
        }
        user.cart.push(req.body.item);
        user.save().then(() => {
          return res.status(200).json({
            message: "item added to cart",
          });
        });
      }
    } catch (error) {
      console.error("error adding item to cart", error);
    }
  }

  async removeFromCart(req: Request, res: Response) {
    try {
      const user = await User.updateOne(
        { _id: req.params.id },
        {
          $pull: {
            cart: {
              _id: req.body.item._id,
            },
          },
        }
      );
      if (user.acknowledged) {
        return res.status(200).json({
          message: "item removed from cart",
        });
      } else {
        return res.status(404).json({
          message: "item not found",
        });
      }
    } catch (error) {
      console.error("error removing item from cart", error);
    }
  }

  async viewCart(req: Request, res: Response) {
    try {
      const user = await User.findOne({ _id: req.params.id });
      if (user) {
        const cart = user.cart;
        return res.status(200).json(cart);
      } else {
        return res.status(404).json({
          message: "user not found",
        });
      }
    } catch (error) {
      console.error("error fetching cart", error);
    }
  }

  // async updateStatus(req: Request, res: Response) {
  //   try {
  //     const user = await User.findOne({ _id: req.params.id });
  //     if (user) {
  //       user.status = req.body.status;
  //       await user.save().then(() => {
  //         sendEmail({
  //           to: user?.email as string,
  //           subject: `Account ${req.body.status}`,
  //           message:
  //             req.body.status === "active"
  //               ? accountActivated(user?.username as string, req.body.status)
  //               : req.body.status === "suspended"
  //               ? accountSuspended(user?.username as string, req.body.status)
  //               : accountDeactivated(user?.username as string, req.body.status),
  //         });
  //         return res.status(200).json({
  //           message: "user status updated",
  //         });
  //       });
  //     } else {
  //       return res.status(404).json({
  //         message: "user not found",
  //       });
  //     }
  //   } catch (error) {
  //     console.error(error);
  //   }
  // }

  async deleteUser(req: Request, res: Response) {
    try {
      const user = await User.findOne({ _id: req.params.id });
      if (user) {
        if (user.avatar !== null) {
          const imageKey = user.avatar.key;
          await deleteObject(imageKey);
        }
      }
      const response = await User.deleteOne({ _id: req.params.id });
      if (response.deletedCount > 0) {
        res.status(200).json({
          message: "success",
        });
      } else {
        res.status(404).json({
          message: "user not found",
        });
      }
    } catch (error) {
      console.error("error deleting user", error);
    }
  }
}

export default UserController;
