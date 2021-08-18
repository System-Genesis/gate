import { Router } from 'express';
import config from '../../config';
import wrapController from '../../utils/wrapController';
import Controller from '../controller/controller';
import { setEntityType, setService } from '../middlewares';

// TODO: add service write
const {
  web: {
    services: { read, write, elastic },
  },
} = config;

const roleRouter: Router = Router();

roleRouter.use(wrapController(setEntityType('role')));

roleRouter.get(
  '/digitalIdentityUniqueId/:digitalIdentityUniqueId',
  wrapController(setService(read)),
  wrapController(Controller.proxyRequest)
);

roleRouter.get(
  '/group/:groupId',
  wrapController(setService(read)),
  wrapController(Controller.proxyRequest)
);

roleRouter.get(
  '/hierarchy/:hierarchy',
  wrapController(setService(read)),
  wrapController(Controller.proxyRequest)
);

roleRouter.get(
  '/search',
  wrapController(setService(elastic)),
  wrapController(Controller.proxyRequest)
);
roleRouter.patch(
  '/:roleId/moveToGroup',
  wrapController(setService(write)),
  wrapController(Controller.proxyRequest)
);
roleRouter.patch(
  '/:roleId/connectDigitalIdentity',
  wrapController(setService(write)),
  wrapController(Controller.proxyRequest)
);
roleRouter.patch(
  ':roleId/disconnectDigitalIdentity',
  wrapController(setService(write)),
  wrapController(Controller.proxyRequest)
);
roleRouter.patch(
  ':roleId/replaceDigitalIdentity',
  wrapController(setService(write)),
  wrapController(Controller.proxyRequest)
);

roleRouter.get(
  '/:id',
  wrapController(setService(read)),
  wrapController(Controller.proxyRequest)
);

roleRouter.delete(
  '/:id',
  wrapController(setService(write)),
  wrapController(Controller.proxyRequest)
);

roleRouter.patch(
  '/:id',
  wrapController(setService(write)),
  wrapController(Controller.proxyRequest)
);

roleRouter.post(
  '/',
  wrapController(setService(write)),
  wrapController(Controller.proxyRequest)
);

export default roleRouter;
