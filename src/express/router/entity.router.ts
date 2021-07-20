import { Router } from 'express';
// import { Router } from 'express';
import Controller from '../controller/controller';
import wrapController from '../../utils/wrapController';
import { setEntityType, setService } from '../middlewares';
import config from '../../config/index';

const {
  web: {
    services: { db, elastic },
  },
} = config;

const entityRouter: Router = Router();

entityRouter.use(wrapController(setEntityType('entity')));

entityRouter.get('/identifier/:identifier', (_req, res) => {
  console.log('g');
  res.send('dodh');
});
entityRouter.get(
  '/search',
  wrapController(setService(elastic)),
  wrapController(Controller.proxyRequest)
);
entityRouter.get(
  '/role/:roleId',
  wrapController(setService(db)),
  wrapController(Controller.proxyRequest)
);
entityRouter.get(
  '/digitalIdentity/:uniqueID',
  wrapController(setService(db)),
  wrapController(Controller.proxyRequest)
);
entityRouter.get(
  '/group/:groupId',
  wrapController(setService(db)),
  wrapController(Controller.proxyRequest)
);
entityRouter.get(
  '/hiearachy/:hierarchy',
  wrapController(setService(db)),
  wrapController(Controller.proxyRequest)
);
entityRouter.get(
  '/:id',
  wrapController(setService(db)),
  wrapController(Controller.proxyRequest)
);
entityRouter.get(
  '/',
  wrapController(setService(db)),
  wrapController(Controller.proxyRequest)
);

entityRouter.patch(
  '/:id/connectDigitalIdentity',
  wrapController(setService(db)),
  wrapController(Controller.proxyRequest)
);
entityRouter.patch(
  '/:id/disconnectDigitalIdentity',
  wrapController(setService(db)),
  wrapController(Controller.proxyRequest)
);
entityRouter.patch(
  '/:id/deactivate',
  wrapController(setService(db)),
  wrapController(Controller.proxyRequest)
);
entityRouter.patch(
  '/:id',
  wrapController(setService(db)),
  wrapController(Controller.proxyRequest)
);
entityRouter.delete(
  '/:id',
  wrapController(setService(db)),
  wrapController(Controller.proxyRequest)
);

entityRouter.post(
  '/',
  wrapController(setService(db)),
  wrapController(Controller.proxyRequest)
);
export default entityRouter;
