import express from 'express';
import multer from 'multer';
import { v4 as uuid } from 'uuid';
import fs from 'fs';
import { accessVerification, uploadMagazine } from '../modules/middlewares';
import { Roles } from '../types';
import newLogger from '../modules/logger';
import Magazine from '../model/magazineModel';

const magazineRouter = express.Router();
const logger = newLogger('router.file');

const uploadCallback = uploadMagazine.single('file');

magazineRouter.post('/', accessVerification(Roles.ADMIN, Roles.BRAGGEL, Roles.BONDS), async (req, res) => {
  logger.silly('[post] Hello!');
  await uploadCallback(req, res, async (err) => {
    if (err instanceof multer.MulterError) {
      logger.error('[post] Error occurred during upload', err);
      return res.status(500).json({ message: err.message, type: 'error' });
    }

    if (err) {
      logger.error('[post] Critical error occurred during upload', err);
      return res.status(500).json({ message: 'Unknown error during upload occurred!', type: 'error' });
    }

    const { body: { type }, file } = req;

    await Magazine.create({
      id: uuid(),
      type,
      title: file!.filename,
      path: file!.path,
    });

    return res.status(200).json({ type: 'success', message: 'File Uploaded' });
  });
});

magazineRouter.get('/:type', async (req, res) => {
  logger.silly('[get][forType] Hello');
  const { params: { type } } = req;
  logger.debug(`[get][forType] getAll of type '${type}'`);
  try {
    const magazines = await Magazine.getAllOfType(type);
    return res.status(200).json(magazines);
  } catch (err) {
    if (!(err instanceof Error)) {
      logger.error(`[get][forType] Critical error occurred while fetching all with type '${type}'`, err);
      return res.status(500).json({ message: 'Unknown error occurred!', type: 'error' });
    }
    logger.error(`[get][forType] error while fetching all for type '${type}': ${err.message}`);
    return res.status(500).json({ type: 'error', message: err.message });
  }
});

magazineRouter.delete('/', accessVerification(Roles.ADMIN, Roles.BRAGGEL, Roles.BONDS), async (req, res) => {
  try {
    logger.silly('[delete] Hello');
    const { body: { magazine: { id } } } = req;
    const [magazine] = await Magazine.deleteById(id);
    if (magazine) {
      fs.unlinkSync(magazine.path);
    }
    return res.status(200).json({ type: 'success', message: 'Magazine deleted' });
  } catch (err) {
    if (!(err instanceof Error)) {
      logger.error('[delete] Critical error occurred', err);
      return res.status(500).json({ message: 'Unknown error occurred!', type: 'error' });
    }
    logger.error(`[delete] ${err.message}`);
    return res.status(500).json({ type: 'error', message: err.message });
  }
});

export default magazineRouter;
