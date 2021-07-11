import config from '../config';

type QueryRule = {
  name: string,
  field: string,
  values: string | string[]
}

const {
  rules: {
    filters,
  },
  scopes,
} = config;

const getFilterQueries = (userScopes: string | string[], entityType: string): (Omit<QueryRule, 'name'> & { entityType: string })[] => {
  const scopesArr = Array.isArray(userScopes) ? userScopes : [userScopes];
  let rules: string[] = [];
  scopesArr.forEach((scopeName: string) => {
    rules = [...rules, ...scopes[scopeName]];
  });

  rules = [...new Set(rules)];

  return combineQueriesFromRules(rules, entityType);
};

const combineQueriesFromRules = (rules: string[], entityType: string): (Omit<QueryRule, 'name'> & { entityType: string })[] => {
  const combined: (Omit<QueryRule, 'name'> & { entityType: string })[] = [];
  rules.forEach((ruleName) => {
    const role = (filters[entityType] as QueryRule[]).find(rule => rule.name === ruleName);
    if (!!role) {
      const { name, ...rest } = role;
      combined.push({ entityType, ...rest })
    }
  });

  return combined;
}

export default getFilterQueries;
