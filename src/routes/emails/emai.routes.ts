import express, { Router } from "express";
import Mail from "./email.controller";

const router: Router = express.Router();
const mail = new Mail();

router.post("/send-email", mail.sendEmail);
export default router;
