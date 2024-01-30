import express, { Router } from "express";
import Exam from "./exams.controller";

const router: Router = express.Router();
const exam = new Exam();

router.post("/create", exam.create);
router.get("/read/:id", exam.read);
router.get("/", exam.reads);
router.put("/update/:id", exam.update);
router.delete("/delete/:id", exam.delete);

export default router;
