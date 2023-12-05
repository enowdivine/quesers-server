import { Request, Response } from "express";
import Cert from "./certificate.model";

class CetificateController {
  async register(req: Request, res: Response) {
    try {
      const userId = req.body.userId;
      const courseId = req.body.courseId;
      const cert = await Cert.find({
        $and: [
          {
            userId: { $regex: userId },
          },
          {
            courseId: { $regex: courseId },
          },
        ],
      });
      if (cert.length > 0) {
        return res.status(409).json({
          message: "certificate already exist",
        });
      }
      const certificate = new Cert({
        userId: req.body.userId,
        courseId: req.body.courseId,
        certId: req.body.certId,
        issued: req.body.issued,
      });
      await certificate
        .save()
        .then((response) => {
          res.status(201).json({
            message: "certificate created",
            response,
          });
        })
        .catch((err) => {
          res.status(500).json({
            message: "error registering certificate",
            error: err,
          });
        });
    } catch (error) {
      console.error("error registering certificate", error);
    }
  }

  async certificate(req: Request, res: Response) {
    try {
      const userId = req.body.userId;
      const courseId = req.body.courseId;
      const certId = req.body.certId;
      const certificate = await Cert.find({
        $and: [
          {
            userId: { $regex: userId },
          },
          {
            courseId: { $regex: courseId },
          },
          {
            certId: { $regex: certId },
          },
        ],
      });
      if (certificate.length > 0) {
        return res.status(200).json(certificate);
      } else {
        return res.status(404).json({
          message: "certificate not found",
        });
      }
    } catch (error) {
      console.error("error fetching certificate", error);
    }
  }

  async certificates(req: Request, res: Response) {
    try {
      const certificates = await Cert.find().sort({ createdAt: -1 });
      if (certificates) {
        return res.status(200).json(certificates);
      } else {
        return res.status(404).json({
          message: "no certificates found",
        });
      }
    } catch (error) {
      console.error("error fetching certificates", error);
    }
  }
}

export default CetificateController;
