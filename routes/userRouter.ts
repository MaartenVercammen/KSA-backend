import express, { Request, Response, Handler } from "express";
import * as userModel from "../model/user";
import { user } from '../types';

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

userRouter.post('/add', (req: Request, res: Response) => {
  var user = <user>req.body;
  console.log
  userModel.addUser(user, (err) =>{
    if(err){
      res.status(500).json({ message: err.message, type: "error" })
    }
    else{
      res.status(200).json({message: 'user added succesfuly', type:'succes'})
    }
  })
})

export default userRouter;
