import { Request, Response } from 'express';
require('dotenv').config();
const express = require('express');
const logger = require('morgan');
const helmet = require('helmet');
const cors = require('cors');
const busboy = require('connect-busboy');
const app = express();

const auth = require('./routes/auth');
const videos = require('./routes/videos');
const upload = require('./routes/upload');
const recommandations = require('./routes/recommandations');

app.use(cors({ origin: '*' }));
app.use(logger('dev'));
app.use(
  helmet({
    crossOriginResourcePolicy: false
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(
  busboy({
    highWaterMark: 2 * 1024 * 1024
  })
);

app.get('/', (req: Request, res: Response) => {
  res.send('Insiflix API');
});

app.use('/auth', auth);
app.use('/recommandations', recommandations);
app.use('/videos', videos);
app.user('/upload', upload);

app.listen(process.env.PORT ?? 4000, () => {
  console.log(`express server is running on port ${process.env.PORT ?? 4000}`);
});
