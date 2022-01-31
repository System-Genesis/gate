import { NextFunction, Request, Response } from "express";
import { apmAgent } from "../.."
import { extractClientName } from "../../helpers"


export const setApmLabel = (req: Request, res: Response, next: NextFunction) => {
    const clientName = extractClientName(req.headers['authorization'] || '');
    console.log(clientName);

    apmAgent.setLabel('clientName', clientName);
    next();
}
