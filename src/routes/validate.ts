import { Request, Response } from 'express';
export {};

const { Router } = require('express');
const validate = Router();
const { requireAuth } = require('../tools/middlewares');

validate.get('/', requireAuth, (req: Request, res: Response) => {
  res
    .status(200)
    .json({ message: 'authorized', username: res.locals.username });
});
