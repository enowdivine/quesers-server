import express, { Router } from "express";
import Transaction from "./transaction.controller";

const router: Router = express.Router();
const transaction = new Transaction();

router.post("/create", transaction.create);
router.post("/wallet-top-up", transaction.topUpWallet);

router.get("/transaction/:id", transaction.transaction);
router.get("/transactions/:vendorId", transaction.vendorTransaction);
router.get("/transactions", transaction.transactions);

export default router;
