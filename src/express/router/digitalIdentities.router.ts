import { NextFunction, Request, Response, Router } from 'express';
import config from '../../config';
import wrapController from '../../utils/wrapController';
import Controller from '../controller/controller';
import setService from '../middlewares/setService';

const {
  web: {
    services: { db, elastic },
  },
} = config;

const digitalIdentitiesRouter: Router = Router();

digitalIdentitiesRouter.use(
  (_req: Request, res: Response, next: NextFunction) => {
    res.locals.entityType = 'digitalIdentity';
    next();
  }
);

digitalIdentitiesRouter.post(
  '/search',
  wrapController(setService(elastic)),
  wrapController(Controller.proxyRequest)
);
digitalIdentitiesRouter.get(
  'role/:roleId',
  wrapController(setService(db)),
  wrapController(Controller.proxyRequest)
);
digitalIdentitiesRouter.get(
  '/:id',
  wrapController(setService(db)),
  wrapController(Controller.proxyRequest)
);
digitalIdentitiesRouter.patch(
  '/:id',
  wrapController(setService(db)),
  wrapController(Controller.proxyRequest)
);
digitalIdentitiesRouter.delete(
  '/:id',
  wrapController(setService(db)),
  wrapController(Controller.proxyRequest)
);
digitalIdentitiesRouter.post(
  '/',
  wrapController(setService(db)),
  wrapController(Controller.proxyRequest)
);

export default digitalIdentitiesRouter;
