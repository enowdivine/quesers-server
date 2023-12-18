import express, { Router } from "express";
import Resource from "./resources.controller";
import { upload } from "../../middleware/s3/s3";

const router: Router = express.Router();
const resource = new Resource();

router.post("/create", upload.single("coverImage"), resource.create);

router.get("/resource/:id", resource.resource);
router.get("/resources", resource.resources);
router.get("/vendor-resources/:vendorId", resource.vendorResource);
router.get("/approved-resources", resource.approvedResources);
router.get("/purchased-resources/:userId", resource.purchasedResources);

router.put(
  "/update-resource/:id",
  upload.single("coverImage"),
  resource.update
);
router.put("/update-status/:id", resource.updateStatus);

router.delete("/delete-resource/:id", resource.deleteResource);

// search resource
router.get("/search/:data", resource.searchResource);
router.get("/fuzzy-search/:data", resource.advancedSearch);

export default router;
