// import axios from 'axios';
import { Request, Response } from 'express';
import getFilterQueries from '../../scopeQuery';
// import getFilterQueries from '../../scopeQuery';
import { applyTransform } from '../../transformService';
import axios from 'axios';
import { QueryParams } from '../../types';
import QueryString from 'qs';
class Controller {
  static async proxyRequest(req: Request, res: Response, _) {
    const scopes = extractScopes(req.headers.authorization || '');

    let ruleFilters: QueryParams[] = [];
    if (req.method === 'GET') {
      ruleFilters = getFilterQueries(scopes, res.locals.entityType);
    }

    const options = {
      url: `${res.locals.destServiceUrl}${
        req.originalUrl.split('?')[0]
      }`,
      method: req.method.toLowerCase(),
      headers: req.headers,
      data: req.body,
      paramsSerializer: (params) => {
        return QueryString.stringify(params);
      },
      params: { ...req.query, ruleFilters },
      timeout: 1000 * 60 * 60, // 1 hour
    };

    const response = await axios(options as any);
    let result = response.data;

    if (req.method === 'GET') {
      if (Array.isArray(result)) {
        result = result.map(dataObj => applyTransform(dataObj, scopes, res.locals.entityType));
      } else {
        result = applyTransform(result, scopes, res.locals.entityType);
      }
    }

    res.status(response.status).set(response.headers).send(result);
  }
}

function extractScopes(token: string): string[] {
  try {
    const scopes = JSON.parse(
      Buffer.from((token || '').split('.')[1], 'base64').toString('ascii')
    ).scope;
    return Array.isArray(scopes) ? scopes : [scopes];
  } catch (err) {
    return [];
  }
}

export default Controller;
