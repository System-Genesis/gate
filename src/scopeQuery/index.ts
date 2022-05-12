import config from '../config';
import { QueryParams } from '../types';

const {
  spike: {
    rules: {
      filters,
    },
    scopes,
  }
} = config;

/**
 * Create 'filter queries' for 'read' and 'search' services to filter data accord,
 * rules configure in scopes.json
 * 
 * @param userScopes - user scopes
 * @param entityType - data type to filter
 * @returns 
 */
const getFilterQueries = (userScopes: string | string[], entityType: string): QueryParams[] => {
  const scopesArr = Array.isArray(userScopes) ? userScopes : [userScopes];
  let rules: string[] = [];
  let undoesTransformers: string[] = [];

  scopesArr.forEach((scopeName: string) => {
    rules = [...rules, ...(scopes[scopeName].rules || [])];
    undoesTransformers = [...undoesTransformers, ...scopes[scopeName].undoes ? scopes[scopeName].undoes : []].filter(f => f);
  });

  rules = [...new Set(rules)];

  rules = rules.filter(rule => !undoesTransformers.includes(rule))

  return combineQueriesFromRules(rules, entityType);
};

/**
 * Create queries via the name of each rule
 * 
 * @param rules - rules name to aplly (rules comes from scopes.json)
 * @param entityType - data type
 * @returns 
 */
const combineQueriesFromRules = (rules: string[], entityType: string): QueryParams[] => {
  const combined: QueryParams[] = [];
  rules.forEach((ruleName) => {
    const rule = filters[entityType].find(rule => rule.name === ruleName);
    if (!!rule) {
      const { name, ...rest } = rule;
      combined.push({ entityType, ...rest })
    }
  });

  return combined;
}

export default getFilterQueries;
