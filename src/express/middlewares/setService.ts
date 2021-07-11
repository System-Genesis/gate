import { NextFunction, Request, Response } from 'express';

const setService = (serviceUrl: string) => {
  return async (_req: Request, res: Response, next: NextFunction) => {
    res.locals.destService = serviceUrl;
    next();
  };
};

export default setService;
