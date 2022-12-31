import { Request, Response, NextFunction } from 'express';
const { db } = require('./database');
export {};

const requireAuth = (req: Request, res: Response, next: NextFunction): void => {
  if (req.cookies?.sessionId === undefined) {
    console.log(req.cookies);
    const error = new Error();
    error.message = 'Missing session';
    error.name = 'auth.unauthorized';
    res.status(401).json(error);
  } else {
    let user: any;
    db.all(
      'SELECT user_name FROM Sessions WHERE session_id=?',
      [req.cookies.sessionId],
      (err: Error, res: any) => {
        if (err !== null) {
          user = null;
        } else {
          user = res[0];
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

const requireAuthToken = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (req.query?.sessionId === undefined) {
    const error = new Error();
    error.message = 'Missing session';
    error.name = 'auth.unauthorized';
    res.status(401).json(error);
  } else {
    let user: any;
    db.all(
      'SELECT user_name FROM Sessions WHERE session_id = ? ',
      [req.query.sessionId],
      (err: Error, rows: any) => {
        if (err !== null) {
          user = null;
        } else {
          user = rows[0];
        }
      }
    );

    if (user !== null) {
      res.locals.userName = user;
      next();
    } else {
      const error = new Error();
      error.message = 'Invalid token';
      error.name = 'auth.unauthorized';
      res.status(402).json(error);
    }
  }
};

module.exports = { requireAuth, requireAuthToken };
