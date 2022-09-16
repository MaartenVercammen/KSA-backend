import express, { Request, Response, Handler } from "express";
import * as userModel from "../model/user";

const userRouter = express.Router();

userRouter.get("/", (req: Request, res: Response) => {
  userModel.getUsers((users, err) => {
    if (err) {
      res.status(500).json({ message: err.message, type: "error" });
    } else {
      res.status(200).json(users);
    }
  });
});

export default userRouter;
