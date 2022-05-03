import { NextFunction, Request, Response } from 'express';
//import * as fs from 'fs';
import { Transform } from 'stream';
import * as JSONStream from 'JSONStream';
import getFilterQueries from '../../scopeQuery';
import { applyTransform } from '../../transformService';
import axios from 'axios';
import { DigitalIdentityDTO, EntityDTO, QueryParams, RoleDTO, typesOfEntities } from '../../types';
import QueryString from 'qs';
import config from '../../config';
import { extractScopes } from '../../helpers';
const { entitiesType } = config;
class Controller {

  /**
   * Handeling clients data requests 
   * 
   * - create 'filter queries' for based on the client scopes
   * - pass the user's req to the relevant service with the 'filter queries'
   * - based on the user's scopes transfrom the retturned data,
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

    let ruleFilters: QueryParams[] = [];
    if (req.method === 'GET') {
      ruleFilters = getFilterQueries(scopes, res.locals.entityType);
    }

    let options = {
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
    if (req.query.stream) {
      options['responseType'] = 'stream';
    }

    let response = await axios(options as any);
    let result = response.data;
    //let streamResult = Object.assign({}, result)

    // response.data.on('data',)
    if (req.method === 'GET' && !req.query.stream) {
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
    if (req.query.stream) {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      // response.data.pipe(JSONStream.stringify())
      // let countOkey = 0;
      // let countNotOkey = 0;

      // response.data.readableObjectMode = true; // didnt work
      response.data.pipe(JSONStream.parse('*', (chunk) => {
        if (req.method === 'GET') {
          if (
            Boolean(req.query.expanded) &&
            (res.locals.entityType !== config.entitiesType.role || res.locals.entityType !== config.entitiesType.group)
          ) {
            chunk = handleExpandedResult(chunk, res.locals.entityType, scopes);
          } else if (Array.isArray(chunk)) {
            chunk = chunk.map((dataObj) => applyTransform(dataObj, scopes, res.locals.entityType));
          } else {
            chunk = applyTransform(chunk, scopes, res.locals.entityType);
          }
        }
        return chunk
      })).pipe(JSONStream.stringify()).pipe(res);


    } else {
      res.status(response.status).set(response.headers).send(result);
    }

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
 * @param {string[]} scopes user's scopes
 * @returns transformed data
 */
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

/**
 * Handle single expanded data obj,
 * (for more explanation see handleExpandedResult)
 * 
 * @param {*} result data to manipulate
 * @param {typesOfEntities} entityType the type of the root data
 * @param {string[]} scopes user's scopes
 * @returns transformed data
 */
function transformExpandedRes(result: any, entityType: typesOfEntities, scopes: string[]) {
  return entityType === entitiesType.entity ? expandedEntity(result, scopes) : expandedDi(result, scopes);
}

/**
 * Handle transformation of an expanded result where the root type is 'Entity'
 * 
 * @param {*} result data to manipulate
 * @param {string[]} scopes user's scopes
 * @returns transformed data
 */
function expandedEntity(result: EntityDTO, scopes: string[]) {
  const transEntity = applyTransform(result, scopes, entitiesType.entity as typesOfEntities) as EntityDTO;

  if (transEntity.digitalIdentities) {
    transEntity.digitalIdentities = transEntity.digitalIdentities.map((di) => {
      return expandedDi(di, scopes);
    });
  }

  return transEntity;
}

/**
 * Handle transformation of an expanded result where the root type is 'DigitalIdentity'
 * 
 * @param {*} result data to manipulate
 * @param {string[]} scopes user's scopes
 * @returns transformed data
 */
function expandedDi(result, scopes: string[]) {
  const transDi = applyTransform(result, scopes, entitiesType.digitalIdentity as any) as DigitalIdentityDTO;

  if (transDi.role) {
    transDi.role = applyTransform(transDi.role, scopes, entitiesType.role as typesOfEntities) as RoleDTO;
  }

  return transDi;
}

export default Controller;
