/* eslint-disable @typescript-eslint/restrict-plus-operands */
import { Request, Response } from 'express';
const { requireAuth } = require('../tools/middlewares');
const { db } = require('../tools/database');
const fs = require('fs');
const crypto = require('crypto');
const path = require('path');

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
  // TODO: get video from youtube, ad to db
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
