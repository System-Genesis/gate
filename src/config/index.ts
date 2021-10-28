import * as env from "env-var";
import "./dotenv";
import * as scopesConfig from "./scopes.json";

const { rules, scopes } = scopesConfig;

const config = {
  web: {
    port: env.get("PORT").required().asPortNumber(),
    isAuth: env.get("IS_AUTH").required().asBool(),
    requiredScopes: env.get("REQUIRED_SCOPES").required().asArray(),
    services: {
      elastic: env.get("ELASTIC_SERVICE").required().asString(),
      read: env.get("READ_SERVICE").required().asString(),
      write: env.get("WRITE_SERVICE").required().asString(),
    },
  },
  spike: {
    myAud: env.get("KARTOFFEL_AUD").required().asString(),
    rules: rules,
    scopes: scopes,
  },
  entitiesType: {
    role: "role",
    entity: "entity",
    digitalIdentity: "digitalIdentity",
    group: "group",
  },
};

export default config;
