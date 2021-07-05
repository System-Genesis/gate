import { Router } from 'express';
// import FeatureController from './controller';
// import FeatureValidator from './validator';
// import { wrapController, wrapValidator } from '../../utils/express';
// import ValidateRequest from '../../utils/joi';
// import { getFoldersRequestSchema, createFolderRequestSchema } from './validator.schema';

const digitalIdentities: Router = Router();

// // DU
// search (uniqueld)
// getByRole (role_amanidentity or role name)
// getById (uniqueld)
// create (createDTO)
// connectToPerson (du_uniqueld, person id)

digitalIdentities.post('/', () => {}); // ?uniqueId
digitalIdentities.post('/search', () => {}); // ?uniqueId
digitalIdentities.get('role/:roleId', () => {});
digitalIdentities.get('/:id', () => {}); // ?uniqueId
digitalIdentities.patch('/:id', () => {}); // ?uniqueId
digitalIdentities.delete('/:id', () => {}); // ?uniqueId

export default digitalIdentities;
