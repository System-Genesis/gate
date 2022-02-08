import { AxiosError } from 'axios';
import * as express from 'express';
import { apmAgent } from '../..';

export class ServiceError extends Error {
  public code;

  constructor(code: number, message: string) {
    super(message);
    this.code = code;
  }
}

/**
 * Error Handler
 * 
 * @param error 
 * @param _req 
 * @param res 
 * @param _next 
 */
export const errorMiddleware = (
  error: AxiosError | ServiceError,
  _req: express.Request,
  res: express.Response,
  _next: express.NextFunction
) => {
  const status = error.code || (error as AxiosError).response?.status || 500;

  // Error with pictures || Error with axios req || other errors
  const resBody =
  (error as AxiosError).response?.config?.responseType === 'stream'
      ? { message: (error as AxiosError).response?.statusText }
      : (error as AxiosError).response?.data || { message: error.message };

  apmAgent.captureError(resBody);

  res.status(parseInt(status)).json({
    ...resBody,
    status,
  });
};
