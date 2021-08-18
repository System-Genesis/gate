import config from '../config';
import { transformerMap } from './transformers';

type tranformerType = 'entity' | 'group' | 'digitalIdentity' | 'role' | 'organizationGroup';

const applyTransform = (entity: any, scopes: string[], type: tranformerType) => {
    const {
        rules: {
            transformers
        },
    } = config;

    const targetTransformers: any = transformers[type];

    const RelevantTransformers = targetTransformers.filter((transformer) => scopes.includes(transformer.name));

    let entityCopy = Array.isArray(entity) ? [ ...entity ] : { ...entity };
    
    RelevantTransformers.forEach((transformer) => {
        entityCopy = transformerMap[transformer.method](entityCopy, transformer);
    });
    return entityCopy;
};

export { applyTransform };
