import express, { Request, Response, Handler } from 'express';
import * as userModel from '../model/userModel';
import jwt from 'jsonwebtoken';
import authcheck from '../middleware/authcheck';
import roleCheck from '../middleware/roleCheck';
import { Roles } from '../types';

const userRouter = express.Router();

userRouter.get(
    '/',
    authcheck,
    roleCheck(Roles.ADMIN, Roles.BONDS),
    (req: Request, res: Response) => {
        userModel.getUsers((users, err) => {
            if (err) {
                res.status(500).json({ message: err.message, type: 'error' });
            } else {
                res.status(200).json(users);
            }
        });
    }
);

userRouter.post('/', authcheck, roleCheck(Roles.ADMIN), (req, res) => {
    const user = req.body;
    userModel.postUser(user, (err) => {
        if (err) {
            res.status(500).json({ type: 'error', message: err.message });
        } else {
            res.status(200).json({ type: 'ok', message: 'user created' });
        }
    });
});

userRouter.put('/', authcheck, roleCheck(Roles.ADMIN), (req, res) => {
    const user = req.body;
    console.log(user);
    userModel.updateUser(user, (err) => {
        if (err) {
            res.status(500).json({ type: 'error', message: err.message });
        } else {
            res.status(200).json({ type: 'ok', message: 'user updated' });
        }
    });
});

userRouter.delete('/', authcheck, roleCheck(Roles.ADMIN), (req, res) => {
    const id: number = Number.parseInt(<string>req.query.id);
    userModel.deleteUser(id, (err) => {
        if (err) {
            res.status(500).json({ type: 'error', message: err.message });
        } else {
            res.status(200).json({ type: 'ok', message: 'User deleted' });
        }
    });
});

userRouter.post('/login', (req: Request, res: Response) => {
    const { email, password } = req.body;
    userModel.login(email, password, (user, err) => {
        if (err) {
            res.status(500).json({ message: err.message, type: 'error' });
        } else {
            if (user.length > 0) {
                const token = jwt.sign(user[0], process.env.MY_SECRET, {
                    expiresIn: '1h',
                });
                console.log('login from ' + user[0].name + ' was succesfull');
                res.cookie('token', token, { maxAge: 3600000 });
                return res.status(200).json({ type: 'valid', user: user[0] });
            } else {
                console.log('login from failed');
                return res.status(500).json({ type: 'error', message: 'Invalid Credantials' });
            }
        }
    });
});

userRouter.delete('/logout', (req: Request, res: Response) => {
    res.clearCookie('token');
    res.status(200).json({ type: 'succes', message: 'token cleared' });
});

export default userRouter;
