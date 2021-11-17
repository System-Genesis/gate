import { Request, Response } from 'express';
import getFilterQueries from '../../scopeQuery';
import { applyTransform } from '../../transformService';
import axios from 'axios';
import { DigitalIdentityDTO, EntityDTO, QueryParams, RoleDTO, typesOfEntities } from '../../types';
import QueryString from 'qs';
import config from '../../config';
import { extractScopes } from '../../helpers';
const { entitiesType } = config;
class Controller {
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
      paramsSerializer: (params) => {
        return QueryString.stringify(params);
      },
      params: { ...req.query, ruleFilters },
      timeout: 1000 * 60 * 60, // 1 hour
    };

    let response;
    response = await axios(options as any);
    let result = response.data;

    if (req.method === 'GET') {
      if (
        Boolean(req.query.expanded) &&
        (res.locals.entityType !== config.entitiesType.role || res.locals.entityType !== config.entitiesType.group)
      ) {
        result = handleExpandedResult(result, res.locals.entityType, scopes);
      } else if (Array.isArray(result)) {
        result = result.map((dataObj) => applyTransform(dataObj, scopes, res.locals.entityType));
      } else {
        result = applyTransform(result, scopes, res.locals.entityType);
      }
    }
    res.status(response.status).set(response.headers).send(result);
  }
}

function handleExpandedResult(result: any, entityType: typesOfEntities, scopes: string[]) {
  if (Array.isArray(result)) {
    result = result.map((expandedItem) => {
      expandedItem = transformExpandedRes(expandedItem, entityType, scopes);
      return expandedItem;
    });
  } else {
    result = transformExpandedRes(result, entityType, scopes);
  }
  return result;
}

function transformExpandedRes(result: any, entityType: typesOfEntities, scopes: string[]) {
  return entityType === entitiesType.entity ? expandedEntity(result, scopes) : expandedDi(result, scopes);
}

function expandedEntity(result: EntityDTO, scopes: string[]) {
  const transEntity = applyTransform(result, scopes, entitiesType.entity as typesOfEntities) as EntityDTO;

  if (transEntity.digitalIdentities) {
    transEntity.digitalIdentities = transEntity.digitalIdentities.map((di) => {
      return expandedDi(di, scopes);
    });
  }

  return transEntity;
}

function expandedDi(result, scopes: string[]) {
  const transDi = applyTransform(result, scopes, entitiesType.digitalIdentity as any) as DigitalIdentityDTO;

  if (transDi.role) {
    transDi.role = applyTransform(transDi.role, scopes, entitiesType.role as typesOfEntities) as RoleDTO;
  }

  return transDi;
}

export default Controller;
