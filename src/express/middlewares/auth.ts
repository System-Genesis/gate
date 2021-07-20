import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';
import * as util from 'util';
import * as fs from 'fs';
import * as path from 'path';
import { ServiceError } from './error';
import config from '../../config';

const { web } = config;

const averify = util.promisify(jwt.verify);

export default async (req: Request, _res: Response, next: NextFunction) => {
    if (!web.isAuth) return next();

    const token = req.header('Authorization');

    try {
        const key = fs.readFileSync(path.join(__dirname, '../../assets/spikePubKey.pem'));

        const payload = await averify(token, key.toString()).catch(() => {
            throw new ServiceError(401, 'Unauthorized');
        });
        
        const { scopes } = payload;
        const { requiredScopes } = web;
        basicScopeHandler(scopes, requiredScopes);

        return next();
    } catch (err) {
        return next(err);
    }
};

export const basicScopeHandler = (scopes: String [], requiredScopes: String []) => {

    console.log(scopes);
    
    if(!scopes || scopes.length === 0) throw new ServiceError(403, 'Access denied');

    const haveBasicScopes = requiredScopes.some(scope => scopes.includes(scope));
    if(!haveBasicScopes) throw new ServiceError(403, 'Access denied');
}