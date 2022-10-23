import type { NextFunction, Request, Response } from 'express';

const roleCheck = (...Roles: string[]) => (req: Request, res: Response, next: NextFunction) => {
  // TODO rework middleware
  // @ts-ignore
  if (Roles.includes(req.user.role)) {
    // TODO add logger
    // eslint-disable-next-line
    //console.log(req.user.role);
    next();
  } else {
    res.status(401).json({ type: 'error', message: 'no authentication' });
  }
};

export default roleCheck;
