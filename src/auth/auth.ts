import jwt from "jsonwebtoken";
import fs from "fs";
import path from "path";
import { NextFunction, Request, Response } from "express";
import config from "../config/index";
import { ServiceError } from "../express/middlewares/error";

const { web: { requiredScopes } } = config; 

type payloadType = { aud: string, scope: string[] };

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
    next(err);
  }
};

export const basicScopeHandler = (
  scopes: String[],
  requiredScopes: String[],
  reqMethod: string
) => {
  if (!scopes || scopes.length === 0)
    throw new ServiceError(403, "Access denied");

  const haveBasicScopes = requiredScopes.some((scope) =>
    scopes.includes(scope)
  );
  if (!haveBasicScopes) throw new ServiceError(403, "Access denied");

  if (reqMethod && reqMethod != "GET" && !scopes.includes("write")) {
    throw new ServiceError(401, "Unauthorized");
  }
};


export default isAuth;
