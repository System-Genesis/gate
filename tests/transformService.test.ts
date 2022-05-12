import { applyTransform } from '../src/transformService';
import { EntityDTO } from '../src/types';

const person: EntityDTO = {
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

        const moddedPerson = applyTransform(person, scopes, 'entity');

        expect(moddedPerson).not.toHaveProperty('sex');
    });

    test('undo remove sex', async () => {
        const scopes = ['a', 'undo_a'];

        const moddedPerson = applyTransform(person, scopes, 'entity');

        expect(moddedPerson).toHaveProperty('sex');
    });

    test('undo remove sex, add removeSensitive2Hierarchy', async () => {
        const scopes = ['a', 'undo_a_add_b'];
        const entity = { ...person, hierarchy: 'root/sensitive2' }

        const moddedPerson = applyTransform(entity, scopes, 'entity');

        expect(moddedPerson).toHaveProperty('sex');
        expect(moddedPerson).not.toHaveProperty('hierarchy');
    });

    test('undo not exist rule', async () => {
        const scopes = ['undo_a', 'b'];
        const entity = { ...person, hierarchy: 'root/sensitive2' }

        const moddedPerson = applyTransform(entity, scopes, 'entity');

        expect(moddedPerson).toHaveProperty('sex');
        expect(moddedPerson).not.toHaveProperty('hierarchy');
    });

    test('undo remove sex (two scope want to remove)', async () => {
        const scopes = ['a', 'undo_a', 'a'];

        const moddedPerson = applyTransform(person, scopes, 'entity');

        expect(moddedPerson).toHaveProperty('sex');
    });

    test('remove jobTitle if hierarchy startWith es_name (rule with condition)', async () => {
        const scopes = ['f'];
        const entity = { ...person, hierarchy: 'es_name/lol' }

        const moddedPerson = applyTransform(entity, scopes, 'entity');

        expect(moddedPerson).not.toHaveProperty('jobTitle');
    });

    test('not remove jobTitle if hierarchy not startWith es_name (rule with condition)', async () => {
        const scopes = ['f'];
        const entity = { ...person, hierarchy: 'no_es_name/lol' }

        const moddedPerson = applyTransform(entity, scopes, 'entity');

        expect(moddedPerson).toHaveProperty('jobTitle');
    });

});
