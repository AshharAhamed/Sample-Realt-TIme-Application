import express from "express";
import DotenvConfigOptions from "dotenv";
import { PORT } from "./config/variables.config.js";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";
// import { socketIO } from "socket.io";
import "./config/sockets.js";
import "./config/db.config.js";

import orderRouter from "./controllers/order.controller.js";

DotenvConfigOptions.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  transports: ["polling"],
  cors: {
    cors: {
      origin: "http://localhost:3000",
    },
  },
});

io.on("connection", (socket) => {
  console.log("A user is connected");

  socket.on("message", (message) => {
    console.log(`message from ${socket.id} : ${message}`);
  });

  socket.on("disconnect", () => {
    console.log(`socket ${socket.id} disconnected`);
  });
});

export { io };

app.use(express.json());
app.use(cors());
app.use("/orders", orderRouter);

app.get("/", (req, res) => {
  res.send("Hello");
});

// const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server up and running on port ${PORT}`);
});
