import express, { Request, Response } from "express";
import dotenv from "dotenv";
import bodyParser = require("body-parser");
import dbConnect from "./config/db";
import http from "http";
import cors from "cors";
// api imports
import adminRoutes from "./routes/admin/admin.routes";
import userRoutes from "./routes/user/user.routes";

const corsOptions = {
  origin: "*",
  credentials: true,
  optionSuccessStatus: 200,
};

dotenv.config();
const app = express();
dbConnect();

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(`/api/${process.env.API_VERSION}/admin`, adminRoutes);
app.use(`/api/${process.env.API_VERSION}/user`, userRoutes);

app.get("/", (req: Request, res: Response) => {
  res.send("Deonicode Server 🚀");
});

const PORT: any = process.env.PORT || 5000;
const server: any = http.createServer(app);
server.listen(PORT, () => {
  console.log(`server listening on port ${PORT}, 🚀`);
});
