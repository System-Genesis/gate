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

const sensitiveDataSource = DATA_SOURCE[0];
const sensitive2DataSource = DATA_SOURCE[1];

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
      elastic: env.get('ELASTIC_SERVICE').required().asUrlString(),
      db: env.get('DB_SERVICE').required().asUrlString(),
    }
  },
  // mongo: {
  //     uri: env.get('MONGO_URI').required().asUrlString(),
  //     featureCollectionName: env.get('MONGO_FEATURE_COLLECTION_NAME').required().asString(),
  // },
  // rabbit: {
  //     uri: env.get('RABBIT_URI').required().asUrlString(),
  //     retryOptions: {
  //         minTimeout: env.get('RABBIT_RETRY_MIN_TIMEOUT').default(1000).asIntPositive(),
  //         retries: env.get('RABBIT_RETRY_RETRIES').default(10).asIntPositive(),
  //         factor: env.get('RABBIT_RETRY_FACTOR').default(1.8).asFloatPositive(),
  //     },
  // },
  rules: {
    filters: {
      entity: [
        {
          name: 'hideSensitivePersons',
          field: 'hierarchy',
          values: [`root/sensitive`, `granpa/son`],
        },
        {
          name: 'jobFilter',
          field: 'job',
          values: [`root/sensitive`],
        },
      ],
      group: [
        {
          name: 'hideSensitivePersons',
          field: 'source',
          values: [`root/sensitive`, `granpa/son`],
        }
      ],
      digitalIdentity: [],
      role: [],
      organizationGroup: [],
    },
    transformers: {
      entity: [
        {
          name: 'removeSensitiveDomainUsers',
          method: 'arrayFilter',
          targetField: 'domainUsers',
          conditions: [
            {
              method: 'simpleValueCondition',
              field: 'dataSource',
              value: `${sensitiveDataSource}`,
            },
          ],
        },
        {
          name: 'removeJob',
          method: 'fieldExclude',
          targetField: 'job',
        },
        {
          name: 'removeSensitive2DomainUsersHierarchy',
          method: 'arrayMapper',
          targetField: 'domainUsers',
          transformer: {
            method: 'fieldExclude',
            targetField: 'hierarchy',
            conditions: [
              {
                method: 'simpleValueCondition',
                field: 'dataSource',
                value: `${sensitive2DataSource}`,
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
      ],
      group: {},
      digitalIdentity: {},
      role: {},
      organizationGroup: {},
    },
  },
  scopes: {
    externalScope: ['hideSensitivePersons'],
    // ['removeSensitive2Hierarchy', 'removeSensitive2DirectGroup'],
  },
};

export default config;
