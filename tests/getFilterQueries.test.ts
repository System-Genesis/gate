import { extractRulesFromScopes } from '../src/utils/extractRules';
import { combineQueriesFromRules } from '../src/scopeQuery/index';
import { QueryParams } from '../src/types';


describe('test transformer removing needed stuff', () => {
    test('filter', async () => {
        const scopes = ['f.a'];
        const entityType = 'entity'

        const { filters: userFilters } = extractRulesFromScopes(scopes, entityType)
        const filters: QueryParams[] = combineQueriesFromRules(userFilters, entityType);

        expect(filters).toContainEqual({ "entityType": "entity", "field": "hierarchy", "values": ["root/sensitive", "granpa/son"] });
    });

    test('filter undo', async () => {
        const scopes = ['f.a', 'f.undo_a'];
        const entityType = 'entity'

        const { filters: userFilters } = extractRulesFromScopes(scopes, entityType)
        const filters: QueryParams[] = combineQueriesFromRules(userFilters, entityType);

        expect(filters).not.toContainEqual({ "entityType": "entity", "field": "hierarchy", "values": ["root/sensitive", "granpa/son"] });
        expect(filters).toHaveLength(0)
    });

    test('filter undo', async () => {
        const scopes = ['f.a', 'f.undo_a_add_b'];
        const entityType = 'entity'

        const { filters: userFilters } = extractRulesFromScopes(scopes, entityType)
        const filters: QueryParams[] = combineQueriesFromRules(userFilters, entityType);

        expect(filters).not.toContainEqual({ "entityType": "entity", "field": "hierarchy", "values": ["root/sensitive", "granpa/son"] });
        expect(filters).toContainEqual({ "entityType": "entity", "field": "source", "values": ["city_name"] });
    });

    test('filter undo', async () => {
        const scopes = ['f.undo_a', 'f.b'];
        const entityType = 'entity'

        const { filters: userFilters } = extractRulesFromScopes(scopes, entityType)
        const filters: QueryParams[] = combineQueriesFromRules(userFilters, entityType);

        expect(filters).not.toContainEqual({ "entityType": "entity", "field": "hierarchy", "values": ["root/sensitive", "granpa/son"] });
        expect(filters).toContainEqual({ "entityType": "entity", "field": "source", "values": ["city_name"] });
        expect(filters).toHaveLength(1)
    });

    test('filter undo', async () => {
        const scopes = ['f.a', 'f.undo_a', 'f.a'];
        const entityType = 'entity'

        const { filters: userFilters } = extractRulesFromScopes(scopes, entityType)
        const filters: QueryParams[] = combineQueriesFromRules(userFilters, entityType);

        expect(filters).not.toContainEqual({ "entityType": "entity", "field": "hierarchy", "values": ["root/sensitive", "granpa/son"] });
        expect(filters).toHaveLength(0)
    });
});