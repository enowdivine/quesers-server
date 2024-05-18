import { Request, Response } from "express";
import sendEmail from "../../services/email/sendEmail";
import { websiteMail } from "./templates/emails";

class UserController {
  async sendEmail(req: Request, res: Response) {
    try {
      sendEmail({
        from: req.body.email || "spekoapp@gmail.com",
        to: "quesersteam@gmail.com",
        subject: req.body.subject,
        message: websiteMail(
          req.body.name as string,
          req.body.message as string
        ),
      });
      return res.status(200).json({
        message: "success, message sent successfully",
      });
    } catch (error: any) {
      console.error("error in forgot password", error);
      return res.status(500).json({
        message: "error sending message",
      });
    }
  }
}

export default UserController;
