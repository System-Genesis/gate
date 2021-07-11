import config from './config';
('./config/index');

const {
  web: { services },
} = config;

const entitiesRoot = 'api/entities';
// const groupsRoot = 'api/groups';
// const rolesRoot = 'api/roles';
// const digitalIdentitiesRoot = 'api/digitalIdentities';

const urlMap = new Map(
    [
        [`${entitiesRoot}/`, services.db],
        ['db', services.db],
    ]
);

export default urlMap;