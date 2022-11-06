import express, { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import multer from 'multer';
import User from '../model/userModel';
import newLogger from '../modules/logger';

const authRouter = express.Router();
const logger = newLogger('router.auth');

authRouter.post('/login', multer().none(), async (req: Request, res: Response) => {
  try {
    logger.silly('[login] Hello!');
    const { body: { email, password } } = req;
    const authenticatedUser = await User.authenticateAndGet(email, password);
    if (authenticatedUser === undefined) {
      logger.debug('[login] authenticatedUser is undefined, so unauthorized!');
      return res.sendStatus(401);
    }
    const {
      firstName, lastName, email: foundEmail, role,
    } = authenticatedUser;
    const token = jwt.sign({
      firstName, lastName, email: foundEmail, role,
    }, process.env.MY_SECRET, {
      expiresIn: '1h',
    });
    logger.debug(`[login] attempt by ${authenticatedUser.email} was successful!`);
    logger.silly(`[login] token for ${authenticatedUser.email}: ${token}`);
    res.cookie('token', token, { maxAge: 3600000 });
    // TODO should this really be returned?
    return res.status(200).json({
      type: 'valid',
      user: {
        firstName, lastName, email: foundEmail, role,
      },
    });
  } catch (err: unknown) {
    if (!(err instanceof Error)) {
      logger.error('[login] Critical error occurred', err);
      return res.status(500).json({ message: 'Unknown error occurred!', type: 'error' });
    }
    logger.error(`[login] ${err.message}`);
    return res.status(500).json({ message: err.message, type: 'error' });
  }
});

authRouter.post('/logout', (_req: Request, res: Response) => {
  logger.silly('[logout] Hello!');
  res.clearCookie('token');
  res.status(200).json({ type: 'success', message: 'token cleared' });
});

export default authRouter;
