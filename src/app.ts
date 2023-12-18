import express, { Request, Response } from "express";
import bodyParser = require("body-parser");
import dbConnect from "./config/db";
import dotenv from "dotenv";
import http from "http";
import cors from "cors";
// api imports
import userRoutes from "./routes/user/user.routes";
import adminRoutes from "./routes/admin/admin.routes";
import ratingRoutes from "./routes/ratings/rating.routes";
import courseRoutes from "./routes/resources/resources.routes";
import withdrawalRoutes from "./routes/withdrawals/withdraw.routes";
import instructorRoutes from "./routes/vendor/vendor.routes";
import transactionRoutes from "./routes/transactions/transaction.routes";
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
app.use(`/api/${process.env.API_VERSION}/course`, courseRoutes);
app.use(`/api/${process.env.API_VERSION}/rating`, ratingRoutes);
app.use(`/api/${process.env.API_VERSION}/instructor`, instructorRoutes);
app.use(`/api/${process.env.API_VERSION}/withdrawals`, withdrawalRoutes);
app.use(`/api/${process.env.API_VERSION}/transaction`, transactionRoutes);

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
    // Get the transaction status from fapshi's API to be sure of its source
    const event = await fapshi.paymentStatus(req.body.transId);

    if (event.statusCode !== 200) {
      return io.to(socketID).emit("status", event);
    }

    // Handle the event
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
      // ... handle other event types
      default:
        console.log(`Unhandled event status: ${event.type}`);
        io.to(socketID).emit("status", event);
    }
    // Return a 200 response to acknowledge receipt of the event
    res.send();
  }
);

app.get("/", (req: Request, res: Response) => {
  res.send("Outshine Server 🚀");
});

const PORT: any = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`server listening on port ${PORT}, 🚀`);
});
