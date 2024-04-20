import express, { Router } from "express";
import School from "./schools.controller";

const router: Router = express.Router();
const school = new School();

router.post("/create", school.create);
router.get("/read/:id", school.read);
router.get("/", school.reads);
router.put("/update/:id", school.update);
router.delete("/delete/:id", school.delete);

export default router;
