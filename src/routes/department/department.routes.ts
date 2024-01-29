import express, { Router } from "express";
import Department from "./department.controller";

const router: Router = express.Router();
const department = new Department();

router.post("/create", department.create);
router.get("/read/:id", department.read);
router.get("/", department.reads);
router.put("/update/:id", department.update);
router.delete("/delete/:id", department.delete);

export default router;
