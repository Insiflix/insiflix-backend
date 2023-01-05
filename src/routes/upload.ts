/* eslint-disable @typescript-eslint/restrict-plus-operands */
import { Request, Response } from 'express';
import { body } from 'express-validator';

const { requireAuth, validate } = require('../tools/middlewares');
const { db } = require('../tools/database');
const fs = require('fs');
const crypto = require('crypto');
const path = require('path');
const exec = require('child_process');
const axios = require('axios');

export {};

const { Router } = require('express');
const upload = Router();

upload.post(
  '/yt',
  requireAuth,
  body('url').isURL().notEmpty(),
  validate,
  (req: Request, res: Response) => {
    console.log(req.body);
    const url: string = req.body.url.toString();
    const id = url.split('?v=')[1];
    console.log(id);
    if (id === undefined) {
      const err = new Error();
      err.name = 'missing-url';
      err.message = 'missing video url';
      res.status(420).json(err);
      return;
    }
    res.status(200).json({ msg: 'yes' });
    return;
    exec(
      `./scripts/get-yt ${id} ${url} ${process.env.NAS_PATH}`,
      (err: Error, stdout: any, stderr: any) => {
        if (err !== null) {
          console.log(err.message);
          return;
        }
        if (stderr !== null) {
          console.log(stderr);
          return;
        }
        console.log(stdout);
        const thumbnail = `https://i.ytimg.com/vi/${id}`;
        let tags = 'youtube';
        if (req.body.tag !== undefined) {
          tags.concat(' ', req.query.tag?.toString() ?? '');
        }
        axios
          .get('https://www.youtube.com/watch?v=-OvNxmP6O90')
          .then((res: any) => {
            const html = res.data.toString();
            fs.writeFileSync('./test.html', html);
            let indice1 = html.indexOf('<meta name="title" content="');
            let sub = html.substring(indice1 + 28, indice1 + 200);
            sub = sub.substring(0, sub.indexOf('">'));
            const title = sub;
            indice1 = html.indexOf('<link itemprop="name" content="');
            sub = html.substring(indice1 + 31, indice1 + 200);
            sub = sub.substring(0, sub.indexOf('">'));
            const creator = sub;
            indice1 = html.indexOf('"lengthSeconds"');
            sub = html.substring(indice1 + 17, indice1 + 50);
            sub = sub.substring(0, sub.indexOf('",'));
            sub = new Date(parseInt(sub) * 1000).toISOString().slice(11, 19);
            if (sub.split(':')[0] === '00') sub = sub.substring(3, 8);
            const length = sub;
            db.all(
              `INSERT INTO Videos VALUES (?, "${title}", ?, "${creator}", "${new Date().getMilliseconds()}", "${length}", "${
                process.env.videoPath
              }/?", ?)`,
              [id, tags, id, thumbnail]
            );
          });
      }
    );
  }
);

upload.post(
  '/file',
  requireAuth,
  body('tags').isString().notEmpty(),
  body('creator').isString().notEmpty(),
  body('title').isString().notEmpty(),
  validate,
  (req: any, res: Response) => {
    console.log(req.files);
    if (req.files?.file === undefined) {
      const err = new Error();
      err.name = 'missing-params';
      err.message = 'missing upload params';
      res.status(420).json(err);
      return;
    }

    const id = crypto.randomUUID().toString().substring(0, 7);
    const video = req.files.file;
    const thumbnail = req.files?.thumbnail;
    video.mv(
      path.join(process.env.VIDEO_PATH?.toString(), id + '.mp4'),
      (err: Error) => {
        if (err) {
          console.log(err);
        }
        if (thumbnail !== undefined) {
          thumbnail.mv(
            path.join(process.env.VIDEO_PATH?.toString(), id + '.png'),
            (err: Error) => {
              if (err) {
                console.log(err);
              }
              db.all(
                `INSERT INTO Videos VALUES ("${id}", ?, ?, ?, "${new Date().getMilliseconds()}", "hh:aa:dd", "${
                  process.env.VIDEO_PATH?.toString() + id + '.mp4'
                }", "${process.env.IMG_PATH?.toString() + id + '.png'}")`,
                [req.body.title, req.body.tags, req.body.creator]
              );
              res.status(200).json({ msg: 'sucess' });
            }
          );
        } else {
          db.all(
            `INSERT INTO Videos VALUES ("${id}", ?, ?, ?, "${new Date().getMilliseconds()}", "hh:aa:dd", "${
              process.env.VIDEO_PATH?.toString() + id
            }", "g:/Projekte/insiflix-backend/mekka.png")`,
            [req.body.title, req.body.tags, req.body.creator]
          );
        }

        res.status(200).json({ msg: 'sucess' });
      }
    );
  }
);

module.exports = upload;
