import { NextFunction, Request, Response } from "express";
import { apmAgent } from "../.."
import config from "../../config";
import { extractClientName } from "../../helpers"

/**
 * Add client name to the apm logs
 * 
 * @param {Request} req 
 * @param {Response} res 
 * @param {NextFunction} next 
 */
export const setApmLabel = (req: Request, res: Response, next: NextFunction) => {
    if (config.web.isApm) {
        const clientName = extractClientName(req.headers['authorization'] || '');

        apmAgent!.setLabel('clientName', clientName);
    }

    next();
}
