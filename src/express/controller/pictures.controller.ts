import { Request, Response } from 'express';
import getFilterQueries from '../../scopeQuery';
import axios, { AxiosResponse } from 'axios';
import { QueryParams } from '../../types';
import QueryString from 'qs';

class PicturesController {
  static async proxyRequest(req: Request, res: Response, _) {
    const scopes = extractScopes(req.headers.authorization || '');

    let ruleFilters: QueryParams[] = [];
    if (req.method === 'GET') {
      ruleFilters = getFilterQueries(scopes, res.locals.entityType);
    }

    const options = {
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

    // let response: AxiosResponse<Readable>;
    const response: AxiosResponse<any> = await axios(options as any);
    response.data.pipe(res);
  }
}

function extractScopes(token: string): string[] {
  try {
    const scopes = JSON.parse(Buffer.from((token || '').split('.')[1], 'base64').toString('ascii')).scope;
    return Array.isArray(scopes) ? scopes : [scopes];
  } catch (err) {
    return [];
  }
}

export default PicturesController;
