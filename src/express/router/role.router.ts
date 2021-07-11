import { NextFunction, Request, Response, Router } from 'express';
import wrapController from '../../utils/wrapController';
import Controller from '../controller/controller';
// import FeatureController from './controller';
// import FeatureValidator from './validator';
// import { wrapController, wrapValidator } from '../../utils/express';
// import ValidateRequest from '../../utils/joi';
// import { getFoldersRequestSchema, createFolderRequestSchema } from './validator.schema';

const roleRouter: Router = Router();

roleRouter.use((_req: Request, res: Response, next: NextFunction) => {
  res.locals.entityType = 'role';
  next();
});

roleRouter.post('/', () => {});
// roleRouter.get('/digitalIdentity/:digitalIdentityUniqueId', () => {});
roleRouter.get('/:id', wrapController(Controller.proxyRequest));
roleRouter.delete('/:id', () => {});
roleRouter.patch('/:id', () => {});
roleRouter.get('/group/:groupId', () => {});
roleRouter.get('/hierarchy/:hierarchy', () => {});
roleRouter.get('/search', () => {});
roleRouter.patch('/:roleId/moveToGroup', () => {});
roleRouter.patch('/:roleId/connectDigitalIdentity', () => {});
roleRouter.patch(':roleId/disconnectDigitalIdentity', () => {});
roleRouter.patch(':roleId/replaceDigitalIdentity', () => {});

export default roleRouter;
