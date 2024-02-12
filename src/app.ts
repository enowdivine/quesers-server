import express, { Request, Response } from "express";
import bodyParser = require("body-parser");
import dbConnect from "./config/db";
import dotenv from "dotenv";
import http from "http";
import cors from "cors";
// api imports
import userRoutes from "./routes/user/user.routes";
import adminRoutes from "./routes/admin/admin.routes";
import vendorRoutes from "./routes/vendor/vendor.routes";
import ratingRoutes from "./routes/ratings/rating.routes";
import resourceRoutes from "./routes/resources/resources.routes";
import withdrawalRoutes from "./routes/withdrawals/withdraw.routes";
import transactionRoutes from "./routes/transactions/transaction.routes";
//
import CategoryRoutes from "./routes/category/category.routes";
import ExamsRoutes from "./routes/exams/exams.routes";
import SchoolRoutes from "./routes/schools/schools.routes";
import facultyRoutes from "./routes/faculty/faculty.routes";
import departmentRoutes from "./routes/department/department.routes";
// Fapshi imports
const fapshi = require("./routes/fapshi/fapshi");

const corsOptions = {
  origin: "*",
  credentials: true,
  optionSuccessStatus: 200,
};

dotenv.config();
const app = express();
const server: any = http.createServer(app);
const io = require("socket.io")(server, {
  cors: {
    origin: "*",
    methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"],
    credentials: true,
  },
});

dbConnect();

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(`/api/${process.env.API_VERSION}/user`, userRoutes);
app.use(`/api/${process.env.API_VERSION}/admin`, adminRoutes);
app.use(`/api/${process.env.API_VERSION}/resource`, resourceRoutes);
app.use(`/api/${process.env.API_VERSION}/rating`, ratingRoutes);
app.use(`/api/${process.env.API_VERSION}/vendor`, vendorRoutes);
app.use(`/api/${process.env.API_VERSION}/withdrawal`, withdrawalRoutes);
app.use(`/api/${process.env.API_VERSION}/transaction`, transactionRoutes);
//
app.use(`/api/${process.env.API_VERSION}/categories`, CategoryRoutes);
app.use(`/api/${process.env.API_VERSION}/faculties`, facultyRoutes);
app.use(`/api/${process.env.API_VERSION}/departments`, departmentRoutes);
app.use(`/api/${process.env.API_VERSION}/schools`, SchoolRoutes);
app.use(`/api/${process.env.API_VERSION}/exams`, ExamsRoutes);

// Fapshi webhook
let socketID: any;
io.on("connection", async (socket: any) => {
  console.log("New participant connected");
  socket.on("join", (room: any) => {
    socket.join(room);
    socketID = socket.id;
    console.log(`${socket.id} joined ${room}`);
  });
});

app.post(
  `/api/${process.env.API_VERSION}/webhook/fapshi-webhook`,
  express.json(),
  async (req: Request, res: Response) => {
    const event = await fapshi.paymentStatus(req.body.transId);

    if (event.statusCode !== 200) {
      return io.to(socketID).emit("status", event);
    }

    switch (event.status) {
      case "SUCCESSFUL":
        console.log(event, "successful");
        io.to(socketID).emit("status", event);
        break;
      case "FAILED":
        console.log(event, "failed");
        io.to(socketID).emit("status", event);
        break;
      case "EXPIRED":
        console.log(event, "expired");
        io.to(socketID).emit("status", event);
        break;
      default:
        console.log(`Unhandled event status: ${event.type}`);
        io.to(socketID).emit("status", event);
    }
    res.send();
  }
);

app.get("/", (req: Request, res: Response) => {
  res.send("Outshine Server 🚀");
});

const PORT: any = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`server listening on port ${PORT}, 🚀`);
});
