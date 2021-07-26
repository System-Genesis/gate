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

const roleRouter: Router = Router(); 

roleRouter.use(wrapController(setEntityType('role')));

roleRouter.post('/', () => {});
// roleRouter.get('/digitalIdentity/:digitalIdentityUniqueId', () => {});
roleRouter.get(
  '/:id',
  wrapController(setService(db)),
  wrapController(Controller.proxyRequest)
);
roleRouter.delete(
  '/:id',
  wrapController(setService(db)),
  wrapController(Controller.proxyRequest)
);
roleRouter.patch(
  '/:id',
  wrapController(setService(db)),
  wrapController(Controller.proxyRequest)
);
roleRouter.get(
  '/group/:groupId',
  wrapController(setService(db)),
  wrapController(Controller.proxyRequest)
);
roleRouter.get(
  '/hierarchy/:hierarchy',
  wrapController(setService(db)),
  wrapController(Controller.proxyRequest)
);
roleRouter.get(
  '/search',
  wrapController(setService(elastic)),
  wrapController(Controller.proxyRequest)
);
roleRouter.patch(
  '/:roleId/moveToGroup',
  wrapController(setService(db)),
  wrapController(Controller.proxyRequest)
);
roleRouter.patch(
  '/:roleId/connectDigitalIdentity',
  wrapController(setService(db)),
  wrapController(Controller.proxyRequest)
);
roleRouter.patch(
  ':roleId/disconnectDigitalIdentity',
  wrapController(setService(db)),
  wrapController(Controller.proxyRequest)
);
roleRouter.patch(
  ':roleId/replaceDigitalIdentity',
  wrapController(setService(db)),
  wrapController(Controller.proxyRequest)
);

export default roleRouter;
