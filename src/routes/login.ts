/* eslint-disable @typescript-eslint/restrict-plus-operands */
import { Request, Response } from 'express';
export {};

const { Router } = require('express');
const login = Router();
const crypto = require('crypto');
const { db } = require('../tools/database');
const bcrypt = require('bcrypt');

login.post('/', (req: Request, res: Response) => {
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
            console.log(session);
            db.all(
              `INSERT INTO Sessions VALUES ("${user.user_name}", "${session}")`
            );
            res
              .cookie('sessionId', session, {
                secure: true,
                httpOnly: true,
                sameSite: 'none'
              })
              .json({ message: 'sucess', username: user });
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

module.exports = login;
