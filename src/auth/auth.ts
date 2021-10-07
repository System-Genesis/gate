import jwt from 'jsonwebtoken';
import fs from 'fs';
import path from 'path';
import { NextFunction, Request, Response } from 'express';
import config from '../config/index';

const errorRes = (res: Response) => res.status(401).send('Unauthorized');

type payloadType = { aud: string };

const isAuth = async (req: Request, res: Response, next: NextFunction) => {
  if (process.env.ENV === 'mock') return next();

  const token = req.header('Authorization');

  try {
    if (!token) return errorRes(res);

    const key = fs.readFileSync(path.join(__dirname, '../key/key.pem'));

    const payload: payloadType = jwt.verify(
      token,
      key.toString()
    ) as payloadType;

    if (!payload || payload.aud !== config.spike.myAud) return errorRes(res);

    return next();
  } catch (err) {
    return errorRes(res);
  }
};

export default isAuth;