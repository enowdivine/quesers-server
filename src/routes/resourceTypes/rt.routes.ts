import express, { Router } from "express";
import RT from "./rt.controller";

const router: Router = express.Router();
const resourceType = new RT();

router.post("/create", resourceType.create);
router.get("/read/:id", resourceType.read);
router.get("/", resourceType.reads);
router.put("/update/:id", resourceType.update);
router.delete("/delete/:id", resourceType.delete);

export default router;
