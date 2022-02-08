import { NextFunction, Request, Response } from "express";

/**
 * Add the destination service to the res.locals.destServiceUrl
 * so the client req will be redirect their later
 * 
 * @param serviceUrl
 */
const setService = (serviceUrl: string) => {
  return async (_req: Request, res: Response, next: NextFunction) => {
    res.locals.destServiceUrl = serviceUrl;
    next();
  };
};

/**
 * Add the entityType service to the res.locals.entityType
 * in order to use it for scoping
 * 
 * @param entityType
 * @returns 
 */
const setEntityType = (entityType: string) => {
  return async (_req: Request, res: Response, next: NextFunction) => {
    res.locals.entityType = entityType;
    next();
  };
};

export { setEntityType, setService };
