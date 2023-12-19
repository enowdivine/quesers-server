import { Request, Response } from "express";
import Faculty from "./faculty.model";
import slugify from "../../helpers/slugify";

class FacultyController {
  async create(req: Request, res: Response) {
    try {
      const slug = slugify(req.body.title);
      const faculty = await Faculty.findOne({ slug: slug });
      if (faculty) {
        return res.status(409).json({
          message: "faculty already exist",
        });
      }
      const newRT = new Faculty({
        schoolId: req.body.schoolId,
        title: req.body.title,
        slug: slug,
      });
      newRT
        .save()
        .then((response) => {
          res.status(201).json({
            message: "success",
            response,
          });
        })
        .catch((err) => {
          res.status(500).json({
            message: "error creating faculty",
            error: err,
          });
        });
    } catch (error) {
      console.error("error creating faculty");
    }
  }

  async read(req: Request, res: Response) {
    try {
      const faculty = await Faculty.findOne({ _id: req.params.id });
      if (faculty) {
        return res.status(200).json(faculty);
      } else {
        return res.status(404).json({
          message: "faculty not found",
        });
      }
    } catch (error) {
      console.error("error fetching faculty", error);
    }
  }

  async reads(req: Request, res: Response) {
    try {
      const faculties = await Faculty.find().sort({ createdAt: -1 });
      if (faculties) {
        return res.status(200).json(faculties);
      } else {
        return res.status(404).json({
          message: "no faculty found",
        });
      }
    } catch (error) {
      console.error("error fetching faculties", error);
    }
  }

  async update(req: Request, res: Response) {
    try {
      const slug = slugify(req.body.title);
      const faculty = await Faculty.updateOne(
        {
          _id: req.params.id,
        },
        {
          $set: {
            schoolId: req.body.schoolId,
            title: req.body.title,
            slug: slug,
          },
        }
      );
      if (faculty.acknowledged) {
        res.status(200).json({
          message: "success",
        });
      } else {
        res.status(404).json({
          message: "faculty not found",
        });
      }
    } catch (error) {
      console.error("error updating faculty", error);
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const response = await Faculty.deleteOne({ _id: req.params.id });
      if (response.deletedCount > 0) {
        res.status(200).json({
          message: "success",
        });
      } else {
        res.status(404).json({
          message: "faculty not found",
        });
      }
    } catch (error) {
      console.error("error deleting faculty", error);
    }
  }
}

export default FacultyController;
