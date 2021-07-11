// import axios from 'axios';
import { Request, Response } from 'express';
import getFilterQueries from '../../scopeQuery';
import querystring from 'querystring';
// import getFilterQueries from '../../scopeQuery';
import { applyTransform } from '../../transformService';

function extractScopes(token: string): string[] {
  const scopes = JSON.parse(
    Buffer.from((token || '').split('.')[1], 'base64').toString('ascii')
  ).scope;
  return Array.isArray(scopes) ? scopes : [scopes];
}

class Controller {
  static async something(req: Request, res: Response) {
    //hello
    const { scopes, persons } = req.body;
    const moddedPersons = persons.map((person) =>
      applyTransform(person, scopes, 'entity')
    );
    // const moddedPerson = applyTransform(person, scopes);
    res.json(moddedPersons);
  }

  // static async getQueries(_req: Request, res: Response, next: NextFunction) {
  //     res.locals.filters = getFilterQueries(res.locals.scopes, res.locals.entityType);
  //     next();
  // }

  static async proxyRequest(req: Request, res: Response, _) {
    console.log(req.originalUrl, req.url, req.baseUrl);
    
    const scopes = extractScopes(req.headers.authorization || '');
    const filterQueries = getFilterQueries(scopes, res.locals.entityType);
    const queryParams = querystring.stringify({ filterQueries: JSON.stringify(filterQueries) });
    console.log(queryParams);
    
  }
}

export default Controller;
