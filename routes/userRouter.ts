import express, { Request, Response } from 'express';
import User from '../model/userModel';
import { accessVerification } from '../modules/middlewares';
import newLogger from '../modules/logger';
import { Roles } from '../types';

const userRouter = express.Router();
const logger = newLogger('router.user');

userRouter.get('/', accessVerification(Roles.ADMIN, Roles.BONDS), async (_req: Request, res: Response) => {
  try {
    logger.silly('[get] Hello!');
    const users = await User.getAll();
    logger.debug('[get] found %s users', users.length);
    return res.status(200).json(users);
  } catch (err: unknown) {
    if (!(err instanceof Error)) {
      logger.error('[get] Critical error occurred', err);
      return res.status(500).json({ message: 'Unknown error occurred!', type: 'error' });
    }
    logger.error(`[get] ${err.message}`);
    return res.status(500).json({ message: err.message, type: 'error' });
  }
});

userRouter.post('/', accessVerification(Roles.ADMIN), async (req, res) => {
  try {
    logger.silly('[post] Hello!');
    const { body: { user } } = req;
    await User.create(user);
    return res.status(200).json({ type: 'ok', message: 'user created' });
  } catch (err: unknown) {
    if (!(err instanceof Error)) {
      logger.error('[post] Critical error occurred', err);
      return res.status(500).json({ message: 'Unknown error occurred!', type: 'error' });
    }
    logger.error(`[post] ${err.message}`);
    return res.status(500).json({ type: 'error', message: err.message });
  }
});

userRouter.put('/', accessVerification(Roles.ADMIN), async (req, res) => {
  try {
    logger.silly('[put] Hello!');
    const { body: { user } } = req;
    await User.update(user);
    return res.status(200).json({ type: 'ok', message: 'user updated' });
  } catch (err: unknown) {
    if (!(err instanceof Error)) {
      logger.error('[put] Critical error occurred', err);
      return res.status(500).json({ message: 'Unknown error occurred!', type: 'error' });
    }
    logger.error(`[put] ${err.message}`);
    return res.status(500).json({ type: 'error', message: err.message });
  }
});

userRouter.delete('/', accessVerification(Roles.ADMIN), async (req, res) => {
  try {
    logger.silly('[delete] Hello!');
    const { body: { user: { id, email } } } = req;
    logger.debug('[delete] User with e-mail `%s` (id: `%s`) will be deleted!', email, id);
    await User.deleteById(id);
    return res.status(200).json({ type: 'ok', message: 'user deleted' });
  } catch (err: unknown) {
    if (!(err instanceof Error)) {
      logger.error('[delete] Critical error occurred', err);
      return res.status(500).json({ message: 'Unknown error occurred!', type: 'error' });
    }
    logger.error(`[delete] ${err.message}`);
    return res.status(500).json({ type: 'error', message: err.message });
  }
});

export default userRouter;
