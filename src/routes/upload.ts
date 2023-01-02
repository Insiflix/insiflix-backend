/* eslint-disable @typescript-eslint/restrict-plus-operands */
import { Request, Response } from 'express';
const { requireAuth } = require('../tools/middlewares');
const { db } = require('../tools/database');
const fs = require('fs');
const crypto = require('crypto');
const path = require('path');
const exec = require('child_process');
const axios = require('axios');

export {};

const { Router } = require('express');
const upload = Router();

upload.post('/yt', requireAuth, (req: Request, res: Response) => {
  if (req.body.url === undefined) {
    const err = new Error();
    err.name = 'missing-url';
    err.message = 'missing video url';
    res.status(420).json(err);
  }
  const url: string = req.body.url.toString();
  const id = url.split('?v=')[1];
  if (id === null) {
    const err = new Error();
    err.name = 'missing-url';
    err.message = 'missing video url';
    res.status(420).json(err);
  }
  exec(`./yt-dwnl ${url} ${id}`, (err: Error, stdout: any, stderr: any) => {
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
    axios
      .get('https://www.youtube.com/watch?v=-OvNxmP6O90')
      .then((res: any) => {
        const html = res.data.toString();
        let indice1 = html.indexOf('<meta name="title" content="');
        let sub = html.substring(indice1 + 28, indice1 + 200);
        sub = sub.substring(0, sub.indexOf('">'));
        const title = sub;
        indice1 = html.indexOf('<link itemprop="name" content="');
        sub = html.substring(indice1 + 31, indice1 + 200);
        sub = sub.substring(0, sub.indexOf('">'));
        const creator = sub;
        db.all(
          `INSERT INTO Videos VALUES ("${id}", "${title}", tags, "${creator}", "${new Date().getMilliseconds()}", length, "${
            process.env.videoPath + id
          }")`
        );
      });
  });
});

upload.post('/file', requireAuth, (req: any, res: Response) => {
  if (req.body.url === undefined) {
    const err = new Error();
    err.name = 'missing-url';
    err.message = 'missing video url';
    res.status(420).json(err);
  }
  req.pipe(req.busboy);

  const file: any = {
    length: 'hh:mm:ss',
    id: crypto.randomUUID().toString().subString(0, 7)
  };
  req.busboy.on('file', (fieldname: any, file: any, filename: any) => {
    const fstream = fs.createWriteStream(
      path.join(process.env.videoPath, file.id)
    );
    file.pipe(fstream);

    fstream.on('close', () => {
      console.log(`Upload of '${filename}' finished`);
      res.redirect('back');
    });
  });
  db.all(
    `INSERT INTO Videos VALUES ("${
      file.id
    }", ?, ?, ?, "${new Date().getMilliseconds()}", "${file.length}", "${
      process.env.videoPath + file.id
    }")`
  );
});

module.exports = upload;
