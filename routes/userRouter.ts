import express, { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import User from '../model/userModel';
import { accessVerification } from '../modules/middlewares';
import newLogger from '../modules/logger';
import { Roles } from '../types';

const userRouter = express.Router();
const logger = newLogger('userRouter');

userRouter.get('/', accessVerification(Roles.ADMIN, Roles.BONDS), async (_req: Request, res: Response) => {
  try {
    const users = await User.getAll();
    return res.status(200).json(users);
  } catch (err: unknown) {
    if (!(err instanceof Error)) {
      return res.status(500).json({ message: 'Unknown error occurred!', type: 'error' });
    }
    return res.status(500).json({ message: err.message, type: 'error' });
  }
});

userRouter.post('/', accessVerification(Roles.ADMIN), async (req, res) => {
  const user = req.body;
  try {
    await User.create(user);
    return res.status(200).json({ type: 'ok', message: 'user created' });
  } catch (err: unknown) {
    if (!(err instanceof Error)) {
      return res.status(500).json({ message: 'Unknown error occurred!', type: 'error' });
    }
    return res.status(500).json({ type: 'error', message: err.message });
  }
});

userRouter.put('/', accessVerification(Roles.ADMIN), async (req, res) => {
  const user = req.body;
  try {
    await User.update(user);
    return res.status(200).json({ type: 'ok', message: 'user updated' });
  } catch (err: unknown) {
    if (!(err instanceof Error)) {
      return res.status(500).json({ message: 'Unknown error occurred!', type: 'error' });
    }
    return res.status(500).json({ type: 'error', message: err.message });
  }
});

userRouter.delete('/', accessVerification(Roles.ADMIN), async (req, res) => {
  const id = <string>req.query['id'];
  try {
    await User.deleteById(id);
    return res.status(200).json({ type: 'ok', message: 'user deleted' });
  } catch (err: unknown) {
    if (!(err instanceof Error)) {
      return res.status(500).json({ message: 'Unknown error occurred!', type: 'error' });
    }
    return res.status(500).json({ type: 'error', message: err.message });
  }
});

userRouter.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const authenticatedUser = await User.authenticateAndGet(email, password);
    if (authenticatedUser === undefined) {
      return res.sendStatus(401);
    }
    // TODO review attributes
    const token = jwt.sign(authenticatedUser, process.env.MY_SECRET, {
      expiresIn: '1h',
    });
    logger.debug(`login from ${authenticatedUser.name} was succesful`);
    res.cookie('token', token, { maxAge: 3600000 });
    return res.status(200).json({ type: 'valid', user: authenticatedUser });
  } catch (err: unknown) {
    if (!(err instanceof Error)) {
      return res.status(500).json({ message: 'Unknown error occurred!', type: 'error' });
    }
    return res.status(500).json({ message: err.message, type: 'error' });
  }
});

userRouter.delete('/logout', (_req: Request, res: Response) => {
  res.clearCookie('token');
  res.status(200).json({ type: 'succes', message: 'token cleared' });
});

export default userRouter;
