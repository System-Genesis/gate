import { Router } from 'express';
import config from '../../config/index';
import wrapController from '../../utils/wrapController';
import Controller from '../controller/controller';
import { setService, setEntityType } from '../middlewares';

const {
  web: {
    services: { read, write, elastic },
  },
} = config;

const groupRouter: Router = Router();

groupRouter.use(wrapController(setEntityType('group')));

groupRouter.get(
  '/hierarchy/:hierarchy',
  wrapController(setService(read)),
  wrapController(Controller.proxyRequest)
);

groupRouter.patch(
  '/changeParent/:id',
  wrapController(setService(read)),
  wrapController(Controller.proxyRequest)
);

groupRouter.patch(
  '/rename/:id',
  wrapController(setService(read)),
  wrapController(Controller.proxyRequest)
);

groupRouter.get(
  '/search',
  wrapController(setService(elastic)),
  wrapController(Controller.proxyRequest)
);

groupRouter.get(
  '/:id/children',
  wrapController(setService(read)),
  wrapController(Controller.proxyRequest)
);

groupRouter.get(
  '/:id',
  wrapController(setService(read)),
  wrapController(Controller.proxyRequest)
);

groupRouter.delete(
  '/:id',
  wrapController(setService(write)),
  wrapController(Controller.proxyRequest)
);

groupRouter.get(
  '/',
  wrapController(setService(read)),
  wrapController(Controller.proxyRequest)
);

groupRouter.post(
  '/',
  wrapController(setService(write)),
  wrapController(Controller.proxyRequest)
);

export default groupRouter;
