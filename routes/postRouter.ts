import express from 'express';
import authcheck from '../middleware/authcheck';
import roleCheck from '../middleware/roleCheck';
import { Post as IPost, Roles } from '../types';
import Post from '../model/postModel';

const postRouter = express.Router();

postRouter.get('/', async (_req, res) => {
  try {
    const posts = await Post.getAll();
    return res.status(200).json(posts);
  } catch (err: unknown) {
    if (!(err instanceof Error)) {
      return res.status(500).json({ message: 'Unknown error occurred!', type: 'error' });
    }
    return res.status(500).json({ message: err.message, type: 'error' });
  }
});
postRouter.post('/', authcheck, roleCheck(Roles.ADMIN, Roles.BONDS, Roles.BRAGGEL), async (req, res) => {
  const post: IPost = req.body;
  try {
    await Post.create(post);
    return res.status(200).json({ type: 'ok', message: 'post created' });
  } catch (err: unknown) {
    if (!(err instanceof Error)) {
      return res.status(500).json({ message: 'Unknown error occurred!', type: 'error' });
    }
    return res.status(500).json({ type: 'error', message: err.message });
  }
});

postRouter.put('/', authcheck, roleCheck(Roles.ADMIN, Roles.BONDS, Roles.BRAGGEL), async (req, res) => {
  const post: IPost = req.body;
  try {
    await Post.update(post);
    return res.status(200).json({ type: 'ok', message: 'post updated' });
  } catch (err: unknown) {
    if (!(err instanceof Error)) {
      return res.status(500).json({ message: 'Unknown error occurred!', type: 'error' });
    }
    return res.status(500).json({ type: 'error', message: err.message });
  }
});

postRouter.delete('/', authcheck, roleCheck(Roles.ADMIN, Roles.BONDS, Roles.BRAGGEL), async (req, res) => {
  const id = <string>req.query['id'];
  try {
    await Post.deleteById(id);
    return res.status(200).json({ type: 'ok', message: 'post deleted' });
  } catch (err: unknown) {
    if (!(err instanceof Error)) {
      return res.status(500).json({ message: 'Unknown error occurred!', type: 'error' });
    }
    return res.status(500).json({ type: 'error', message: err.message });
  }
});

export default postRouter;
