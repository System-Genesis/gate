import * as express from 'express';

export class ServiceError extends Error {
  public code;

  constructor(code: number, message: string) {
    super(message);
    this.code = code;
  }
}

export const errorMiddleware = (
  error: any,
  _req: express.Request,
  res: express.Response,
  _next: express.NextFunction
) => {
  const status = error.response?.status || 500;
  const data = error.response ? error.response.data : error.data;
  res.status(status).json({
    status,
    ...data,
  });
};
