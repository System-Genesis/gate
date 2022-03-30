const simpleValueCondition = (field: string | number, value: string | number) => field === value;
const hierarchyCondition = (field: string[], value: string) => field.join('/') === value;
const startsWithCondition = (field: string, value: string) => field.startsWith(value);

export { simpleValueCondition, hierarchyCondition, startsWithCondition };
