import express, { Router } from "express";
import Cert from "./certificate.controller";

const router: Router = express.Router();
const cert = new Cert();

router.post("/register", cert.register);
router.post("/certificate", cert.certificate);
router.get("/certificates", cert.certificates);

export default router;
