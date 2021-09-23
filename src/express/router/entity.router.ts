import { Router } from "express";
// import { Router } from 'express';
import Controller from "../controller/controller";
import wrapController from "../../utils/wrapController";
import { setEntityType, setService } from "../middlewares";
import config from "../../config/index";

const {
  web: {
    services: { read, write, elastic },
  },
} = config;

const entityRouter: Router = Router();

entityRouter.use(wrapController(setEntityType("entity")));

entityRouter.get(
  "/search",
  wrapController(setService(elastic)),
  wrapController(Controller.proxyRequest)
);

entityRouter.get(
  "/identifier/:identifier",
  wrapController(setService(read)),
  wrapController(Controller.proxyRequest)
);

entityRouter.get(
  "/role/:roleId",
  wrapController(setService(read)),
  wrapController(Controller.proxyRequest)
);

entityRouter.get(
  "/digitalIdentity/:uniqueID",
  wrapController(setService(read)),
  wrapController(Controller.proxyRequest)
);

entityRouter.get(
  "/group/:groupId",
  wrapController(setService(read)),
  wrapController(Controller.proxyRequest)
);

entityRouter.get(
  "/hierarchy/:hierarchy",
  wrapController(setService(read)),
  wrapController(Controller.proxyRequest)
);

entityRouter.get(
  "/:id",
  wrapController(setService(read)),
  wrapController(Controller.proxyRequest)
);

entityRouter.get(
  "/",
  wrapController(setService(read)),
  wrapController(Controller.proxyRequest)
);

entityRouter.patch(
  "/:id/connectDigitalIdentity",
  wrapController(setService(write)),
  wrapController(Controller.proxyRequest)
);

entityRouter.patch(
  "/:id/disconnectDigitalIdentity",
  wrapController(setService(write)),
  wrapController(Controller.proxyRequest)
);

entityRouter.patch(
  "/:id/deactivate",
  wrapController(setService(write)),
  wrapController(Controller.proxyRequest)
);

entityRouter.patch(
  "/:id",
  wrapController(setService(write)),
  wrapController(Controller.proxyRequest)
);

entityRouter.delete(
  "/:id",
  wrapController(setService(write)),
  wrapController(Controller.proxyRequest)
);

entityRouter.post(
  "/",
  wrapController(setService(write)),
  wrapController(Controller.proxyRequest)
);

export default entityRouter;
