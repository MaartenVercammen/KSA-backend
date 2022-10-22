import express, { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import User from '../model/userModel';
import authcheck from '../middleware/authcheck';
import roleCheck from '../middleware/roleCheck';
import { Roles } from '../types';

const userRouter = express.Router();
const logger = require('../modules/logger')('userRouter');

userRouter.get('/', authcheck, roleCheck(Roles.ADMIN, Roles.BONDS), async (req: Request, res: Response) => {
  try {
    const users = await User.getAll();
    return res.status(200).json(users);
  } catch (err) {
    return res.status(500).json({ message: err.message, type: 'error' });
  }
});

userRouter.post('/', authcheck, roleCheck(Roles.ADMIN), async (req, res) => {
  const user = req.body;
  try {
    await User.create(user);
    return res.status(200).json({ type: 'ok', message: 'user created' });
  } catch (err) {
    return res.status(500).json({ type: 'error', message: err.message });
  }
});

userRouter.put('/', authcheck, roleCheck(Roles.ADMIN), async (req, res) => {
  const user = req.body;
  try {
    await User.update(user);
    return res.status(200).json({ type: 'ok', message: 'user updated' });
  } catch (err) {
    return res.status(500).json({ type: 'error', message: err.message });
  }
});

userRouter.delete('/', authcheck, roleCheck(Roles.ADMIN), async (req, res) => {
  const id = <string>req.query.id;
  try {
    await User.deleteById(id);
    return res.status(200).json({ type: 'ok', message: 'user deleted' });
  } catch (err) {
    return res.status(500).json({ type: 'error', message: err.message });
  }
});

userRouter.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const authenticatedUser = await User.authenticate(email, password);
    if (authenticatedUser === undefined) {
      // TODO return 401
      logger.error('login from failed');
      return res.status(500).json({ type: 'error', message: 'Invalid Credantials' });
    }
    const token = jwt.sign(authenticatedUser, process.env.MY_SECRET, {
      expiresIn: '1h',
    });
    logger.debug(`login from ${authenticatedUser.name} was succesful`);
    res.cookie('token', token, { maxAge: 3600000 });
    return res.status(200).json({ type: 'valid', user: authenticatedUser });
  } catch (err) {
    return res.status(500).json({ message: err.message, type: 'error' });
  }
});

userRouter.delete('/logout', (req: Request, res: Response) => {
  res.clearCookie('token');
  res.status(200).json({ type: 'succes', message: 'token cleared' });
});

export default userRouter;
