import config from '../config';
import { transformerMap } from './transformers';

type tranformerType = 'entity' | 'group' | 'digitalIdentity' | 'role' | 'organizationGroup';

const applyTransform = (entity: any, userScopes: string[], type: tranformerType) => {
    const {
        rules: {
            transformers
        },
        scopes,
    } = config;

    const userTransformersNames = getUserTransformersNames(userScopes, scopes);

    const targetTransformers: any = transformers[type];

    const RelevantTransformers = targetTransformers.filter((transformer) => userTransformersNames.includes(transformer.name));

    let entityCopy = Array.isArray(entity) ? [ ...entity ] : { ...entity };
    
    RelevantTransformers.forEach((transformer) => {
        entityCopy = transformerMap[transformer.method](entityCopy, transformer);
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
