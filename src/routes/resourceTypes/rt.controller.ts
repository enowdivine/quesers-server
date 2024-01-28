import { Request, Response } from "express";
import RessourceType from "./rt.model";
import slugify from "../../helpers/slugify";

class RTController {
  async create(req: Request, res: Response) {
    try {
      const slug = slugify(req.body.title);
      const RT = await RessourceType.findOne({ slug: slug });
      if (RT) {
        return res.status(409).json({
          message: "resourse type already exist",
        });
      }
      const newRT = new RessourceType({
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
            message: "error creating resourse type",
            error: err,
          });
        });
    } catch (error) {
      console.error("error creating resourse type");
    }
  }

  async read(req: Request, res: Response) {
    try {
      const resourceType = await RessourceType.findOne({ _id: req.params.id });
      if (resourceType) {
        return res.status(200).json(resourceType);
      } else {
        return res.status(404).json({
          message: "resourse type not found",
        });
      }
    } catch (error) {
      console.error("error fetching resourceType", error);
    }
  }

  async reads(req: Request, res: Response) {
    try {
      const resourceTypes = await RessourceType.find().sort({ createdAt: -1 });
      if (resourceTypes) {
        return res.status(200).json(resourceTypes);
      } else {
        return res.status(404).json({
          message: "no resourse type found",
        });
      }
    } catch (error) {
      console.error("error fetching resourceTypes", error);
    }
  }

  async update(req: Request, res: Response) {
    try {
      const slug = slugify(req.body.title);
      const resourceType = await RessourceType.updateOne(
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
      if (resourceType.acknowledged) {
        res.status(200).json({
          message: "success",
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
      const response = await RessourceType.deleteOne({ _id: req.params.id });
      if (response.deletedCount > 0) {
        res.status(200).json({
          message: "success",
        });
      } else {
        res.status(404).json({
          message: "resourse type not found",
        });
      }
    } catch (error) {
      console.error("error deleting resourse type", error);
    }
  }
}

export default RTController;
