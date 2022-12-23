import { Request, Response } from 'express';
const { requireAuth } = require('../tools/middlewares');
const { db } = require('../tools/database');

export {};

const { Router } = require('express');
const recommandations = Router();

recommandations.get('/random', requireAuth, (req: Request, res: Response) => {
  db.all(
    'SELECT * FROM Videos ORDER BY RAND() LIMIT 10',
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

recommandations.get('/recent', requireAuth, (req: Request, res: Response) => {
  db.all(
    'SELECT * FROM Videos ORDER BY upload_date DESC LIMIT 10',
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

recommandations.post('/tags', requireAuth, (req: Request, res: Response) => {
  if (req.body?.tag === undefined) {
    const err = new Error();
    err.message = 'Missing tag';
    err.name = 'missing-tag';
    res.status(412).json(err);
  }

  db.all(
    'SELECT * FROM Videos WHERE tags LIKE "%?%" ORDER BY RAND() LIMIT 10',
    [req.body.tag],
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

module.exports = recommandations;
