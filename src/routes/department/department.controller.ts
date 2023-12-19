import { Request, Response } from "express";
import Department from "./department.model";
import slugify from "../../helpers/slugify";

class DepartmentController {
  async create(req: Request, res: Response) {
    try {
      const slug = slugify(req.body.title);
      const department = await Department.findOne({ slug: slug });
      if (department) {
        return res.status(409).json({
          message: "department already exist",
        });
      }
      const newRT = new Department({
        facultyId: req.body.facultyId,
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
            message: "error creating department",
            error: err,
          });
        });
    } catch (error) {
      console.error("error creating department");
    }
  }

  async read(req: Request, res: Response) {
    try {
      const department = await Department.findOne({ _id: req.params.id });
      if (department) {
        return res.status(200).json(department);
      } else {
        return res.status(404).json({
          message: "department not found",
        });
      }
    } catch (error) {
      console.error("error fetching department", error);
    }
  }

  async reads(req: Request, res: Response) {
    try {
      const departments = await Department.find().sort({ createdAt: -1 });
      if (departments) {
        return res.status(200).json(departments);
      } else {
        return res.status(404).json({
          message: "no department found",
        });
      }
    } catch (error) {
      console.error("error fetching departments", error);
    }
  }

  async update(req: Request, res: Response) {
    try {
      const slug = slugify(req.body.title);
      const department = await Department.updateOne(
        {
          _id: req.params.id,
        },
        {
          $set: {
            facultyId: req.body.facultyId,
            title: req.body.title,
            slug: slug,
          },
        }
      );
      if (department.acknowledged) {
        res.status(200).json({
          message: "success",
        });
      } else {
        res.status(404).json({
          message: "department not found",
        });
      }
    } catch (error) {
      console.error("error updating department", error);
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const response = await Department.deleteOne({ _id: req.params.id });
      if (response.deletedCount > 0) {
        res.status(200).json({
          message: "success",
        });
      } else {
        res.status(404).json({
          message: "department not found",
        });
      }
    } catch (error) {
      console.error("error deleting department", error);
    }
  }
}

export default DepartmentController;
