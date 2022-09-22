import * as dotenv from "dotenv";
import express from "express";
import cors from "cors";
import * as bodyParser from "body-parser";
import userRouter from "./routes/userRouter";
import fileRouter from "./routes/fileRouter";
import path from "path";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
dotenv.config();

const app = express();

app.use(cors({
  credentials: true,
  origin: "http://localhost:8001",
}));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use("/user", userRouter);
app.use("/file", fileRouter);

app.get("/status", (req, res) => {
  res.json({ message: "Backend is running..." });
});

app.listen(process.env.APP_PORT, () => {
  console.log(`Server is running on port ${process.env.APP_PORT}.`);
});
