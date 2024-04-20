import { Request, Response } from "express";
import Category from "./courses.model";
import slugify from "../../helpers/slugify";

class RTController {
  async create(req: Request, res: Response) {
    try {
      const slug = slugify(req.body.title);
      const RT = await Category.findOne({ slug: slug });
      if (RT) {
        return res.status(409).json({
          message: "category already exist",
        });
      }
      const newRT = new Category({
        title: req.body.title,
        slug: slug,
        examId: req.body.examId,
        schoolId: req.body.schoolId,
        facultyId: req.body.facultyId,
        departmentId: req.body.departmentId,
        level: req.body.level,
        semester: req.body.semester,
      });
      newRT
        .save()
        .then((category) => {
          res.status(201).json({
            message: "success",
            category,
          });
        })
        .catch((err) => {
          res.status(500).json({
            message: "error creating category",
            error: err,
          });
        });
    } catch (error) {
      console.error("error creating category");
    }
  }

  async read(req: Request, res: Response) {
    try {
      const category = await Category.findOne({ _id: req.params.id });
      if (category) {
        return res.status(200).json(category);
      } else {
        return res.status(404).json({
          message: "category not found",
        });
      }
    } catch (error) {
      console.error("error fetching category", error);
    }
  }

  async reads(req: Request, res: Response) {
    try {
      const categories = await Category.find().sort({ createdAt: -1 });
      if (categories) {
        return res.status(200).json(categories);
      } else {
        return res.status(404).json({
          message: "no category found",
        });
      }
    } catch (error) {
      console.error("error fetching category", error);
    }
  }

  async update(req: Request, res: Response) {
    try {
      const slug = slugify(req.body.title);
      const category = await Category.updateOne(
        {
          _id: req.params.id,
        },
        {
          $set: {
            title: req.body.title,
            slug: slug,
            examId: req.body.examId,
            schoolId: req.body.schoolId,
            facultyId: req.body.facultyId,
            departmentId: req.body.departmentId,
            level: req.body.level,
            semester: req.body.semester,
          },
        }
      );
      if (category.acknowledged) {
        const response = await Category.findOne({ _id: req.params.id });
        res.status(200).json({
          message: "success",
          response,
        });
      } else {
        res.status(404).json({
          message: "category not found",
        });
      }
    } catch (error) {
      console.error("error updating category", error);
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const response = await Category.deleteOne({ _id: req.params.id });
      if (response.deletedCount > 0) {
        res.status(200).json({
          message: "success",
        });
      } else {
        res.status(404).json({
          message: "category not found",
        });
      }
    } catch (error) {
      console.error("error deleting category", error);
    }
  }
}

export default RTController;
