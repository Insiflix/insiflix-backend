import { Request, Response } from 'express';
import { body, param } from 'express-validator';

const { requireAuthToken, validate } = require('../tools/middlewares');
const { db } = require('../tools/database');
const fs = require('fs');

export {};

const { Router } = require('express');
const videos = Router();

videos.get(
  '/watch/:id',
  requireAuthToken,
  param('id').isString().notEmpty(),
  validate,
  (req: Request, res: Response) => {
    db.all(
      'SELECT path FROM Videos WHERE id = ?',
      [req.params.id],
      (err: Error, rows: any) => {
        if (err !== null) {
          const err = new Error();
          err.message = 'Invalid video id';
          err.name = 'invalid-id';
          res.status(416).json(err);
        }

        const range = req.headers.range;
        const videoPath = rows[0].path;
        const videoSize = fs.statSync(videoPath).size;

        const chunkSize = 1 * 1e6;
        const start = Number(range?.replace(/\D/g, ''));
        const end = Math.min(start + chunkSize, videoSize - 1);
        const contentLength = end - start + 1;

        const headers = {
          'Content-Range': `bytes ${start}-${end}/${videoSize}`,
          'Accept-Ranges': 'bytes',
          'Content-Length': contentLength,
          'Content-Type': 'video/mp4'
        };
        res.writeHead(206, headers);

        const stream = fs.createReadStream(videoPath, { start, end });
        stream.pipe(res);
      }
    );
  }
);

module.exports = videos;
