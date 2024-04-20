import { Request, Response } from "express";
import Resource from "./resources.model";
import UserModel from "../user/user.model";
import { deleteObject } from "../../middleware/s3/s3";
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
      const multerFiles = JSON.parse(JSON.stringify(req.files));
      if (multerFiles) {
        const screenshotOne = multerFiles.screenshotOne[0];
        const screenshotTwo = multerFiles.screenshotTwo[0];
        const screenshotThree = multerFiles.screenshotThree[0];
        const screenshotFour = multerFiles.screenshotFour[0];
        const resourceDoc = multerFiles.resourceDoc[0];

        const screenshots = [
          {
            doc: screenshotOne?.location,
            key: screenshotOne?.key,
          },
          {
            doc: screenshotTwo?.location,
            key: screenshotTwo?.key,
          },
          {
            doc: screenshotThree?.location,
            key: screenshotThree?.key,
          },
          {
            doc: screenshotFour?.location,
            key: screenshotFour?.key,
          },
        ];

        const document = {
          doc: resourceDoc?.location,
          key: resourceDoc?.key,
        };

        const slug = slugify(req.body.title);
        const course = new Resource({
          screenshots: screenshots,
          doc: document,
          //
          vendorId: req.body.vendorId,
          title: req.body.title,
          slug: slug,
          features: req.body.features,
          desc: req.body.desc,
          exam: req.body.exam,
          school: req.body.school,
          faculty: req.body.faculty,
          department: req.body.department,
          semester: req.body.semester,
          price: req.body.price,
          level: req.body.level,
          language: req.body.language,
          category: req.body.category,
          numOfPages: req.body.numOfPages,
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
          message: "error uploading resource",
        });
      }
    } catch (error) {
      console.error("error uploading resource", error);
      return res.status(500).json({
        message: "error uploading resource",
      });
    }
  }

  async resource(req: Request, res: Response) {
    try {
      const resource = await Resource.findOne({ _id: req.params.id });
      if (resource) {
        const vendor = await vendorModel.findOne({ _id: resource.vendorId });
        const resourceWithVendor = {
          ...resource.toObject(), // Convert Mongoose document to plain JavaScript object
          vendor: vendor || null, // Attach vendor or null if not found
        };
        return res.status(200).json(resourceWithVendor);
      } else {
        return res.status(404).json({
          message: "resource not found",
        });
      }
    } catch (error) {
      console.error("error fetching resource", error);
      return res.status(500).json({
        message: "error fetching resource",
      });
    }
  }

  async resources(req: Request, res: Response) {
    try {
      const resources = await Resource.find().sort({ createdAt: -1 });
      const vendors = await vendorModel.find().sort({ createdAt: -1 });
      if (resources && vendors) {
        const resourcesWithVendors = resources.map((resource) => {
          const vendor = vendors.find((vendor) =>
            vendor._id.equals(resource.vendorId)
          );
          return {
            ...resource.toObject(), // Convert Mongoose document to plain JavaScript object
            vendor: vendor || null, // Attach vendor or null if not found
          };
        });
        return res.status(200).json(resourcesWithVendors);
      } else {
        return res.status(404).json({
          message: "no resource found",
        });
      }
    } catch (error) {
      console.error("error fetching resources", error);
      return res.status(500).json({
        message: "error fetching resources",
      });
    }
  }

  async vendorResource(req: Request, res: Response) {
    try {
      const resources = await Resource.find({
        vendorId: req.params.vendorId,
      }).sort({ createdAt: -1 });
      const vendors = await vendorModel.find().sort({ createdAt: -1 });
      if (resources && vendors) {
        const resourcesWithVendors = resources.map((resource) => {
          const vendor = vendors.find((vendor) =>
            vendor._id.equals(resource.vendorId)
          );
          return {
            ...resource.toObject(), // Convert Mongoose document to plain JavaScript object
            vendor: vendor || null, // Attach vendor or null if not found
          };
        });
        return res.status(200).json(resourcesWithVendors);
      } else {
        return res.status(404).json({
          message: "no resource found",
        });
      }
    } catch (error) {
      console.error("error fetching resources", error);
      return res.status(500).json({
        message: "error fetching resources",
      });
    }
  }

  async approvedVendorResource(req: Request, res: Response) {
    try {
      const resources = await Resource.find({
        status: "approved",
        vendorId: req.params.vendorId,
      }).sort({ createdAt: -1 });
      if (resources) {
        return res.status(200).json(resources);
      } else {
        return res.status(404).json({
          message: "no resource found",
        });
      }
    } catch (error) {
      console.error("error fetching resources", error);
      return res.status(500).json({
        message: "error fetching resources",
      });
    }
  }

  async approvedResources(req: Request, res: Response) {
    try {
      const resources = await Resource.find({ status: "approved" }).sort({
        createdAt: -1,
      });
      if (resources) {
        return res.status(200).json(resources);
      } else {
        return res.status(404).json({
          message: "no resource found",
        });
      }
    } catch (error) {
      console.error("error fetching resources", error);
      return res.status(500).json({
        message: "error fetching resources",
      });
    }
  }

  async approvedResourcesByCategory(req: Request, res: Response) {
    try {
      const resources = await Resource.find({
        status: "approved",
        category: req.params.id,
      }).sort({
        createdAt: -1,
      });
      if (resources) {
        return res.status(200).json(resources);
      } else {
        return res.status(404).json({
          message: "no resource found",
        });
      }
    } catch (error) {
      console.error("error fetching resources", error);
      return res.status(500).json({
        message: "error fetching resources",
      });
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
      return res.status(500).json({
        message: "error fetching resources",
      });
    }
  }

  async totalSaleCounts(req: Request, res: Response) {
    try {
      const resources = await Resource.find().sort({ createdAt: -1 });
      if (resources) {
        const totalRevenue = resources.reduce((acc, item) => {
          if (item.saleCount > 0) {
            return acc + item.saleCount * item.price;
          } else {
            return acc;
          }
        }, 0);

        const totalSaleCount = resources.reduce((acc, item) => {
          return acc + item.saleCount;
        }, 0);
        return res
          .status(200)
          .json({ totalSaleCount, totalRevenue, resources });
      } else {
        return res.status(404).json({
          message: "no resource found",
        });
      }
    } catch (error) {
      console.error("error fetching resources", error);
      return res.status(500).json({
        message: "error fetching resources",
      });
    }
  }

  async vendorSaleCounts(req: Request, res: Response) {
    try {
      const resources = await Resource.find({
        vendorId: req.params.vendorId,
      }).sort({ createdAt: -1 });
      if (resources) {
        const totalRevenue = resources.reduce((acc, item) => {
          if (item.saleCount > 0) {
            return acc + item.saleCount * item.price;
          } else {
            return acc;
          }
        }, 0);
        const totalSaleCount = resources.reduce((acc, item) => {
          return acc + item.saleCount;
        }, 0);
        return res
          .status(200)
          .json({ totalSaleCount, totalRevenue, resources });
      } else {
        return res.status(404).json({
          message: "no resource found",
        });
      }
    } catch (error) {
      console.error("error fetching resources", error);
      return res.status(500).json({
        message: "error fetching resources",
      });
    }
  }

  async update(req: Request, res: Response) {
    try {
      // const multerFiles = (req as MulterRequest).file;
      const multerFiles = JSON.parse(JSON.stringify(req.files));
      if (multerFiles) {
        let screenshots = [];
        let document;
        console.log(multerFiles);

        if (multerFiles.sreenschotOne?.length > 0) {
          const screenshotOne = multerFiles.sreenschotOne[0];
          screenshots.push(screenshotOne);
        }
        if (multerFiles.sreenschotTwo.length > 0) {
          const sreenschotTwo = multerFiles.sreenschotTwo[0];
          screenshots.push(sreenschotTwo);
        }
        if (multerFiles.screenshotThree.length > 0) {
          const screenshotThree = multerFiles.screenshotThree[0];
          screenshots.push(screenshotThree);
        }
        if (multerFiles.screenshotFour.length > 0) {
          const screenshotFour = multerFiles.screenshotFour[0];
          screenshots.push(screenshotFour);
        }
        if (multerFiles.resourceDoc.length > 0) {
          const resourceDoc = multerFiles.resourceDoc[0];
          const doc = {
            doc: resourceDoc?.location,
            key: resourceDoc?.key,
          };
          document = doc;
        }

        const slug = slugify(req.body.title);
        const updatedResource = await Resource.updateOne(
          {
            _id: req.params.id,
          },
          {
            $set: {
              doc: document,
              vendorId: req.body.vendorId,
              title: req.body.title,
              slug: slug,
              features: req.body.features,
              desc: req.body.desc,
              exam: req.body.exam,
              school: req.body.school,
              faculty: req.body.faculty,
              department: req.body.department,
              semester: req.body.semester,
              price: req.body.price,
              level: req.body.level,
              language: req.body.language,
              category: req.body.category,
              numOfPages: req.body.numOfPages,
            },
            $push: {
              screenshots: {
                $each: screenshots,
              },
            },
          }
        );
        if (updatedResource.acknowledged) {
          res.status(200).json({
            message: "success",
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
              exam: req.body.exam,
              school: req.body.school,
              faculty: req.body.faculty,
              department: req.body.department,
              semester: req.body.semester,
              price: req.body.price,
              level: req.body.level,
              language: req.body.language,
              category: req.body.category,
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
      return res.status(500).json({
        message: "error updating resources",
      });
    }
  }

  async updateStatus(req: Request, res: Response) {
    try {
      const resource = await Resource.findOne({ _id: req.params.id });
      if (resource) {
        resource.status = req.body.status;
        await resource.save().then(async () => {
          const vendor = await vendorModel.findOne({
            _id: resource.vendorId,
          });
          sendEmail({
            to: vendor?.email as string,
            subject: resource.status
              ? `${resource.title} Approved`
              : `${resource.title} Suspended`,
            message: resource.status
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
      return res.status(500).json({
        message: "an error occurred",
      });
    }
  }

  async updateScreenshotArray(req: Request, res: Response) {
    try {
      const image = req.body.image;
      const singleResource = await Resource.findOne({ _id: req.params.id });
      if (singleResource) {
        const imageToDelete = singleResource?.screenshots.filter(
          (img) => img.key === image.key
        );
        await deleteObject(imageToDelete[0]?.key);
      }
      const resource = await Resource.updateOne(
        { _id: req.params.id },
        {
          // remove image from array
          $pull: {
            screenshots: {
              $in: [image],
            },
          },
        }
      );
      if (resource.acknowledged) {
        res.status(200).json({
          message: "Image Deleted",
          resource: resource,
        });
      } else {
        res.status(404).json({
          message: "Failed",
        });
      }
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        message: "an error occurred",
      });
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
      console.error("error deleting resource", error);
      return res.status(500).json({
        message: "error deleting resource",
      });
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
      const school = data.school
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
            school: { $regex: school },
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
      return res.status(500).json({
        message: "an error occurred",
      });
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
      return res.status(500).json({
        message: "an error occurred",
      });
    }
  }
}

export default ResourceController;
