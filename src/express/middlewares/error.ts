import * as express from 'express';

export class ServiceError extends Error {
  public code;

  constructor(code: number, message: string) {
    super(message);
    this.code = code;
  }
}

export const errorMiddleware = (
  error: any, // TODO manage service error properly
  _req: express.Request,
  res: express.Response,
  _next: express.NextFunction
) => {
  const status = error.response?.status || 500;

  const resBody =
    error.response.config.responseType === 'stream'
      ? { message: error.response.statusText }
      : error.response?.data || { message: error.message };
  res.status(status).json({
    ...resBody,
    status,
  });
};
