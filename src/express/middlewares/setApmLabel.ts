import { NextFunction, Request, Response } from "express";
import { apmAgent } from "../.."
import { extractClientName } from "../../helpers"

/**
 * Add client name to the apm logs
 * 
 * @param {Request} req 
 * @param {Response} res 
 * @param {NextFunction} next 
 */
export const setApmLabel = (req: Request, res: Response, next: NextFunction) => {
    const clientName = extractClientName(req.headers['authorization'] || '');

    apmAgent.setLabel('clientName', clientName);
    next();
}
