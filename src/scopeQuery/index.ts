import { filtersType, QueryParams, typesOfEntities } from "../types";

/**
 * Create queries via the name of each rule
 * 
 * @param userFilters - filters to apply
 * @param entityType - data type
 * @returns filterQuery ready to send
 */
export const combineQueriesFromRules = (userFilters: filtersType[], entityType: typesOfEntities): QueryParams[] => {
  const combined: QueryParams[] = [];

  userFilters.forEach((filter) => {
    const { name, ...rest } = filter;
    combined.push({ entityType, ...rest })
  });

  return combined;
}

