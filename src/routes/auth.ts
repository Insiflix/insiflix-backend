/* eslint-disable @typescript-eslint/restrict-plus-operands */
import { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
export {};

const { Router } = require('express');
const auth = Router();
const crypto = require('crypto');
const { db } = require('../tools/database');
const bcrypt = require('bcrypt');
const { requireAuth } = require('../tools/middlewares');

auth.post(
  '/login',
  body('enteredName').isString().notEmpty(),
  body('enteredPassword').isString().notEmpty(),
  (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    console.log('ahhh');
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
          if (
            user !== undefined &&
            bcrypt.compareSync(req.body.enteredPassword, user?.password) ===
              true
          ) {
            const session = crypto.randomUUID();
            const watchToken = crypto.randomUUID();
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
);

auth.get('/validate', requireAuth, (req: Request, res: Response) => {
  res
    .status(200)
    .json({ message: 'authorized', username: res.locals.username });
});

module.exports = auth;
