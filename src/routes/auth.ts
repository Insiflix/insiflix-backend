/* eslint-disable @typescript-eslint/restrict-plus-operands */
import { Request, Response } from 'express';
export {};

const { Router } = require('express');
const auth = Router();
const crypto = require('crypto');
const { db } = require('../tools/database');
const bcrypt = require('bcrypt');
const { requireAuth } = require('../tools/middlewares');

auth.post('/login', (req: Request, res: Response) => {
  console.log(req.cookies);
  if (
    req.body?.enteredName === undefined ||
    req.body?.enteredPassword === undefined
  ) {
    const err = new Error();
    err.message = 'Missing login credentials';
    err.name = 'missing-credentials';
    res.status(410).json(err);
  } else {
    let user: any = null;
    db.all(
      'SELECT * FROM Users WHERE user_name = ?',
      [req.body.enteredName],
      (err: Error, rows: any) => {
        if (err !== null) {
          user = null;
          console.log(err);
          err = new Error();
          err.message = 'Invalid login credentials';
          err.name = 'auth-credentials';
          res.status(406).json(err);
        } else {
          user = rows[0];
          console.log(user);
          if (
            user !== undefined &&
            bcrypt.compareSync(req.body.enteredPassword, user?.password) ===
              true
          ) {
            console.log('valid login');
            const session = crypto.randomUUID();
            const watchToken = crypto.randomUUID();
            console.log(session);
            db.all(
              `INSERT INTO Sessions VALUES ("${user.user_name}", "${session}", "${watchToken}")`
            );
            res
              .cookie('sessionId', session, {
                secure: true,
                httpOnly: true,
                sameSite: 'none'
              })
              .json({ message: 'sucess', username: user, watchToken });
          } else {
            const err = new Error();
            err.message = 'Invalid login credentials';
            err.name = 'auth-credentials';
            res.status(406).json(err);
          }
        }
      }
    );
  }
});

auth.get('/validate', requireAuth, (req: Request, res: Response) => {
  res
    .status(200)
    .json({ message: 'authorized', username: res.locals.username });
});

module.exports = auth;
