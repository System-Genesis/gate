import { simpleValueCondition, hierarchyCondition, startsWithCondition } from '../conditions';

const conditionsMap = {
    simpleValueCondition,
    hierarchyCondition,
    startsWithCondition,
};

const fieldExclude = (entity: any, transformer: any, originalEntity: any) => {
    const { targetField, conditions } = transformer;

    const entityCopy = { ...entity };

    if (!conditions) {
        delete entityCopy[targetField];
        return entityCopy;
    }

    const fieldToCheck = conditions[0].field;
    const targetValue = conditions[0].value;
    const conditionMethod = conditionsMap[conditions[0].method];

    if (!entityCopy[targetField] || !originalEntity[fieldToCheck]) return entityCopy;

    if (conditionMethod(originalEntity[fieldToCheck], targetValue)) delete entityCopy[targetField];
    return entityCopy;
};

const arrayFilter = (entity: any, transformer: any, _originalEntity: any) => {
    const { targetField, conditions } = transformer;

    const fieldToCheck = conditions[0].field;
    const targetValue = conditions[0].value;
    const conditionMethod = conditionsMap[conditions[0].method];

    if (!entity[targetField]) return entity;

    const modifedTargetField = entity[targetField].filter((obj) => !conditionMethod(obj[fieldToCheck], targetValue));

    const entityCopy = { ...entity };
    entityCopy[targetField] = modifedTargetField;
    return entityCopy;
};

const arrayMapper = (entity: any, transformer: any, originalEntity: any) => {
    const { targetField } = transformer;
    const innerTransformer = transformer.transformer;
    const { method } = innerTransformer;
    // const fieldToCheck = conditions.field;
    // const targetValue = conditions.value;
    // const conditionMethod = conditionsMap[conditions.method];

    const innerTransformerMethod = transformerMap[method];

    if (!entity[targetField]) return entity;

    const modifedTargetField = entity[targetField].map((obj) => innerTransformerMethod(obj, innerTransformer, originalEntity));

    const entityCopy = { ...entity };
    entityCopy[targetField] = modifedTargetField;
    return entityCopy;
};

const transformerMap = {
    arrayMapper: arrayMapper,
    arrayFilter: arrayFilter,
    fieldExclude: fieldExclude,
};

export { arrayFilter, fieldExclude, arrayMapper, transformerMap };
