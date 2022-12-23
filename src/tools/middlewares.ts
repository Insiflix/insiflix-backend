import { Request, Response, NextFunction } from 'express';
const { db } = require('./database');
export {};

const requireAuth = (req: Request, res: Response, next: NextFunction): void => {
  if (req.cookies?.sessionId === undefined) {
    const error = new Error();
    error.message = 'Missing session';
    error.name = 'auth.unauthorized';
    res.status(401).json(error);
  } else {
    let user: any;
    db.all(
      'SELECT Username FROM Sessions WHERE session_id=?',
      [req.cookies.sessionId],
      (err: Error, res: any) => {
        if (err !== null) {
          user = null;
        } else {
          user = res[0].user_name;
        }
      }
    );

    if (user !== undefined) {
      res.locals.userName = user;
      next();
    } else {
      const error = new Error();
      error.message = 'Invalid token';
      error.name = 'auth.unauthorized';
      res.status(401).json(error);
    }
  }
};

module.exports = { requireAuth };
