import { Request, Response } from "express";
import School from "./schools.model";
import slugify from "../../helpers/slugify";

class RTController {
  async create(req: Request, res: Response) {
    try {
      const slug = slugify(req.body.title);
      const RT = await School.findOne({ slug: slug });
      if (RT) {
        return res.status(409).json({
          message: "school already exist",
        });
      }
      const newRT = new School({
        title: req.body.title,
        slug: slug,
      });
      newRT
        .save()
        .then((resourceType) => {
          res.status(201).json({
            message: "success",
            resourceType,
          });
        })
        .catch((err) => {
          res.status(500).json({
            message: "error creating school",
            error: err,
          });
        });
    } catch (error) {
      console.error("error creating school");
    }
  }

  async read(req: Request, res: Response) {
    try {
      const school = await School.findOne({ _id: req.params.id });
      if (school) {
        return res.status(200).json(school);
      } else {
        return res.status(404).json({
          message: "resourse type not found",
        });
      }
    } catch (error) {
      console.error("error fetching school", error);
    }
  }

  async reads(req: Request, res: Response) {
    try {
      const schools = await School.find().sort({ createdAt: -1 });
      if (schools) {
        return res.status(200).json(schools);
      } else {
        return res.status(404).json({
          message: "no resourse type found",
        });
      }
    } catch (error) {
      console.error("error fetching schools", error);
    }
  }

  async update(req: Request, res: Response) {
    try {
      const slug = slugify(req.body.title);
      const school = await School.updateOne(
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
      if (school.acknowledged) {
        const response = await School.findOne({ _id: req.params.id });
        res.status(200).json({
          message: "success",
          response,
        });
      } else {
        res.status(404).json({
          message: "resourse type not found",
        });
      }
    } catch (error) {
      console.error("error updating resourse type", error);
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const response = await School.deleteOne({ _id: req.params.id });
      if (response.deletedCount > 0) {
        res.status(200).json({
          message: "success",
        });
      } else {
        res.status(404).json({
          message: "school not found",
        });
      }
    } catch (error) {
      console.error("error deleting school", error);
    }
  }
}

export default RTController;
