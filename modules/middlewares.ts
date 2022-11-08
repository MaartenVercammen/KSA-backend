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

if (!fs.existsSync(`${uploadDirectory}/magazines/monthly`)) {
  fs.mkdirSync(`${uploadDirectory}/magazines/monthly`, { recursive: true });
}

if (!fs.existsSync(`${uploadDirectory}/magazines/specials`)) {
  fs.mkdirSync(`${uploadDirectory}/magazines/specials`, { recursive: true });
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

export const uploadMagazine = multer({
  storage: multer.diskStorage({
    destination: (req, _file, callback) => {
      const { body: { type } } = req;
      if (type === 'monthly') {
        callback(null, `${uploadDirectory}/magazines/monthly`);
      } else if (type === 'special') {
        callback(null, `${uploadDirectory}/magazines/specials`);
      }
    },
    filename: (_req, file, callback) => {
      callback(null, `${file.originalname}`);
    },
  }),
  fileFilter: (_req, file, callback) => {
    if (file.mimetype !== 'application/pdf') {
      return callback(new Error('Only PDF files allowed!'));
    }
    return callback(null, true);
  },
});
