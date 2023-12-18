import { Request, Response } from "express";
import Resource from "./resources.model";
import UserModel from "../user/user.model";
import { deleteObject } from "../../middleware/s3/s3";
//
import adminModel from "../admin/admin.model";
import vendorModel from "../vendor/vendor.model";
import sendEmail from "../../services/email/sendEmail";
import { resourceApproval, resourceSuspended } from "./templates/emails";
import slugify from "../../helpers/slugify";

interface MulterRequest extends Request {
  file: any;
}

class ResourceController {
  async create(req: Request, res: Response) {
    try {
      const multerFiles = JSON.parse(JSON.stringify(req.file));
      if (multerFiles) {
        const image = {
          doc: multerFiles?.location,
          key: multerFiles?.key,
        };
        const slug = slugify(req.body.title);
        const course = new Resource({
          vendorId: req.body.vendorId,
          title: req.body.title,
          slug: slug,
          features: req.body.features,
          desc: req.body.desc,
          resourceType: req.body.resourceType,
          faculty: req.body.faculty,
          department: req.body.department,
          semester: req.body.semester,
          price: req.body.price,
          level: req.body.level,
          language: req.body.language,
        });
        await course
          .save()
          .then(() => {
            res.status(201).json({
              message: "resource uploaded",
            });
          })
          .catch((err) => {
            res.status(500).json({
              message: "error uploading resource",
              error: err,
            });
          });
      } else {
        return res.status(500).json({
          message: "Cover image upload failed",
        });
      }
    } catch (error) {
      console.error("error uploading resource", error);
    }
  }

  async resource(req: Request, res: Response) {
    try {
      const resoure = await Resource.findOne({ _id: req.params.id });
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

  async resources(req: Request, res: Response) {
    try {
      const resources = await Resource.find().sort({ createdAt: -1 });
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

  async vendorResource(req: Request, res: Response) {
    try {
      const resources = await Resource.find({
        vendorId: req.params.vendorId,
      }).sort({ createdAt: -1 });
      if (resources) {
        return res.status(200).json({
          resources,
        });
      } else {
        return res.status(404).json({
          message: "no resource found",
        });
      }
    } catch (error) {
      console.error("error fetching resources", error);
    }
  }

  async approvedResources(req: Request, res: Response) {
    try {
      const resources = await Resource.find({ isApproved: true }).sort({
        createdAt: -1,
      });
      if (resources) {
        return res.status(200).json({
          resources,
        });
      } else {
        return res.status(404).json({
          message: "no resource found",
        });
      }
    } catch (error) {
      console.error("error fetching resources", error);
    }
  }

  async purchasedResources(req: Request, res: Response) {
    try {
      const user = await UserModel.findOne({ _id: req.params.userId });
      if (user) {
        const purchasedResources = user.resources;
        const resources = await Resource.find({
          _id: { $in: purchasedResources },
        });
        if (resources.length > 0) {
          return res.status(200).json(resources);
        } else {
          return res.status(404).json({
            message: "no resource found",
          });
        }
      }
    } catch (error) {
      console.error("error fetching resources", error);
    }
  }

  async update(req: Request, res: Response) {
    try {
      const multerFiles = (req as MulterRequest).file;
      if (multerFiles) {
        const image = {
          doc: multerFiles?.location,
          key: multerFiles?.key,
        };
        const resource = await Resource.findOne({ _id: req.params.id });
        // if (resource) {
        //   const imageKey = resource.coverImage.key;
        //   const response = await deleteObject(imageKey);
        // }
        const slug = slugify(req.body.title);
        const updatedResource = await Resource.updateOne(
          {
            _id: req.params.id,
          },
          {
            $set: {
              vendorId: req.body.vendorId,
              title: req.body.title,
              slug: slug,
              features: req.body.features,
              desc: req.body.desc,
              resourceType: req.body.resourceType,
              faculty: req.body.faculty,
              department: req.body.department,
              semester: req.body.semester,
              price: req.body.price,
              level: req.body.level,
              language: req.body.language,
            },
          }
        );
        if (updatedResource.acknowledged) {
          res.status(200).json({
            message: "update successful",
          });
        } else {
          res.status(404).json({
            message: "resource not found",
          });
        }
      } else {
        const slug = slugify(req.body.title);
        const resource = await Resource.updateOne(
          {
            _id: req.params.id,
          },
          {
            $set: {
              vendorId: req.body.vendorId,
              title: req.body.title,
              slug: slug,
              features: req.body.features,
              desc: req.body.desc,
              resourceType: req.body.resourceType,
              faculty: req.body.faculty,
              department: req.body.department,
              semester: req.body.semester,
              price: req.body.price,
              level: req.body.level,
              language: req.body.language,
            },
          }
        );
        if (resource.acknowledged) {
          res.status(200).json({
            message: "update successful",
          });
        } else {
          res.status(404).json({
            message: "resource not found",
          });
        }
      }
    } catch (error) {
      console.error("error updating resource", error);
    }
  }

  async updateStatus(req: Request, res: Response) {
    try {
      const resource = await Resource.findOne({ _id: req.params.id });
      if (resource) {
        resource.isApproved = !resource.isApproved;
        await resource.save().then(async () => {
          const vendor = await vendorModel.findOne({
            _id: resource.vendorId,
          });
          sendEmail({
            to: vendor?.email as string,
            subject: resource.isApproved
              ? `${resource.title} Approved`
              : `${resource.title} Suspended`,
            message: resource.isApproved
              ? resourceApproval(
                  vendor?.username as string,
                  resource?.title as string
                )
              : resourceSuspended(
                  vendor?.username as string,
                  resource?.title as string
                ),
          });
          return res.status(200).json({
            message: "resource status updated",
          });
        });
      } else {
        return res.status(404).json({
          message: "resource not found",
        });
      }
    } catch (error) {
      console.error(error);
    }
  }

  async deleteResource(req: Request, res: Response) {
    try {
      const resource = await Resource.findOne({ _id: req.params.id });
      if (resource) {
        if (resource.screenshots.length > 0) {
          resource.screenshots.map(async (item) => {
            await deleteObject(item.key);
          });
        }
        const imageKey = resource.doc.key;
        await deleteObject(imageKey);
      }
      const response = await Resource.deleteOne({ _id: req.params.id });
      if (response.deletedCount > 0) {
        res.status(200).json({
          message: "course deleted",
        });
      } else {
        res.status(404).json({
          message: "course not found",
        });
      }
    } catch (error) {
      console.error("error deleting course", error);
    }
  }

  async searchResource(req: Request, res: Response) {
    try {
      const data = JSON.parse(req.params.data);
      // console.log(data);
      const title = data.title
        .toLowerCase()
        .replace(
          /^[\u00C0-\u1FFF\u2C00-\uD7FF\w]|\s[\u00C0-\u1FFF\u2C00-\uD7FF\w]/g,
          function (letter: string) {
            return letter.toUpperCase();
          }
        );
      const resourceType = data.resourceType
        .toLowerCase()
        .replace(
          /^[\u00C0-\u1FFF\u2C00-\uD7FF\w]|\s[\u00C0-\u1FFF\u2C00-\uD7FF\w]/g,
          function (letter: string) {
            return letter.toUpperCase();
          }
        );
      const faculty = data.faculty
        .toLowerCase()
        .replace(
          /^[\u00C0-\u1FFF\u2C00-\uD7FF\w]|\s[\u00C0-\u1FFF\u2C00-\uD7FF\w]/g,
          function (letter: string) {
            return letter.toUpperCase();
          }
        );
      const department = data.department
        .toLowerCase()
        .replace(
          /^[\u00C0-\u1FFF\u2C00-\uD7FF\w]|\s[\u00C0-\u1FFF\u2C00-\uD7FF\w]/g,
          function (letter: string) {
            return letter.toUpperCase();
          }
        );
      const level = data.level
        .toLowerCase()
        .replace(
          /^[\u00C0-\u1FFF\u2C00-\uD7FF\w]|\s[\u00C0-\u1FFF\u2C00-\uD7FF\w]/g,
          function (letter: string) {
            return letter.toUpperCase();
          }
        );
      const semester = data.semester
        .toLowerCase()
        .replace(
          /^[\u00C0-\u1FFF\u2C00-\uD7FF\w]|\s[\u00C0-\u1FFF\u2C00-\uD7FF\w]/g,
          function (letter: string) {
            return letter.toUpperCase();
          }
        );
      const language = data.language
        .toLowerCase()
        .replace(
          /^[\u00C0-\u1FFF\u2C00-\uD7FF\w]|\s[\u00C0-\u1FFF\u2C00-\uD7FF\w]/g,
          function (letter: string) {
            return letter.toUpperCase();
          }
        );
      const rating = data.rating;
      const startPrice = data.startPrice;
      const endPrice = data.endPrice;
      const courses = await Resource.find({
        $and: [
          {
            isApproved: true,
          },
          {
            title: { $regex: title },
          },
          {
            resourceType: { $regex: resourceType },
          },
          {
            faculty: { $regex: faculty },
          },
          {
            department: { $regex: department },
          },
          {
            level: { $regex: level },
          },
          {
            semester: { $regex: semester },
          },
          {
            rating: { $gte: rating, $lte: 6 },
          },
          {
            price: { $gte: startPrice, $lte: endPrice },
          },
        ],
      });
      if (courses) {
        res.status(200).json(courses);
      } else {
        res.status(404).json({
          message: "No Course Found",
        });
      }
    } catch (error) {
      console.error(error);
    }
  }

  async advancedSearch(req: Request, res: Response) {
    try {
      const searchPhrase = req.params.data;

      const agg: any[] = [
        {
          $search: {
            index: "searchResources",
            text: {
              query: searchPhrase,
              path: {
                wildcard: "*",
              },
              fuzzy: {},
            },
          },
        },
      ];

      const resources = await Resource.aggregate(agg);
      if (resources) {
        res.status(200).json(resources);
      } else {
        res.status(404).json({
          message: "no resource found",
        });
      }
    } catch (error) {
      console.error(error);
    }
  }
}

export default ResourceController;
