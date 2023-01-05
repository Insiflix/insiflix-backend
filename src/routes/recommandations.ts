import { Request, Response } from 'express';
import { query } from 'express-validator';

const { requireAuth, validate } = require('../tools/middlewares');
const { db } = require('../tools/database');

export {};

const { Router } = require('express');
const recommandations = Router();

recommandations.get('/random', requireAuth, (req: Request, res: Response) => {
  let amount = '10';
  if (req.query.amount !== undefined) {
    amount = req.query.amount.toString();
  }
  db.all(
    'SELECT * FROM Videos ORDER BY RANDOM() LIMIT ?',
    [amount],
    (err: Error, rows: any[]) => {
      if (err !== null) {
        res.status(411);
      }
      const videos: any = [];

      rows.forEach((row: any) => {
        videos.push({
          id: row.id,
          title: row.title,
          thumbnail: row.thumbnail,
          length: row.length
        });
      });
      res.status(200).json({ videos });
    }
  );
});

recommandations.get('/recent', requireAuth, (req: Request, res: Response) => {
  let amount = '10';
  if (req.query.amount !== undefined) {
    amount = req.query.amount.toString();
  }
  db.all(
    'SELECT * FROM Videos ORDER BY upload_date DESC LIMIT ?',
    [amount],
    (err: Error, rows: any) => {
      if (err !== null) {
        res.status(411);
      }
      const videos: any = [];
      rows.forEach((row: any) => {
        videos.push({
          id: row.id,
          title: row.title,
          thumbnail: row.thumbnail,
          length: row.length
        });
      });
      res.status(200).json({ videos });
    }
  );
});

recommandations.get(
  '/tags',
  requireAuth,
  query('tag').isString().notEmpty(),
  validate,
  (req: Request, res: Response) => {
    let amount = '10';
    if (req.query.amount !== undefined) {
      amount = req.query.amount.toString();
    }

    db.all(
      'SELECT * FROM Videos WHERE INSTR(tags, ?) > 0 ORDER BY RANDOM() LIMIT ?',
      [req.query.tag, amount],
      (err: Error, rows: any[]) => {
        if (err !== null) {
          res.status(411);
        }
        const videos: any = [];
        rows.forEach((row: any) => {
          videos.push({
            id: row.id,
            title: row.title,
            thumbnail: row.thumbnail,
            length: row.length
          });
        });
        res.status(200).json({ videos });
      }
    );
  }
);

module.exports = recommandations;
