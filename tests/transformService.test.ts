import { applyTransform } from '../src/transformService';

const person = {
    firstName: 'yuu',
    lastName: 'yoo',
    directGroup: 'asdasdasd',
    identityCard: '11111111',
    entityType: 'agumon',
    job: 'weatherMan',
    hierarchy: ['root', 'sensitive2'],
    domainUsers: [
        {
            uniqueID: 'aaa@yay',
            adfsUID: 'aaa@yay.com',
            hierarchy: ['lol', 'sensitive2'],
            dataSource: 'dataSource2',
        },
        {
            uniqueID: 'rrr@es',
            adfsUID: 'rrr@es.com',
            hierarchy: ['lol', 'sensitive2'],
            dataSource: 'es',
        },
        {
            uniqueID: 'aaa@ser',
            adfsUID: 'aaa@ser.com',
            hierarchy: ['lol', 'sensitive2'],
            dataSource: 'dataSource2',
        },
        {
            uniqueID: 'aa22a@ser',
            adfsUID: 'aaa22@s22er.com',
            hierarchy: ['asdsad', 'asdasd'],
            dataSource: 'dataSource1',
        },
    ],
};

const person2 = {
    firstName: 'yuu',
    lastName: 'yoo',
    directGroup: 'asdasdasd',
    identityCard: '11111111',
    entityType: 'agumon',
    job: 'weatherMan',
    hierarchy: ['good', 'notsensitive'],
    domainUsers: [
        {
            uniqueID: 'aaa@yay',
            adfsUID: 'aaa@yay.com',
            hierarchy: ['lol', 'notsensitive2'],
            dataSource: 'dataSource23',
        },
        {
            uniqueID: 'rrr@es',
            adfsUID: 'rrr@es.com',
            hierarchy: ['lol', 'notsensitive2'],
            dataSource: 'es',
        },
        {
            uniqueID: 'aaa@ser',
            adfsUID: 'aaa@ser.com',
            hierarchy: ['lol', 'notsensitive2'],
            dataSource: 'dataSource23',
        },
        {
            uniqueID: 'aa22a@ser',
            adfsUID: 'aaa22@s22er.com',
            hierarchy: ['asdsad', 'asdasd'],
            dataSource: 'dataSource5',
        },
    ],
};

describe('test transformer removing needed stuff', () => {
    test('remove job', async () => {
        const scopes = ['removeJob'];
        const moddedPerson = applyTransform(person, scopes, 'entity');
        expect(moddedPerson).not.toHaveProperty('job');
    });

    test('remove sensitive hierarchy', async () => {
        const scopes = ['removeSensitive2Hierarchy'];
        const moddedPerson = applyTransform(person, scopes, 'entity');
        expect(moddedPerson).not.toHaveProperty('hierarchy');
    });

    test('remove sensitive hierarchy from domainUsers', async () => {
        const scopes = ['removeSensitive2DomainUsersHierarchy'];
        const moddedPerson = applyTransform(person, scopes, 'entity');
        expect(moddedPerson.domainUsers[0]).not.toHaveProperty('hierarchy');
        expect(moddedPerson.domainUsers[2]).not.toHaveProperty('hierarchy');
        expect(moddedPerson.domainUsers).toHaveLength(4);
    });

    test('remove sensitive domainUsers', async () => {
        const scopes = ['removeSensitiveDomainUsers'];
        const moddedPerson = applyTransform(person, scopes, 'entity');
        expect(moddedPerson.domainUsers).toHaveLength(3);
    });

    test('remove sensitive directGroup', async () => {
        const scopes = ['removeSensitive2DirectGroup'];
        const moddedPerson = applyTransform(person, scopes, 'entity');
        expect(moddedPerson).not.toHaveProperty('directGroup');
    });

    test('remove multiple things', async () => {
        const scopes = ['removeSensitive2DomainUsersHierarchy', 'removeSensitive2Hierarchy', 'removeJob', 'removeSensitiveDomainUsers'];
        const moddedPerson = applyTransform(person, scopes, 'entity');
        expect(moddedPerson.domainUsers[0]).not.toHaveProperty('hierarchy');
        expect(moddedPerson.domainUsers[2]).not.toHaveProperty('hierarchy');
        expect(moddedPerson).not.toHaveProperty('hierarchy');
        expect(moddedPerson).not.toHaveProperty('job');
        expect(moddedPerson.domainUsers).toHaveLength(3);
    });
});

describe('test transformer not removing if condition didnt happen', () => {
    test('remove sensitive hierarchy', async () => {
        const scopes = ['removeSensitive2Hierarchy'];
        const moddedPerson = applyTransform(person2, scopes, 'entity');
        expect(moddedPerson).toHaveProperty('hierarchy');
    });

    test('remove sensitive domainUsers', async () => {
        const scopes = ['removeSensitiveDomainUsers'];
        const moddedPerson = applyTransform(person2, scopes, 'entity');
        expect(moddedPerson.domainUsers).toHaveLength(4);
    });

    test('remove sensitive hierarchy from domainUsers', async () => {
        const scopes = ['removeSensitive2DomainUsersHierarchy'];
        const moddedPerson = applyTransform(person2, scopes, 'entity');
        expect(moddedPerson.domainUsers[0]).toHaveProperty('hierarchy');
        expect(moddedPerson.domainUsers[2]).toHaveProperty('hierarchy');
    });
});