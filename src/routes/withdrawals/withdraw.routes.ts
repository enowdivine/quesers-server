import express, { Router } from "express";
import WithDrawal from "./withdraw.controller";

const router: Router = express.Router();
const withdrawalRequest = new WithDrawal();

router.post("/withdrawal-request", withdrawalRequest.create);

router.get("/request/:id", withdrawalRequest.WithdrawRequest);
router.get("/requests/:userId", withdrawalRequest.userWithdrawalsRequest);
router.get("/all-requests", withdrawalRequest.allWithdrawalsRequest);

router.put("/update-status/:id", withdrawalRequest.updateStatus);

export default router;
