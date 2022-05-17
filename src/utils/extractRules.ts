import config from "../config";
import { filtersType, transformersType } from "../types";

/**
 * 
 * @param userScopes - user scope titles to extract rule from
 * @param scopes - scopes details 
 * @returns { rolesName[] } after match between scope titles and scope details & delete undoes
 */
export function getUserRulesNames(userScopes: string[], scopes: { [k: string]: { rules: string[], undoes: string[] } }): string[] {
  let rules: string[] = [];
  let undoes: string[] = [];

  userScopes.forEach(scope => {
    rules = [...rules, ...scopes[scope]?.rules || []];
    undoes = [...undoes, ...scopes[scope]?.undoes || []];
  });

  return rules.filter(tran => !undoes.includes(tran));
}

/**
 * 
 * @param userScopes - user scope titles to extract rule from
 * @param type - entity type to now relevant section in scope.json
 * @returns { filters: filtersType[]; transformers: transformersType[]; } - after filtering
 */
export const extractRulesFromScopes = (userScopes: string[], type: string) => {
  const { spike: { rules, scopes, }, } = config;

  let userRulesNames = getUserRulesNames(userScopes, scopes);

  const transformers: transformersType[] = rules.transformers[type].filter((transformer: transformersType) => userRulesNames.includes(transformer.name));
  const filters: filtersType[] = rules.filters[type].filter((filter: filtersType) => userRulesNames.includes(filter.name));

  return { filters, transformers }
}
