import express, { Request, Response, Handler } from "express";
import * as userModel from "../model/user";
import jwt from 'jsonwebtoken';
import authcheck from "../middleware/authcheck";
import roleCheck from "../middleware/roleCheck";

const userRouter = express.Router();

userRouter.get("/",authcheck, roleCheck('ADMIN'), (req: Request, res: Response) => {
  userModel.getUsers((users, err) => {
    if (err) {
      res.status(500).json({ message: err.message, type: "error" });
    } else {
      res.status(200).json(users);
    }
  });
});

userRouter.post('/login', (req: Request, res: Response) => {
  const {email, password} = req.body;
  userModel.login(email, password, (user, err) => {
    if(err){
      res.status(500).json({ message: err.message, type: "error" })
    }else{
      if(user.length > 0){
        const token = jwt.sign(user[0], process.env.MY_SECRET, { expiresIn: "1h" });
        console.log("login from " + user[0].naam + " was succesfull")
        res.cookie("token", token, {maxAge: 3600000});
        return res.status(200).json({type: "valid", user: user[0]});
      }
      else{
        console.log("login from failed")
        return res.status(500).json({type: "error", message: "Invalid Credantials"})
      }
    }
  })
})

userRouter.delete('/logout',(req: Request, res: Response) => {
    res.clearCookie("token");
    res.status(200).json({type: "succes", message: "token cleared"})
})


export default userRouter;
