import dotenv from "dotenv";
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { createServer } from "http";
import { Server } from "socket.io";
import morganMiddleware from "./logger/morgan.logger.js";
import { initializeSocketIO } from "./socket/index.js";

dotenv.config({
  path: "./.env",
});

const app = express();
const httpServer = createServer(app);

const io = new Server(httpServer, {
  pingInterval: 60000,
  cors: {
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  },
});

app.set("io", io);

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

console.log("CORS OR ORIGIN: ", process.env.CORS_ORIGIN);

/* user gonna send data in differint format || for that 
we use this middlewares (limit) extended ==> object ke andar object etc
*/

//  when deta came through form
app.use(express.json({ limit: "16kb" }));

// when data in came through url
app.use(express.urlencoded({ extended: true, limit: "16kb" }));

// this for when we want to store files like img, pdf , fevicon ==>> store in (public) folder
app.use(express.static("public"));

// to set and get access of cookies from user's browser
app.use(cookieParser());

app.use(morganMiddleware);

import { errorHandler } from "./middlewares/error.middlewares.js";

// // routes import
// import userRouter from "./routes/user.routes.js";
import userRouter from "./routes/user.routes.js";
import chatRouter from "./routes/chat.routes.js";
import messageRouter from "./routes/message.routes.js";
import { log } from "console";

// // routes declaration
// app.use("/api/v1/users", userRouter);
// // https://localhost:5000/api/v1/users/register

app.use("/api/v1/users", userRouter);
app.use("/api/v1/chat-app/chats", chatRouter);
app.use("/api/v1/chat-app/messages", messageRouter);

initializeSocketIO(io);

app.use(errorHandler);

export { httpServer };
