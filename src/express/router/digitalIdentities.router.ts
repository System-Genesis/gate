import { Router } from 'express';
import config from '../../config';
import wrapController from '../../utils/wrapController';
import Controller from '../controller/controller';
import { setEntityType, setService } from '../middlewares';

const {
  web: {
    services: { db, elastic },
  },
} = config;

const digitalIdentitiesRouter: Router = Router();

digitalIdentitiesRouter.use(wrapController(setEntityType('digitalIdentity')));

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
