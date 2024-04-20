import express, { Router } from "express";
import Vendor from "./vendor.controller";
import { upload } from "../../middleware/s3/s3";

const router: Router = express.Router();
const vendor = new Vendor();

router.post("/register", upload.single("resume"), vendor.register);
router.post("/login", vendor.login);
router.post("/forgot-password", vendor.forgotPassword);

router.get("/vendor/:id", vendor.vendor);
router.get("/vendors", vendor.vendors);

router.put(
  "/upload-profile-image/:id",
  upload.single("profileImage"),
  vendor.uploadProfileImage
);
router.put("/update-vendor/:id", vendor.update);
router.put("/update-password/:id", vendor.updatePassword);
router.put("/new-password/:token", vendor.newPassword);

router.delete("/delete-vendor/:id", vendor.deleteVendor);
router.put("/update-vendor-status/:id", vendor.updateStatus);

export default router;
