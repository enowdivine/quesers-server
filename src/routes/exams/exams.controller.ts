import { Request, Response } from "express";
import Exam from "./exams.model";
import slugify from "../../helpers/slugify";

class RTController {
  async create(req: Request, res: Response) {
    try {
      const slug = slugify(req.body.title);
      const RT = await Exam.findOne({ slug: slug });
      if (RT) {
        return res.status(409).json({
          message: "exam already exist",
        });
      }
      const newRT = new Exam({
        title: req.body.title,
        slug: slug,
      });
      newRT
        .save()
        .then((exam) => {
          res.status(201).json({
            message: "success",
            exam,
          });
        })
        .catch((err) => {
          res.status(500).json({
            message: "error creating exam",
            error: err,
          });
        });
    } catch (error) {
      console.error("error creating exam");
    }
  }

  async read(req: Request, res: Response) {
    try {
      const exam = await Exam.findOne({ _id: req.params.id });
      if (exam) {
        return res.status(200).json(exam);
      } else {
        return res.status(404).json({
          message: "exam not found",
        });
      }
    } catch (error) {
      console.error("error fetching exam", error);
    }
  }

  async reads(req: Request, res: Response) {
    try {
      const exams = await Exam.find().sort({ createdAt: -1 });
      if (exams) {
        return res.status(200).json(exams);
      } else {
        return res.status(404).json({
          message: "no exam found",
        });
      }
    } catch (error) {
      console.error("error fetching exams", error);
    }
  }

  async update(req: Request, res: Response) {
    try {
      const slug = slugify(req.body.title);
      const exam = await Exam.updateOne(
        {
          _id: req.params.id,
        },
        {
          $set: {
            title: req.body.title,
            slug: slug,
          },
        }
      );
      if (exam.acknowledged) {
        const response = await Exam.findOne({ _id: req.params.id });
        res.status(200).json({
          message: "success",
          response,
        });
      } else {
        res.status(404).json({
          message: "exam not found",
        });
      }
    } catch (error) {
      console.error("error updating exam", error);
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const response = await Exam.deleteOne({ _id: req.params.id });
      if (response.deletedCount > 0) {
        res.status(200).json({
          message: "success",
        });
      } else {
        res.status(404).json({
          message: "exam not found",
        });
      }
    } catch (error) {
      console.error("error deleting exam", error);
    }
  }
}

export default RTController;
