import { applyTransform } from '../src/transformService';
import { EntityDTO } from '../src/types';

const person = {
    id: "d290f1ee-6c54-4b01-90e6-d701748f0851",
    displayName: "root/father/child - John Doe",
    directGroup: "d290f1ee-6c54-4b01-90e6-d701748f0851",
    hierarchy: "root/father/child",
    entityType: "agumon",
    identityCard: "234567891",
    personalNumber: "3456712",
    serviceType: "Elder",
    firstName: "John",
    status: "active",
    goalUserId: "spr_davidh@oneAman",
    lastName: "Doe",
    fullName: "John Doe",
    akaUnit: "Lions",
    dischargeDay: "2016-08-29T0:1:33.001Z",
    rank: "matador",
    mail: "you@your-company.com",
    jobTitle: "clown",
    phone: [
        "09-0000000",
        "012222222"
    ],
    mobilePhone: [
        "051-0000000",
    ],
    address: "962 Darion Streets, Irving",
    clearance: "6",
    pictures: {
        profile: {
            path: "http://devante.net",
            meta: {
                createdAt: "2022-02-23T0:4:59.251Z",
                updatedAt: "2022-02-23T0:4:59.251Z"
            }
        }
    },
    sex: "male",
    birthDate: "2016-08-29T0:1:33.001Z",
    createdAt: "2016-08-29T0:1:33.001Z",
    updatedAt: "2016-08-29T0:1:33.001Z",
    digitalIdentities: [
        {
            type: "tamar",
            source: "es",
            mail: "you@your-company.com",
            uniqueId: "uniqueId@domain",
            createdAt: "2022-02-23T0:4:59.251Z",
            updatedAt: "2022-02-23T0:4:59.251Z",
            entityId: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
            isRoleAttachable: true,
            role: {
                roleId: "name@domain",
                jobTitle: "super clown",
                digitalIdentityUniqueId: "you@your-company.com",
                directGroup: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
                hierarchy: "root/father/child",
                hierarchyIds: [
                    "3fa85f64-5717-4562-b3fc-2c963f66afa6"
                ],
                source: "ads",
                clearence: "red",
                createdAt: "2022-02-23T0:4:59.251Z",
                updatedAt: "2022-02-23T0:4:59.251Z"
            }
        }
    ]
}

const person2 = {
    id: "d290f1ee-6c54-4b01-90e6-d701748f0851",
    displayName: "root/father/child - John Doe",
    directGroup: "d290f1ee-6c54-4b01-90e6-d701748f0851",
    hierarchy: "root/father/child",
    entityType: "agumon",
    identityCard: "234567891",
    personalNumber: "3456712",
    serviceType: "Elder",
    firstName: "John",
    status: "active",
    goalUserId: "spr_davidh@oneAman",
    lastName: "Doe",
    fullName: "John Doe",
    akaUnit: "Lions",
    dischargeDay: "2016-08-29T0:1:33.001Z",
    rank: "matador",
    mail: "you@your-company.com",
    jobTitle: "clown",
    phone: [
        "09-0000000",
        "012222222"
    ],
    mobilePhone: [
        '051-0000000',
        '592222222'
    ],
    address: "962 Darion Streets, Irving",
    clearance: "6",
    pictures: {
        profile: {
            path: "http://devante.net",
            meta: {
                createdAt: "2022-02-23T0:4:59.246Z",
                updatedAt: "2022-02-23T0:4:59.246Z"
            }
        }
    },
    sex: "male",
    birthDate: "2016-08-29T0:1:33.001Z",
    createdAt: "2016-08-29T0:1:33.001Z",
    updatedAt: "2016-08-29T0:1:33.001Z"
}

describe('test transformer removing needed stuff', () => {
    describe('fieldEclude', () => {
        test('remove job', async () => {
            const scopes = ['externalScope'];
            const moddedPerson = applyTransform(person, scopes, 'entity');
            expect(moddedPerson).not.toHaveProperty('jobTitle');
        });
    
        test('remove sensitive hierarchy', async () => {
            const scopes = ['externalScope'];
            const moddedPerson = applyTransform(person2, scopes, 'entity');
    
            expect(moddedPerson).not.toHaveProperty('hierarchy');
        });
    
        test('remove digitalIdentities', async () => {
            const scopes = ['externalScope'];
            const moddedPerson = applyTransform(person, scopes, 'entity');
            expect(moddedPerson).not.toHaveProperty('digitalIdentities');
        });
    
        test('remove digitalIdentities', async () => {
            const scopes = ['externalScope'];
            const moddedPerson = applyTransform(person, scopes, 'entity');
            expect(moddedPerson).not.toHaveProperty('digitalIdentities');
        });
    });

    describe('arrayMapper', () => {
        test('remove mail from digitalIdentities', async () => {
            const scopes = ['myScope'];
            const moddedPerson = applyTransform(person, scopes, 'entity');
            // expect(moddedPerson).toHaveProperty('digitalIdentities');
            expect((moddedPerson as EntityDTO).digitalIdentities![0]).toHaveProperty('mail');
        });
    });

    describe('arrayFilter', () => {
        test('remove digitalIdentities element', async () => {
            const scopes = ['someScope'];
            const moddedPerson = applyTransform(person, scopes, 'entity');
            expect((moddedPerson as EntityDTO).digitalIdentities!).toStrictEqual([]);
        });
    });

});

describe('test transformer not removing if condition didnt happen', () => {
    test('not remove sensitive hierarchy', async () => {
        const scopes = ['myScope'];
        const { hierarchy, ...personWithoutHirarchy } = person;
        const moddedPerson = applyTransform(personWithoutHirarchy, scopes, 'entity');
        expect(moddedPerson).toHaveProperty('firstName');
    });
});

describe('test transformer removing without condition', () => {
    test('remove digitalIdentities element', async () => {
        const scopes = ['someOtherScope'];
        const moddedPerson = applyTransform(person, scopes, 'entity');
        expect(moddedPerson).not.toHaveProperty('directGroup');
    });
});

describe('test user without scopes', () => {
    test('if nothing changed', async () => {
        const scopes = [];
        const moddedPerson = applyTransform(person, scopes, 'entity');
        expect(moddedPerson).toStrictEqual(person);
    });
});
