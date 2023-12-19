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
        .then((response) => {
          res.status(201).json({
            message: "success",
            response,
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
      const resoure = await RessourceType.findOne({ _id: req.params.id });
      if (resoure) {
        return res.status(200).json(resoure);
      } else {
        return res.status(404).json({
          message: "resoure not found",
        });
      }
    } catch (error) {
      console.error("error fetching resoure", error);
    }
  }

  async reads(req: Request, res: Response) {
    try {
      const resources = await RessourceType.find().sort({ createdAt: -1 });
      if (resources) {
        return res.status(200).json(resources);
      } else {
        return res.status(404).json({
          message: "no resource found",
        });
      }
    } catch (error) {
      console.error("error fetching resources", error);
    }
  }

  async update(req: Request, res: Response) {
    try {
      const slug = slugify(req.body.title);
      const resource = await RessourceType.updateOne(
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
      if (resource.acknowledged) {
        res.status(200).json({
          message: "success",
        });
      } else {
        res.status(404).json({
          message: "resource not found",
        });
      }
    } catch (error) {
      console.error("error updating resource  type", error);
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
          message: "resource type not found",
        });
      }
    } catch (error) {
      console.error("error deleting resource type", error);
    }
  }
}

export default RTController;
