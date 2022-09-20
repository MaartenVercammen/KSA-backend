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

const authcheck = (req, res, next) => {
  let token = req.cookies?.token;
  console.log(token)
  if (req.path === "/user/login") {
    next();
  } else {
    if(token != undefined){
      const user = jwt.verify(token, process.env.MY_SECRET);
      if(user){
        next()
      }
    }else{
      res.status(500).json({type: "error", message: "no authentication"})
    }
  }
};

app.use(cors({
  credentials: true,
  origin: "http://localhost:8001",
}));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(authcheck);
app.use(express.static(path.join(__dirname, "public")));
app.use("/user", userRouter);
app.use("/file", fileRouter);

app.get("/status", (req, res) => {
  res.json({ message: "Backend is running..." });
});

app.listen(process.env.APP_PORT, () => {
  console.log(`Server is running on port ${process.env.APP_PORT}.`);
});
