import express, { Router } from "express";
import RT from "./rt.controller";

const router: Router = express.Router();
const resourceType = new RT();

router.post("/create", resourceType.create);
router.get("/read/:id", resourceType.read);
router.get("/readone", resourceType.reads);
router.put("/update", resourceType.update);
router.delete("/delete", resourceType.delete);

export default router;
