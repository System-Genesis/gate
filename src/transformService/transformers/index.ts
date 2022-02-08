import { simpleValueCondition, hierarchyCondition, startsWithCondition } from '../conditions';

const conditionsMap = {
    simpleValueCondition,
    hierarchyCondition,
    startsWithCondition,
};

/**
 * Exclude one field from data according to the transformer,
 * transformer contain the the method of the transformation (exclude, filter, map),
 * and the conditions of the transformation as well the target field to exclude
 * 
 * @param entity - data obj to manipulate
 * @param transformer - contains which field to exclude and the cond of when to
 * @param originalEntity - data obj without any manipulation
 * @returns the transformed data obj
 * @example
 * 
 * fieldExclude(
 *  { rank: 'champion', mail: 'aviv_c@champion', clearance: 100 }, // data
 *  { targetField: 'clearance', conditions: [{ method: 'simpleValueCondition', field: 'rank', value: 'champion' }] }, // transformer
 *  { rank: 'champion', mail: 'aviv_c@champion', clearance: 100 },
 * )  // => { rank: 'champion', mail: 'aviv_c@champion' }
 * 
 * fieldExclude(
 *  { rank: 'champion', mail: 'aviv_c@champion' }, // data
 *  { targetField: 'mail', conditions: [{ method: 'simpleValueCondition', field: 'rank', value: 'champion' }] }, // transformer
 *  { rank: 'champion', mail: 'aviv_c@champion', clearance: 100 }, // original - may contain fields that already excluded 
 * )  // => { rank: 'champion' }
 * 
 * 
 */
const fieldExclude = (entity: any, transformer: any, originalEntity: any): any => {
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

/**
 * Filter one element obj from an array in data according to the transformer,
 * transformer contain the the method of the transformation (exclude, filter, map),
 * and the conditions of the transformation as well the target array to filter
 * 
 * @param entity - data obj to manipulate
 * @param transformer - contains which field to exclude and the cond of when to
 * @param originalEntity - data obj without any manipulation
 * @returns the transformed data obj
 * @example
 * 
 * arrayFilter(
 *  { rank: 'champion', digitalIdentities: [ { uniqueId: 'x144@bezeq', source: 'partner' } ] }, // data
 *  { targetField: 'digitalIdentities', conditions: [{ method: 'simpleValueCondition', field: 'source', value: 'partner' }] }, // transformer
 *  { rank: 'champion', digitalIdentities: [ { uniqueId: 'x144@bezeq', source: 'partner' } ] }, // original data
 * ); // => { rank: 'champion', digitalIdentities: [] }
 * 
 */
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

/**
 * Map one element inside an array in data,
 * the kind of manipulation is descrribe inside the transformer,
 * the transformer contains:
 * - target field -> the array to manipulate
 * - hybridTransformer -> contain another transform method (like fieldExclude) which
 *   determine the kind of the manipulation (for example map(() => filedExclude()))
 * 
 * @param entity - data obj to manipulate
 * @param hybridTransformer - what manipulation to perform
 * @param originalEntity - data obj without any manipulation
 * @returns the transformed data obj
 * @example
 * 
 * arrayMapper(
 *   { rank: 'champion', digitalIdentities: [ { uniqueId: 'x144@bezeq', source: 'partner', mail: 'aviv@manager' } ] }, // data
 *   {
 *       targetField: 'digitalIdentities',
 *       transformer: {
 *           method: 'fieldExclude',
 *           targetField: 'mail',
 *           conditions: [{ method: 'simpleValueCondition', field: 'rank', value: 'champion' }]
 *       }
 *   }, // transformer
 *   { rank: 'champion', digitalIdentities: [ { uniqueId: 'x144@bezeq', source: 'partner', mail: 'aviv@manager' } ] }, // original data
 *  ); // => { rank: 'champion', digitalIdentities: [ { uniqueId: 'x144@bezeq', source: 'partner' } ] }
 * 
 */
const arrayMapper = (entity: any, hybridTransformer: any, originalEntity: any) => {
    const { targetField } = hybridTransformer;
    const innerTransformer = hybridTransformer.transformer;
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
