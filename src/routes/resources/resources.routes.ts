import express, { Router } from "express";
import Resource from "./resources.controller";
import { upload } from "../../middleware/s3/s3";

const router: Router = express.Router();
const resource = new Resource();

// router.post("/create", upload.array("images"), resource.create);
router.post(
  "/create",
  upload.fields([
    { name: "screenshotOne", maxCount: 1 },
    { name: "screenshotTwo", maxCount: 1 },
    { name: "screenshotThree", maxCount: 1 },
    { name: "screenshotFour", maxCount: 1 },
    { name: "resourceDoc", maxCount: 1 },
  ]),
  resource.create
);
router.get("/resource/:id", resource.resource);
router.get("/resources", resource.resources);
router.get("/vendor-resources/:vendorId", resource.vendorResource);
router.get(
  "/approved-vendor-resources/:vendorId",
  resource.approvedVendorResource
);
router.get("/approved-resources", resource.approvedResources);
router.get(
  "/approved-resources-by-category/:id",
  resource.approvedResourcesByCategory
);
router.get("/purchased-resources/:userId", resource.purchasedResources);
router.get("/sales-count", resource.totalSaleCounts);
router.get("/vendor-sales-count/:vendorId", resource.totalSaleCounts);

router.put(
  "/update-resource/:id",
  upload.fields([
    { name: "screenshotOne", maxCount: 1 },
    { name: "screenshotTwo", maxCount: 1 },
    { name: "screenshotThree", maxCount: 1 },
    { name: "screenshotFour", maxCount: 1 },
    { name: "resourceDoc", maxCount: 1 },
  ]),
  resource.update
);
router.put("/update-status/:id", resource.updateStatus);
router.put("/update-screenshots/:id", resource.updateScreenshotArray);
router.get("/search/:data", resource.searchResource);
router.get("/fuzzy-search/:data", resource.advancedSearch);

router.delete("/delete-resource/:id", resource.deleteResource);

export default router;
