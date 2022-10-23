import jwt, { JsonWebTokenError } from 'jsonwebtoken';
import type { NextFunction, Request, Response } from 'express';
import type { User } from '../types';

// eslint-disable-next-line import/prefer-default-export
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
