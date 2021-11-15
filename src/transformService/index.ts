import config from '../config';
import { DigitalIdentityDTO, EntityDTO, RoleDTO, typesOfEntities } from '../types';
import { transformerMap } from './transformers';

const applyTransform = (entity: EntityDTO | RoleDTO | DigitalIdentityDTO, userScopes: string[], type: typesOfEntities)  => {
    const {
      spike: {
        rules: { transformers },
        scopes,
      },
    } = config;

    const userTransformersNames = getUserTransformersNames(userScopes, scopes);
    const targetTransformers: any = transformers[type];
    const relevantTransformers = targetTransformers.filter((transformer) => userTransformersNames.includes(transformer.name));

    let entityCopy = { ...entity };
    
    relevantTransformers.forEach((transformer) => {
        entityCopy = transformerMap[transformer.method](entityCopy, transformer, entity);
    });

    return entityCopy;
};

export { applyTransform };
    
function getUserTransformersNames(userScopes: string[], scopes: { [k: string]: string[]; }) : string[] {
    let userTrandormers: string[]  = [];
    userScopes.forEach(scope => {
        userTrandormers = [...userTrandormers, ...scopes[scope] ? scopes[scope] : []].filter(f => f);
    });

    return userTrandormers;
}
