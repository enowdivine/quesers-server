import express, { Router } from "express";
import Category from "./courses.controller";

const router: Router = express.Router();
const category = new Category();

router.post("/create", category.create);
router.get("/read/:id", category.read);
router.get("/", category.reads);
router.put("/update/:id", category.update);
router.delete("/delete/:id", category.delete);

export default router;
