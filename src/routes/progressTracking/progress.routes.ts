import express, { Router } from "express";
import Progress from "./progress.controller";

const router: Router = express.Router();
const progress = new Progress();

router.post("/register", progress.register);
router.post("/watched", progress.getWatched);

export default router;
