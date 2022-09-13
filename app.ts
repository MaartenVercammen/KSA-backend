import * as dotenv from "dotenv";
import express from "express";
import cors from "cors";
import * as bodyParser from "body-parser";
import userRouter from "./routes/userRouter";
import path from 'path'

const app = express();
dotenv.config();

const react = path.join(__dirname,'react')

app.use(express.static(react))
app.use(cors());
app.use(bodyParser.json());
app.use("/user", userRouter);


app.get("/status", (req, res) => {
  res.json({ message: "Backend is running..." });
});

app.get("*", (req, res) =>{
  res.sendFile(path.join(react, "index.html"))
  })

app.listen(process.env.APP_PORT, () => {
  console.log(`Server is running on port ${process.env.APP_PORT}.`);
});
