import jwt from 'jsonwebtoken';
import type { NextFunction, Request, Response } from 'express';

const logger = require('../modules/logger')('authcheck');

const authcheck = (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies?.token;
  if (req.path === '/user/login') {
    next();
  } else if (token !== undefined) {
    const user = jwt.verify(token, process.env['MY_SECRET'] || '');
    if (user) {
      logger.debug(`User:${user.toString()} asked for ${req.path}`);
      // TODO rework middleware
      // @ts-ignore
      req.user = user;
      next();
    }
  } else {
    res.status(418).json({ type: 'error', message: 'no authentication' });
  }
};

export default authcheck;
