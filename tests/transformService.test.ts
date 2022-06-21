import { applyTransformers } from '../src/transformService';
import { EntityDTO } from '../src/types';
import { extractRulesFromScopes } from '../src/utils/extractRules';
import Controller from '../src/express/controller/controller';

const Entity: EntityDTO = {
    firstName: 'yuu',
    lastName: 'yoo',
    directGroup: 'asdasdasd',
    identityCard: '11111111',
    entityType: 'agumon',
    jobTitle: 'weatherMan',
    hierarchy: 'root/sensitive2',
    sex: 'male',
    digitalIdentities: [
        {
            uniqueId: 'aaa@yay',
            source: 'dataSource2',
        },
        {
            uniqueId: 'rrr@es',
            source: 'es',
        },
        {
            uniqueId: 'aaa@ser',
            source: 'dataSource2',
        },
        {
            uniqueId: 'aa22a@ser',
            source: 'dataSource1',
        },
    ],
};

describe('test transformer removing needed stuff', () => {
    test('remove sex', async () => {
        const scopes = ['a'];

        const { transformers } = extractRulesFromScopes(scopes, 'entity')
        const moddedEntity = applyTransformers(transformers.entity, Entity);

        expect(moddedEntity).not.toHaveProperty('sex');
    });

    test('undo remove sex', async () => {
        const scopes = ['a', 'undo_a'];

        const { transformers } = extractRulesFromScopes(scopes, 'entity')
        const moddedEntity = applyTransformers(transformers.entity, Entity);

        expect(moddedEntity).toHaveProperty('sex');
    });

    test('undo remove sex, add removeSensitive2Hierarchy', async () => {
        const scopes = ['a', 'undo_a_add_b'];
        const entity = { ...Entity, hierarchy: 'root/sensitive2' }

        const { transformers } = extractRulesFromScopes(scopes, 'entity')
        const moddedEntity = applyTransformers(transformers.entity, entity);

        expect(moddedEntity).toHaveProperty('sex');
        expect(moddedEntity).not.toHaveProperty('hierarchy');
    });

    test('undo not exist rule', async () => {
        const scopes = ['undo_a', 'b'];
        const entity = { ...Entity, hierarchy: 'root/sensitive2' }

        const { transformers } = extractRulesFromScopes(scopes, 'entity')
        const moddedEntity = applyTransformers(transformers.entity, entity);

        expect(moddedEntity).toHaveProperty('sex');
        expect(moddedEntity).not.toHaveProperty('hierarchy');
    });

    test('undo remove sex (two scope want to remove)', async () => {
        const scopes = ['a', 'undo_a', 'a'];

        const { transformers } = extractRulesFromScopes(scopes, 'entity')
        const moddedEntity = applyTransformers(transformers.entity, Entity);

        expect(moddedEntity).toHaveProperty('sex');
    });

    test('remove jobTitle if hierarchy startWith es_name (rule with condition)', async () => {
        const scopes = ['f'];
        const entity = { ...Entity, hierarchy: 'es_name/lol' }

        const { transformers } = extractRulesFromScopes(scopes, 'entity')
        const moddedEntity = applyTransformers(transformers.entity, entity);

        expect(moddedEntity).not.toHaveProperty('jobTitle');
    });

    test('not remove jobTitle if hierarchy not startWith es_name (rule with condition)', async () => {
        const scopes = ['f'];
        const entity = { ...Entity, hierarchy: 'no_es_name/lol' }

        const { transformers } = extractRulesFromScopes(scopes, 'entity')
        const moddedEntity = applyTransformers(transformers.entity, entity);

        expect(moddedEntity).toHaveProperty('jobTitle');
    });

    describe('nester transformers', () => {

        const ent = {
            _id: "62b0538157daa6001237e87a",
            pictures: {
                profile: {
                    meta: {
                        format: "jpg"
                    },
                    url: "http://localhost/1112312/pictures/profile"
                }
            },
            phone: [],
            mobilePhone: [
                "0526639648"
            ],
            firstName: "ss",
            lastName: "s",
            entityType: "agumon",
            EntityalNumber: "1112312",
            akaUnit: "es1",
            clearance: '3',
            fullClearance: "003",
            createdAt: "2022-06-20T11:01:21.466Z",
            updatedAt: "2022-06-20T11:02:52.607Z",
            fullName: "ss s",
            digitalIdentities: [
                {
                    _id: "62b04e0d57daa6001237e853",
                    uniqueId: "xx1@rabiran.com",
                    type: "domainUser",
                    source: "ads_name",
                    isRoleAttachable: true,
                    createdAt: "2022-06-20T11:02:53.314Z",
                    updatedAt: "2022-06-20T11:02:53.314Z",
                    entityId: "62b0538157daa6001237e87a",
                    upn: "xx1",
                    role: null
                },
                {
                    _id: "62b04e0d57daa6001237e853",
                    uniqueId: "xx1@rabiran.com",
                    type: "domainUser",
                    source: "sf_name",
                    isRoleAttachable: true,
                    createdAt: "2022-06-20T11:02:53.314Z",
                    updatedAt: "2022-06-20T11:02:53.314Z",
                    entityId: "62b0538157daa6001237e87a",
                    upn: "xx1",
                    role: null
                }
            ],
            id: "62b0538157daa6001237e87a"
        }

        //TODO: Test of removal of upn from expanded entity
        test('remove upn from expanded entity', async () => {
            const scopes = ['remove_upn_from_di'];


            const { transformers } = extractRulesFromScopes(scopes, 'entity')
            const moddedEntity = Controller.handleResponse({ method: 'get', query: { expanded: 'true' } } as any, 'entity', ent, transformers)

            expect(moddedEntity.digitalIdentities[0].upn).toBeFalsy();
        });

        test('undoes remove upn from expanded entity', async () => {
            const scopes = ['remove_upn_from_di', 'remove_fullClearance_undoes_upn'];

            const { transformers } = extractRulesFromScopes(scopes, 'entity')
            const moddedEntity = Controller.handleResponse({ method: 'get', query: { expanded: 'true' } } as any, 'entity', ent, transformers)

            expect(moddedEntity.digitalIdentities[0].upn).toBeTruthy();
            expect(moddedEntity.fullClearance).toBeFalsy();
            expect(moddedEntity.clearance).toBeTruthy();
        });

        // TODO: test of removal filter dis from expanded entity from certain source (if not exists?)
        test('remove di from expanded entity', async () => {
            const scopes = ['remove_di_sf'];

            const { transformers } = extractRulesFromScopes(scopes, 'entity')
            expect(ent.digitalIdentities.map(di => di.source)).toContain('sf_name');

            const moddedEntity = Controller.handleResponse({ method: 'get', query: { expanded: 'true' } } as any, 'entity', ent, transformers)

            expect(moddedEntity.digitalIdentities.length).toEqual(1);
            expect(moddedEntity.digitalIdentities.map(di => di.source)).not.toContain('sf_name');
        });


    })

});
