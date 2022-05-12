import config from '../config';
import { DigitalIdentityDTO, EntityDTO, RoleDTO, typesOfEntities } from '../types';
import { transformerMap } from './transformers';

const applyTransform = (entity: EntityDTO | RoleDTO | DigitalIdentityDTO, userScopes: string[], type: typesOfEntities) => {
  const {
    spike: {
      rules: { transformers },
      scopes,
    },
  } = config;

  let [userTransformersNames, undoesTransformersNames] = getUserTransformersNames(userScopes, scopes);

  userTransformersNames = userTransformersNames.filter(tran => !undoesTransformersNames.includes(tran));

  const targetTransformers: any[] = transformers[type];
  const relevantTransformers = targetTransformers.filter((transformer) => userTransformersNames.includes(transformer.name));

  let entityCopy = { ...entity };

  relevantTransformers.map((transformer) => {
    entityCopy = transformerMap[transformer.method](entityCopy, transformer, entity);
  });

  return entityCopy;
};

export { applyTransform };

function getUserTransformersNames(userScopes: string[], scopes: { [k: string]: { rules: string[], undoes: string[] } }): string[][] {
  let userTransformers: string[] = [];
  let undoesTransformers: string[] = [];

  userScopes.forEach(scope => {
    if (scopes[scope]) {
      userTransformers = [...userTransformers, ...scopes[scope].rules ? scopes[scope].rules : []].filter(f => f);
      undoesTransformers = [...undoesTransformers, ...scopes[scope].undoes ? scopes[scope].undoes : []].filter(f => f);
    }
  });

  return [userTransformers, undoesTransformers];
}
