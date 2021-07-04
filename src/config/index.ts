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
          values: [`root/sensitive`],
        },
      ],
      group: {},
      digitalIdentity: {},
      role: {},
    },
    organizationGroup: {},
  },
  scopes: {
    externalScope: ['hideSensitivePersons'],
    // ['removeSensitive2Hierarchy', 'removeSensitive2DirectGroup'],
  },
};

export default config;
