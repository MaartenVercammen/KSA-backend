import jwt, { JsonWebTokenError } from 'jsonwebtoken';
import type { NextFunction, Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import type { User } from '../types';
import newLogger from './logger';

const requestLogger = newLogger('request');

let uploadDirectory = process.env.UPLOAD_DIR || 'uploads';
if (uploadDirectory.charAt(0) === '~') {
  uploadDirectory = path.join(process.env.HOME, uploadDirectory.slice(1));
}

if (!fs.existsSync(uploadDirectory)) {
  fs.mkdirSync(uploadDirectory);
}

export const loggerMiddleware = (req: Request, _res: Response, next: NextFunction) => {
  requestLogger.silly(`[${req.method}] ${req.url}`);
  next();
};

export const accessVerification = (...allowedRoles: string[]) => (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const token = req.cookies?.token;
  if (req.path === '/user/login') {
    return next();
  }

  if (token !== undefined) {
    try {
      const user = <User>jwt.verify(token, process.env.MY_SECRET);
      if (allowedRoles.includes(user.role)) {
        return next();
      }
    } catch (err: unknown) {
      if (err instanceof JsonWebTokenError) {
        return res.sendStatus(401);
      }
      return res.status(500).json({ message: 'Unknown error occurred!', type: 'error' });
    }
  }

  return res.sendStatus(401);
};

export const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, callBack) => {
      const { query: { fileType } } = req;
      // TODO enhance for errors
      fs.mkdirSync(`${uploadDirectory}/pdf/${fileType}`, { recursive: true });
      switch (file.mimetype) {
        case 'application/pdf':
          callBack(null, `${uploadDirectory}/pdf/${fileType}`);
          break;
        case 'image/jpeg':
        case 'image/png':
        case 'image/webp':
          callBack(null, `${uploadDirectory}/images`);
          break;
        default:
          callBack(null, uploadDirectory);
      }
    },
    filename: (_req, file, callBack) => {
      callBack(null, `${file.originalname}`);
    },
  }),
});
