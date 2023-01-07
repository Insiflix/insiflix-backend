import { Request, Response, NextFunction } from 'express';
import { validationResult, query, cookie } from 'express-validator';
const cache = require('memory-cache');
const { db } = require('./database');
export {};

const requireAuth = (req: Request, res: Response, next: NextFunction): void => {
  if (req.cookies?.sessionId === undefined) {
    const error = new Error();
    error.message = 'Missing session';
    error.name = 'auth.unauthorized';
    res.status(401).json(error);
    return;
  }
  const userCached = cache.get(req.cookies.sessionId);
  if (userCached !== null) {
    res.locals.userName = userCached.user_name;
    next();
  }

  let user: any;
  db.all(
    'SELECT user_name FROM Sessions WHERE session_id = ?',
    [req.cookies.sessionId],
    (err: Error, rows: any) => {
      if (err !== null) {
        user = null;
      } else {
        user = rows[0];

        if (user !== undefined) {
          res.locals.userName = user.user_name;
          cache.put(req.cookies.sessionId, user, 3600 * 1000);
          next();
        } else {
          const error = new Error();
          error.message = 'Invalid token';
          error.name = 'auth.unauthorized';
          res.status(402).json(error);
        }
      }
    }
  );
};

const requireAuthToken = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (req.query?.watchToken === undefined) {
    const error = new Error();
    error.message = 'Missing token';
    error.name = 'auth.unauthorized';
    res.status(401).json(error);
    return;
  }
  const userCached = cache.get(req.query.watchToken);
  if (userCached !== null) {
    res.locals.userName = userCached.user_name;
    next();
  }

  let user: any;
  db.all(
    'SELECT user_name FROM Sessions WHERE watch_token = ? ',
    [req.query.watchToken],
    (err: Error, rows: any) => {
      if (err !== null) {
        user = null;
        const error = new Error();
        error.message = 'Internal error';
        error.name = 'auth.unauthorized';
        res.status(505).json(error);
      } else {
        user = rows[0];
        if (user !== undefined) {
          res.locals.userName = user;
          cache.put(req.query.watchToken, user, 3600 * 1000);
          next();
        } else {
          const error = new Error();
          error.message = 'Invalid token';
          error.name = 'auth.unauthorized';
          res.status(402).json(error);
        }
      }
    }
  );
};

const validate = (req: Request, res: Response, next: NextFunction): any => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

module.exports = { requireAuth, requireAuthToken, validate };
