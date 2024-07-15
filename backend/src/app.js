import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

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

// // routes import
// import userRouter from "./routes/user.routes.js";

// // routes declaration
// app.use("/api/v1/users", userRouter);
// // https://localhost:5000/api/v1/users/register

export { app };
