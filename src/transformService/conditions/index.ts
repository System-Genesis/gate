const simpleValueCondition = (field: any, value: any) => field === value;
const hierarchyCondition = (field: any, value: any) => field.join('/') === value;

export { simpleValueCondition, hierarchyCondition };
