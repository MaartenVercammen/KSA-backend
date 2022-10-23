import express from 'express';
import multer from 'multer';
import fs from 'fs';
import authcheck from '../middleware/authcheck';
import roleCheck from '../middleware/roleCheck';
import { Roles } from '../types';

const fileRouter = express.Router();

const publicPath = process.env['PUBLIC_PATH'] || '';

const storage = multer.diskStorage({
  destination: (req, file, callBack) => {
    const addonpath = req.query['path'];
    switch (file.mimetype) {
      case 'application/pdf':
        callBack(null, `${publicPath}/pdf/${addonpath}`);
        break;
      case 'image/jpeg':
      case 'image/png':
      case 'image/webp':
        callBack(null, `${publicPath}/images`);
        break;
      default:
        callBack(null, publicPath);
    }
  },
  filename: (_req, file, callBack) => {
    callBack(null, `${file.originalname}`);
  },
});

const upload = multer({ storage });

fileRouter.post(
  '/',
  authcheck,
  roleCheck(Roles.ADMIN, Roles.BRAGGEL, Roles.BONDS),
  upload.single('file'),
  (_req, res) => {
    res.status(200).json({ type: 'ok', message: 'File Uploaded' });
  },
);

fileRouter.get('/braggels', (req, res) => {
  const files = fs.readdirSync(`${publicPath}/pdf/${req.query['path']}`);
  res.status(200).json(files);
});

fileRouter.delete(
  '/braggels',
  authcheck,
  roleCheck(Roles.ADMIN, Roles.BRAGGEL, Roles.BONDS),
  (req, res) => {
    const { filename } = req.query;
    const { path: pathFromQuery } = req.query;
    fs.unlink(`${publicPath}/pdf/${pathFromQuery}/${filename}`, (err) => {
      if (err) res.status(500).json({ type: 'error', message: err.message });
      else res.status(200).json({ type: 'ok', message: 'braggel deleted' });
    });
  },
);

export default fileRouter;
