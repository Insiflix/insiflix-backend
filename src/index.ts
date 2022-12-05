import { Request, Response } from 'express';
require('dotenv').config();
const express = require('express');
const logger = require('morgan');
const helmet = require('helmet');
const cors = require('cors');
const app = express();

app.use(cors({ origin: '*' }));
app.use(logger('dev'));
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get('/', (req: Request, res: Response) => {
  res.send('Insiflix API');
});

app.listen(process.env.PORT ?? 4000, () => {
  console.log(`express server is running on port ${process.env.PORT ?? 4000}`);
});
