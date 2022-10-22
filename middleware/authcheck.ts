import jwt from 'jsonwebtoken';

const logger = require('../modules/logger')('authcheck');

const authcheck = (req, res, next) => {
  const token = req.cookies?.token;
  if (req.path === '/user/login') {
    next();
  } else if (token !== undefined) {
    const user = jwt.verify(token, process.env.MY_SECRET);
    if (user) {
      logger.debug(`User:${user.toString()} asked for ${req.path}`);
      req.user = user;
      next();
    }
  } else {
    res.status(418).json({ type: 'error', message: 'no authentication' });
  }
};

export default authcheck;
