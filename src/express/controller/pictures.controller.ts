import { NextFunction, Request, Response } from 'express';
import getFilterQueries from '../../scopeQuery';
import axios, { AxiosProxyConfig, AxiosResponse } from 'axios';
import { QueryParams } from '../../types';
import QueryString from 'qs';
import { extractScopes } from '../../helpers';

class PicturesController {
  /**
   * Handeling clients picture requests 
   * 
   * - create 'filter queries' for based on the client scopes
   * - pass the user's req to the relevant service with the 'filter queries'
   * - stream the image to client
   * 
   * @param {Request} req 
   * @param {Response} res 
   * @param {NextFunction} _next 
   */
  static async proxyRequest(req: Request, res: Response, _next: NextFunction) {
    const scopes = extractScopes(req.headers.authorization || '');

    let ruleFilters: QueryParams[] = [];
    if (req.method === 'GET') {
      ruleFilters = getFilterQueries(scopes, res.locals.entityType);
    }

    const options  = {
      url: `${res.locals.destServiceUrl}${req.originalUrl.split('?')[0]}`,
      method: req.method.toLowerCase(),
      headers: req.headers,
      data: req.body,
      responseType: 'stream',
      paramsSerializer: (params) => {
        return QueryString.stringify(params);
      },
      params: { ...req.query, ruleFilters },
      timeout: 1000 * 60 * 60, // 1 hour
    };

    const response: AxiosResponse<any> = await axios((options as unknown) as AxiosProxyConfig);
    res.writeHead(200, { 'Content-Type': 'image/jpeg' });
    response.data.pipe(res);
  }
}

export default PicturesController;
