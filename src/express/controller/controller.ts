import { NextFunction, Request, Response } from 'express';
import * as JSONStream from 'JSONStream';

import axios, { AxiosRequestConfig, Method } from 'axios';
import { DigitalIdentityDTO, EntityDTO, Filters, QueryParams, RoleDTO, Transformers, typesOfEntities } from '../../types';
import QueryString from 'qs';
import config from '../../config';
import { extractScopes } from '../../helpers';

import { extractRulesFromScopes } from '../../utils/extractRules';
import { applyTransformers } from '../../transformService';
import { combineQueriesFromRules } from '../../scopeQuery';
const { entitiesType } = config;

class Controller {

  /**
   * Handling clients data requests 
   * 
   * - create 'filter queries' for based on the client scopes
   * - pass the user's req to the relevant service with the 'filter queries'
   * - based on the user's scopes transform the returned data,
   *   this transformation is only for specific fields in each
   *   data obj
   * - return the data to client
   * 
   * @param {Request} req 
   * @param {Response} res 
   * @param {NextFunction} _next 
   */
  static async proxyRequest(req: Request, res: Response, _next: NextFunction) {
    const scopes = extractScopes(req.headers.authorization || '');

    const { filters, transformers } = extractRulesFromScopes(scopes, res.locals.entityType);

    const axiosResult = await Controller.sendRequest(req, res, filters);

    if (req.query.stream) {
      return Controller.handleStreamResponse(req, res, axiosResult, transformers);
    }

    const result = Controller.handleResponse(req, res.locals.entityType, axiosResult.data, transformers);

    res.status(axiosResult.status).set(axiosResult.headers).send(result);
  }

  private static async handleStreamResponse(req, res, axiosResult, transformers) {
    if (req.method.toLowerCase() === 'get') {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      axiosResult.data.pipe(JSONStream.parse('*', (doc) =>
        Controller.handleResponse(req, res.locals.entityType, doc, transformers)
      )).pipe(JSONStream.stringify()).pipe(res);
    }
  }

  private static async sendRequest(req: Request, res: Response, filters: Filters[]) {
    let ruleFilters: QueryParams[] = [];

    if (req.method.toLowerCase() === 'get') {
      ruleFilters = combineQueriesFromRules(filters, res.locals.entityType);
    }

    const options: AxiosRequestConfig = {
      url: `${res.locals.destServiceUrl}${req.originalUrl.split('?')[0]}`,
      method: req.method.toLowerCase() as Method,
      headers: req.headers,
      data: req.body,
      paramsSerializer: (params) => QueryString.stringify(params),
      params: { ...req.query, ruleFilters },
      timeout: 1000 * 60 * 60, // 1 hour
    };

    if (req.query.stream) {
      options.responseType = 'stream';
    }

    return (await axios(options));
  }

  private static handleResponse(req: Request, entityType: typesOfEntities, result, transformers: Transformers[]) {
    if (req.method.toLowerCase() === 'get') {
      if (Controller.isExpanded(req.query.expanded as string, entityType)) {
        result = handleExpandedResult(result, entityType, transformers);
      } else if (Array.isArray(result)) {
        result = result.map((dataObj) => applyTransformers(transformers, dataObj));
      } else {
        result = applyTransformers(transformers, result);
      }
    }

    return result;
  }

  private static isExpanded(expanded: string, entityType: string) {
    return Boolean(expanded) && ![config.entitiesType.role, config.entitiesType.group].includes(entityType)
  }
}


/**
 * Take care of expanded result which contains several
 * types of data in one response.
 * 
 * For example root type of 'digitalIdentity' that containes a 'role',
 * each type will be handled differently 
 * 
 * @param {*} result data to manipulate
 * @param {typesOfEntities} entityType the type of the root data
 * @param {Transformers[]} transformers user's transformers
 * @returns transformed data
 */
function handleExpandedResult(result: any, entityType: typesOfEntities, transformers: Transformers[]) {
  if (Array.isArray(result)) {
    return result.map((expandedItem) => transformExpandedRes(expandedItem, entityType, transformers));
  }

  return transformExpandedRes(result, entityType, transformers);
}

/**
 * Handle single expanded data obj,
 * (for more explanation see handleExpandedResult)
 * 
 * @param {*} result data to manipulate
 * @param {typesOfEntities} entityType the type of the root data
 * @param {Transformers[]} transformers user's transformers
 * @returns transformed data
 */
function transformExpandedRes(result: any, entityType: typesOfEntities, transformers: Transformers[]) {
  return entityType === entitiesType.entity ? expandedEntity(result, transformers) : expandedDi(result, transformers);
}

/**
 * Handle transformation of an expanded result where the root type is 'Entity'
 * 
 * @param {*} result data to manipulate
 * @param {Transformers[]} transformers user's transformers
 * @returns transformed data
 */
function expandedEntity(result: EntityDTO, transformers: Transformers[]) {
  const transEntity = applyTransformers(transformers, result) as EntityDTO;

  if (transEntity.digitalIdentities) {
    transEntity.digitalIdentities = transEntity.digitalIdentities.map((di) => expandedDi(di, transformers));
  }

  return transEntity;
}

/**
 * Handle transformation of an expanded result where the root type is 'DigitalIdentity'
 * 
 * @param {*} result data to manipulate
 * @param {Transformers[]} transformers user's transformers
 * @returns transformed data
 */
function expandedDi(result: DigitalIdentityDTO, transformers: Transformers[]) {
  const transDi = applyTransformers(transformers, result) as DigitalIdentityDTO;

  if (transDi.role) {
    transDi.role = applyTransformers(transformers, transDi.role) as RoleDTO;
  }

  return transDi;
}

export default Controller;
