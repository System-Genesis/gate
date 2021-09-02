// import axios from 'axios';
import { Request, Response } from 'express';
import getFilterQueries from '../../scopeQuery';
// import getFilterQueries from '../../scopeQuery';
import { applyTransform } from '../../transformService';
import axios from 'axios';
import { QueryParams } from '../../types';
import QueryString from 'qs';
import config from '../../config';

const { entitiesType } = config;
class Controller {
  static async proxyRequest(req: Request, res: Response, _) {
    console.log(req.query.expanded);

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
      paramsSerializer: (params) => {
        return QueryString.stringify(params);
      },
      params: { ...req.query, ruleFilters },
      timeout: 1000 * 60 * 60, // 1 hour
    };

    const response = await axios(options as any);
    let result = response.data;

    if (req.method === 'GET') {
      if (Boolean(req.query.expanded)) {
        result = handleExpandedResult(result, res.locals.entityType, scopes);
      } else if (Array.isArray(result)) {
        result = result.map((dataObj) =>
          applyTransform(dataObj, scopes, res.locals.entityType)
        );
      } else {
        result = applyTransform(result, scopes, res.locals.entityType);
      }
    }

    res.status(response.status).set(response.headers).send(result);
  }
}

function handleExpandedResult(result: any, entityType: string, scopes: string[]) {
  if (Array.isArray(result)) {
    result = result.map((expandedItem) => transformExpandedRes(expandedItem, entityType, scopes)
    );
  } else {
    result = transformExpandedRes(result, entityType, scopes);
  }
  return result;
}

function transformExpandedRes(
  result: any,
  entityType: string,
  scopes: string[]
) {
  return entityType === entitiesType.entity
    ? expandedEntity(result, scopes)
    : expandedDi(result, scopes);
}

function expandedEntity(result: any, scopes: string[]) {
  const transEntity = applyTransform(result, scopes, entitiesType.entity as any);
  transEntity.digitalIdentities = transEntity.digitalIdentities.map((di) => {
    expandedDi(di, scopes);
  });

  return transEntity;
}

function expandedDi(result: any, scopes: string[]) {
  const transDi = applyTransform(result, scopes, entitiesType.digitalIdentity as any);
  transDi.role = applyTransform(transDi.role, scopes, entitiesType.role as any);

  return transDi;
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
