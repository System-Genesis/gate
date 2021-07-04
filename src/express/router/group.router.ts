import { Router } from 'express';
// import FeatureController from './controller';
// import FeatureValidator from './validator';
// import { wrapController, wrapValidator } from '../../utils/express';
// import ValidateRequest from '../../utils/joi';
// import { getFoldersRequestSchema, createFolderRequestSchema } from './validator.schema';

const groupRouter: Router = Router();

// // OG
// getByRole (role_name or role_amanldentity)
// getByhierarchy (hierarchy)
// getByid (id)
// getByAkaUnit(akaUnit)
// getSubtree (root_id, depth?)
// create (createDTO)
// changeParent (group_id, parent_id)
// createHierarchy (hierarchy string)
// renameGroup(group_id, newName)

groupRouter.get('/', () => {});
groupRouter.post('/', () => {});
groupRouter.get('hierarchy/:hierarchy', () => {});
groupRouter.get('/:id', () => {});
groupRouter.delete('/:id', () => {});
groupRouter.get('/:id/children', () => {});
groupRouter.patch('changeParent/:id', () => {});
groupRouter.patch('rename/:id', () => {});

export default groupRouter;
