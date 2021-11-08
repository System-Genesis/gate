const simpleValueCondition = (field: any, value: any) => field === value;
const hierarchyCondition = (field: any, value: any) => field.join('/') === value;
const startsWithCondition = (field: string, value: string) => 
    field.startsWith(value);

export { simpleValueCondition, hierarchyCondition, startsWithCondition };
