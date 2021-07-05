import { Router } from 'express';
import Controller from '../controller/controller';
import wrapController from '../../utils/wrapController';

const entityRouter: Router = Router();

entityRouter.get('/role/:roleId', () => {});
entityRouter.get('/digitalIdentity/:uniqueID', () => {});
entityRouter.get('/:id', () => {});
entityRouter.patch('/:id', () => {});
entityRouter.delete('/:id', () => {});
entityRouter.patch('/:id/deactivate', () => {});
entityRouter.patch('/entities/:id/connectDigitalIdentity', () => {});
entityRouter.patch('/entities/:id/disconnectDigitalIdentity', () => {});
entityRouter.get('identifier/:identifier', () => {});
entityRouter.get('/', ()=> {});
entityRouter.post('/', wrapController(Controller.something));
entityRouter.get('/search', () => {});
entityRouter.get('/group/:groupId', () => {});
entityRouter.get('/hiearachy/:hierarchy', () => {});

export default entityRouter;
