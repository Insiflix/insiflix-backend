import { Request, Response } from 'express';
require('dotenv').config();
const express = require('express');
const logger = require('morgan');
const helmet = require('helmet');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const fileupload = require('express-fileupload');
const app = express();

const auth = require('./routes/auth');
const videos = require('./routes/videos');
const upload = require('./routes/upload');
const img = require('./routes/img');
const recommandations = require('./routes/recommandations');

app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(logger('dev'));
app.use(
  helmet({
    crossOriginResourcePolicy: false
  })
);
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(fileupload());

app.get('/', (req: Request, res: Response) => {
  res.send('Insiflix API');
});

app.use('/auth', auth);
app.use('/recommandations', recommandations);
app.use('/videos', videos);
app.use('/upload', upload);
app.use('/img', img);

app.listen(process.env.PORT ?? 4000, () => {
  console.log(`express server is running on port ${process.env.PORT ?? 4000}`);
});
