import express, { Router } from "express";
import Ratings from "./rating.controller";

const router: Router = express.Router();
const rating = new Ratings();

router.post("/create", rating.create);
router.get("/ratings/:id", rating.ratings);

export default router;
