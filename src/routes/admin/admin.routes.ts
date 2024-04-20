import express from "express";
import AdminAuth from "./admin.controller";
import VendorMiddleware from "../../middleware/auth/vendor";

const router = express.Router();
const admin = new AdminAuth();

router.post("/register", admin.register);
router.post("/login", admin.login);
router.put("/update/:id", VendorMiddleware, admin.update);
router.put("/update-password/:id", VendorMiddleware, admin.updatePassword);

export default router;
