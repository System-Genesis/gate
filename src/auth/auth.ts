import jwt from "jsonwebtoken";
import fs from "fs";
import path from "path";
import { NextFunction, Request, Response } from "express";
import config from "../config/index";
import { ServiceError } from "../express/middlewares/error";

const { web: { requiredScopes } } = config; 

type payloadType = { aud: string, scope: string[] };

/**
 * take the jwt spike token form req and check the followings:
 * - if the token is valid (original, not expired etc.)
 * - the audience which the token issued for (is it for this system)
 * - weather the token has the required basic scopes
 * 
 * In case one of the conditions acove is failed throw an Error
 * 
 * @param {Request} req 
 * @param {Response} res 
 * @param {NextFunction} next 
 * @returns {void} call next() to the next middleware
 */
const isAuth = async (req: Request, res: Response, next: NextFunction) => {
  if (config.web.isAuth === false) return next();

  const token = req.header("Authorization");

  try {
    if (!token) throw new ServiceError(401, 'Unauthorized');

    const key = fs.readFileSync(path.join(__dirname, "../key/key.pem"));

    const payload: payloadType = jwt.verify(
      token,
      key.toString()
    ) as payloadType;

    if (!payload || payload.aud !== config.spike.myAud) throw new ServiceError(401, 'Unauthorized');

    basicScopeHandler(payload.scope, requiredScopes, req.method);

    return next();
  } catch (err) {
    next(new ServiceError(401, 'Unauthorized'));
  }
};

/**
 * check if scopes containes at least one of
 * the required scopes, throw an error if don't.
 * 
 * @param {string[]} scopes 
 * @param {strign[]} requiredScopes 
 * @param {string} reqMethod 
 */
export const basicScopeHandler = (
  scopes: string[],
  requiredScopes: string[],
  reqMethod: string
) => {
  if (!scopes || scopes.length === 0)
    throw new ServiceError(403, "Access denied");

  const haveBasicScopes = requiredScopes.some((scope) =>
    scopes.includes(scope)
  );
  if (!haveBasicScopes) throw new ServiceError(403, "Access denied");

  if (reqMethod && reqMethod != "GET" && !scopes.includes("write")) {
    throw new ServiceError(403, "Access denied");
  }
};


export default isAuth;
