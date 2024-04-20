import express, { Router } from "express";
import Faculty from "./faculty.controller";

const router: Router = express.Router();
const faculty = new Faculty();

router.post("/create", faculty.create);
router.get("/read/:id", faculty.read);
router.get("/", faculty.reads);
router.put("/update/:id", faculty.update);
router.delete("/delete/:id", faculty.delete);

export default router;
