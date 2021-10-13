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
  const {
    response: { status },
  } = error;
  const data = error.response.data;
  res.status(status || 500).json({
    ...data,
    status,
  });
};
