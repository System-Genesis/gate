import * as YAML from 'yamljs';
import * as swaggerTools from 'swagger-tools';
import { Request, Response, NextFunction } from 'express';

/**
 * create swagger ui docs from swagger.yaml and send it to client
 * 
 * @returns {(req: Requst, res: Response, next: NextFunction) => Promise<void>}
 */
export const getDocsMiddleware = () => {
  // load swagger docs
  const swaggerDoc = YAML.load('swagger.yaml');
  // get middleware promise
  const loadSwaggerPromise = new Promise((resolve, reject) => {
    swaggerTools.initializeMiddleware(swaggerDoc, (middleware: any) => resolve(middleware));
  });
  return async (req: Request, res: Response, next: NextFunction) => {
    const middleware: any = await loadSwaggerPromise;
    middleware.swaggerUi()(req, res, next);
  };
};
