import * as dotenv from "dotenv";
import express from "express";
import cors from "cors";
import * as bodyParser from "body-parser";
import userRouter from "./routes/userRouter";

const app = express();

dotenv.config();

app.use(cors());
app.use(bodyParser.json());
app.use("/user", userRouter);


app.get("/status", (req, res) => {
  res.json({ message: "Backend is running..." });
});

app.listen(process.env.APP_PORT, () => {
  console.log(`Server is running on port ${process.env.APP_PORT}.`);
});
