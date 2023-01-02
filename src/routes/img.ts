/* eslint-disable @typescript-eslint/restrict-plus-operands */
import { Request, Response } from 'express';
const { requireAuth } = require('../tools/middlewares');
const { db } = require('../tools/database');

export {};

const { Router } = require('express');
const img = Router();

img.get('/:id', requireAuth, (req: Request, res: Response) => {
  if (req.params.id === undefined) {
    const err = new Error();
    err.name = 'missing-id';
    err.message = 'missing image id';
    res.status(420).json(err);
  }

  db.all(
    'SELECT thumbnail FROM Videos WHERE id = ?',
    [req.params.id],
    (err: Error, rows: any[]) => {
      if (err !== null || rows.length === 0) {
        const err = new Error();
        err.name = 'invalid-id';
        err.message = 'invalid image id';
        res.status(425).json(err);
        return;
      }
      res.sendFile(rows[0].thumbnail);
    }
  );
});

module.exports = img;
