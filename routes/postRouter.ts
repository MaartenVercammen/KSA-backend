import express from 'express';
import { accessVerification } from '../modules/middlewares';
import { Roles } from '../types';
import Post from '../model/postModel';
import newLogger from '../modules/logger';

const postRouter = express.Router();
const logger = newLogger('router.post');

postRouter.get('/', async (_req, res) => {
  try {
    logger.silly('[get] Hello!');
    const posts = await Post.getAll();
    return res.status(200).json(posts);
  } catch (err: unknown) {
    if (!(err instanceof Error)) {
      logger.error('[get] Critical error occurred', err);
      return res.status(500).json({ message: 'Unknown error occurred!', type: 'error' });
    }
    logger.error(`[get] ${err.message}`);
    return res.status(500).json({ message: err.message, type: 'error' });
  }
});
postRouter.post('/', accessVerification(Roles.ADMIN, Roles.BONDS, Roles.BRAGGEL), async (req, res) => {
  try {
    logger.silly('[post] Hello!');
    const { body: { post } } = req;
    await Post.create(post);
    return res.status(200).json({ type: 'ok', message: 'post created' });
  } catch (err: unknown) {
    if (!(err instanceof Error)) {
      logger.error('[post] Critical error occurred', err);
      return res.status(500).json({ message: 'Unknown error occurred!', type: 'error' });
    }
    logger.error(`[post] ${err.message}`);
    return res.status(500).json({ type: 'error', message: err.message });
  }
});

postRouter.put('/', accessVerification(Roles.ADMIN, Roles.BONDS, Roles.BRAGGEL), async (req, res) => {
  try {
    logger.silly('[put] Hello!');
    const { body: { post } } = req;
    await Post.update(post);
    return res.status(200).json({ type: 'ok', message: 'post updated' });
  } catch (err: unknown) {
    if (!(err instanceof Error)) {
      logger.error('[put] Critical error occurred', err);
      return res.status(500).json({ message: 'Unknown error occurred!', type: 'error' });
    }
    logger.error(`[put] ${err.message}`);
    return res.status(500).json({ type: 'error', message: err.message });
  }
});

postRouter.delete('/', accessVerification(Roles.ADMIN, Roles.BONDS, Roles.BRAGGEL), async (req, res) => {
  try {
    logger.silly('[delete] Hello!');
    const { body: { post: { id, title } } } = req;
    logger.debug('[delete] Post with title `%s` (id: `%s`) will be deleted!', title, id);
    await Post.deleteById(id);
    return res.status(200).json({ type: 'ok', message: 'post deleted' });
  } catch (err: unknown) {
    if (!(err instanceof Error)) {
      logger.error('[delete] Critical error occurred', err);
      return res.status(500).json({ message: 'Unknown error occurred!', type: 'error' });
    }
    logger.error(`[delete] ${err.message}`);
    return res.status(500).json({ type: 'error', message: err.message });
  }
});

export default postRouter;
