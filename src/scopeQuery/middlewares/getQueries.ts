import { NextFunction, Request, Response } from "express";


const getQueries = (req: Request, res: Response, next: NextFunction) => {
    res.locals.scopes
}