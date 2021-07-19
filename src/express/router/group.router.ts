import { NextFunction, Request, Response, Router } from 'express';
import config from '../../config/index';
import wrapController from '../../utils/wrapController';
import Controller from '../controller/controller';
import setService from '../middlewares/setService';

const {
  web: {
    services: { db, elastic },
  },
} = config;

const groupRouter: Router = Router();

groupRouter.use((_req: Request, res: Response, next: NextFunction) => {
  res.locals.entityType = 'group';
  next();
});

groupRouter.get(
  'hierarchy/:hierarchy',
  wrapController(setService(db)),
  wrapController(Controller.proxyRequest)
);
groupRouter.patch(
  'changeParent/:id',
  wrapController(setService(db)),
  wrapController(Controller.proxyRequest)
);
groupRouter.patch(
  'rename/:id',
  wrapController(setService(db)),
  wrapController(Controller.proxyRequest)
);
groupRouter.get(
    'search',
    wrapController(setService(elastic)),
    wrapController(Controller.proxyRequest)
  );
groupRouter.get(
  '/:id/children',
  wrapController(setService(db)),
  wrapController(Controller.proxyRequest)
);
groupRouter.get(
  '/:id',
  wrapController(setService(db)),
  wrapController(Controller.proxyRequest)
);
groupRouter.delete(
  '/:id',
  wrapController(setService(db)),
  wrapController(Controller.proxyRequest)
);
groupRouter.get(
  '/',
  wrapController(setService(db)),
  wrapController(Controller.proxyRequest)
);
groupRouter.post(
  '/',
  wrapController(setService(db)),
  wrapController(Controller.proxyRequest)
);

export default groupRouter;
