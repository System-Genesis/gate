import config from '../config';
import { QueryParams } from '../types';

const {
  rules: {
    filters,
  },
  scopes,
} = config;

const getFilterQueries = (userScopes: string | string[], entityType: string): QueryParams[] => {
  const scopesArr = Array.isArray(userScopes) ? userScopes : [userScopes];
  let rules: string[] = [];
  scopesArr.forEach((scopeName: string) => {
    rules = [ ...rules, ...(scopes[scopeName] || []) ];
  });

  rules = [...new Set(rules)];

  return combineQueriesFromRules(rules, entityType);
};

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
