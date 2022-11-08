import express from 'express';
import fs from 'fs';
import { accessVerification, upload } from '../modules/middlewares';
import { Roles } from '../types';
import newLogger from '../modules/logger';

const fileRouter = express.Router();
const logger = newLogger('router.file');

const uploadDirectory = process.env.UPLOAD_DIR || 'uploads';

fileRouter.post('/', accessVerification(Roles.ADMIN, Roles.BRAGGEL, Roles.BONDS), upload.single('file'), (_req, res) => {
  logger.silly('[get] Hello!');
  return res.status(200).json({ type: 'ok', message: 'File Uploaded' });
});

fileRouter.get('/braggels', (req, res) => {
  try {
    const { query: { fileType } } = req;
    const files = fs.readdirSync(`${uploadDirectory}/pdf/${fileType}`);
    return res.status(200).json(files);
  } catch (err) {
    if (!(err instanceof Error)) {
      logger.error('Critical error occurred', err);
      return res.status(500).json({ message: 'Unknown error occurred!', type: 'error' });
    }

    if (err.message.includes('ENOENT')) {
      return res.status(200).json([]);
    }

    logger.error(err.message);
    return res.status(500).json({ type: 'error', message: err.message });
  }
});

fileRouter.delete('/braggels', accessVerification(Roles.ADMIN, Roles.BRAGGEL, Roles.BONDS), (req, res) => {
  try {
    const { query: { fileName, fileType } } = req;
    fs.unlinkSync(`${uploadDirectory}/pdf/${fileType}/${fileName}`);
    return res.status(200).json({ type: 'ok', message: 'braggel deleted' });
  } catch (err) {
    if (!(err instanceof Error)) {
      logger.error('Critical error occurred', err);
      return res.status(500).json({ message: 'Unknown error occurred!', type: 'error' });
    }
    logger.error(err.message);
    return res.status(500).json({ type: 'error', message: err.message });
  }
});

export default fileRouter;
