import express, { Request, Response, Handler } from "express";
import * as userModel from "../model/user";

const userRouter = express.Router();

userRouter.get("/", (res: Response, req: Request) => {
  userModel.getUsers((users, err) => {
    if (err) {
      req.status(500).json({ message: err.message, type: "error" });
    } else {
      req.status(200).json(users);
    }
  });
});

export default userRouter;
