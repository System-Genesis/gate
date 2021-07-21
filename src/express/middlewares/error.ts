import * as express from 'express';

export class ServiceError extends Error {
    public code;

    constructor(code: number, message: string) {
        super(message);
        this.code = code;
    }
}

export const errorMiddleware = (error: ServiceError, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    const { message, code } = error;
    
    res.status(code || 500).json({
        message,
        code,
    });
};
