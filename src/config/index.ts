import * as env from 'env-var';
import './dotenv';

const DATA_SOURCE = [
  'dataSource1',
  'dataSource2',
  'aka',
  'es_name',
  'ads_name',
  'adNN_name',
  'nvSQL_name',
  'lmn_name',
  'mdn_name',
  'mm_name',
  'city_name',
];

// const sensitiveDataSource = DATA_SOURCE[0];
// const sensitive2DataSource = DATA_SOURCE[1];

const sensitive2HierarchyCondition = {
  method: 'hierarchyCondition',
  field: 'hierarchy',
  value: `root/sensitive2`,
};

const config = {
  web: {
    port: env.get('PORT').required().asPortNumber(),
    isAuth: env.get('IS_AUTH').required().asBool(),
    requiredScopes: ['write', 'read'],
    services: {
      elastic: env.get('ELASTIC_SERVICE').required().asString(),
      read: env.get('READ_SERVICE').required().asString(),
      write: env.get('WRITE_SERVICE').required().asString(),
    },
  },
  entitiesType: {
    role: 'role',
    entity: 'entity',
    digitalIdentity: 'digitalIdentity',
  },
  rules: {
    filters: {
      entity: [
        {
          name: 'hideSensitivePersons',
          field: 'hierarchy',
          values: [`root/sensitive`, `granpa/son`],
        },
        {
          name: 'sourceFilter',
          field: 'source',
          values: [`city_name`],
        },
      ],
      group: [
        {
          name: 'hideSensitivePersons',
          field: 'source',
          values: [`root/sensitive`, `granpa/son`],
        },
      ],
      digitalIdentity: [],
      role: [],
      organizationGroup: [],
    },
    transformers: {
      entity: [
        {
          name: 'removeSensitiveDIs',
          method: 'arrayFilter',
          targetField: 'digitalIdentities',
          conditions: [
            {
              method: 'simpleValueCondition',
              field: 'source',
              value: `sf_name`,
            },
          ],
        },
        {
          name: 'removeHierarchy',
          method: 'fieldExclude',
          targetField: 'hierarchy',
          conditions: [
            {
              method: 'simpleValueCondition',
              field: 'firstName',
              value: `Myrony`,
            },
          ],
        },
        {
          name: 'removeSensitive443DomainUsersHierarchy',
          method: 'arrayMapper',
          targetField: 'digitalIdentities',
          transformer: {
            method: 'fieldExclude',
            targetField: 'hierarchy',
            conditions: [
              {
                method: 'simpleValueCondition',
                field: 'source',
                value: `sf_name`,
              },
            ],
          },
        },
        {
          name: 'removeSensitive2Hierarchy',
          method: 'fieldExclude',
          targetField: 'hierarchy',
          conditions: [sensitive2HierarchyCondition],
        },
        {
          name: 'removeSensitive2DirectGroup',
          method: 'fieldExclude',
          targetField: 'directGroup',
          conditions: [sensitive2HierarchyCondition],
        },
        {
          name: 'removeSex',
          method: 'fieldExclude',
          targetField: 'sex',
          conditions: [
            {
              method: 'startsWithCondition',
              field: 'hierarchy',
              value: 'es_name',
            },
          ],
        },
      ],
      group: [],
      digitalIdentity: [
        {
          name: 'removeSensitive2DomainUsersHierarchy',
          method: 'arrayMapper',
          targetField: 'role',
          transformer: {
            method: 'fieldExclude',
            targetField: 'hierarchy',
            conditions: [
              {
                method: 'simpleValueCondition',
                field: 'source',
                value: `sf_name`,
              },
            ],
          },
        },
        {
          name: 'removeEntityId',
          method: 'fieldExclude',
          targetField: 'entityId',
          conditions: [
            {
              method: 'simpleValueCondition',
              field: 'source',
              value: 'city_name',
            },
          ],
        },
      ],
      role: [
        {
          name: 'jobTitle',
          method: 'fieldExclude',
          targetField: 'jobTitle',
          conditions: [
            {
              method: 'startsWithCondition',
              field: 'hierarchy',
              value: 'wallmart',
            },
          ],
        },
      ],
      organizationGroup: [],
    },
  },
  scopes: {
    externalScope: ['removeSensitive2DomainUsersHierarchy'],
    // ['removeSensitive2Hierarchy', 'removeSensitive2DirectGroup'],
  },
};

export default config;
