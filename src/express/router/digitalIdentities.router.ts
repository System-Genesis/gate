import { Router } from 'express';
import config from '../../config';
import wrapController from '../../utils/wrapController';
import Controller from '../controller/controller';
import { setEntityType, setService } from '../middlewares';

const {
  web: {
    services: { read, elastic, write },
  },
} = config;

const digitalIdentitiesRouter: Router = Router();

digitalIdentitiesRouter.use(wrapController(setEntityType('digitalIdentity')));

digitalIdentitiesRouter.get(
  '/search',
  wrapController(setService(elastic)),
  wrapController(Controller.proxyRequest)
);
digitalIdentitiesRouter.get(
  'role/:roleId',
  wrapController(setService(read)),
  wrapController(Controller.proxyRequest)
);
digitalIdentitiesRouter.get(
  '/:id',
  wrapController(setService(read)),
  wrapController(Controller.proxyRequest)
);
digitalIdentitiesRouter.patch(
  '/:id',
  wrapController(setService(write)),
  wrapController(Controller.proxyRequest)
);
digitalIdentitiesRouter.delete(
  '/:id',
  wrapController(setService(write)),
  wrapController(Controller.proxyRequest)
);
digitalIdentitiesRouter.post(
  '/',
  wrapController(setService(write)),
  wrapController(Controller.proxyRequest)
);

export default digitalIdentitiesRouter;
