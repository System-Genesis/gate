import { NextFunction, Request, Response } from "express";

const setService = (serviceUrl: string) => {
  return async (_req: Request, res: Response, next: NextFunction) => {
    res.locals.destServiceUrl = serviceUrl;
    next();
  };
};

const setEntityType = (entityType: string) => {
  return async (_req: Request, res: Response, next: NextFunction) => {
    res.locals.entityType = entityType;
    next();
  };
};

export { setEntityType, setService };
