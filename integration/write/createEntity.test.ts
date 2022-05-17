/* eslint-disable prettier/prettier */
/* eslint-disable import/prefer-default-export */
/* eslint-disable import/no-mutable-exports */
import request from "supertest";
import testJson from "../../src/config/test.json";
import start, { app } from "../../src/express/index";
import { Server } from "http";
import * as qs from "qs";
import { sleep } from "../../src/utils/indexTest";

let server: Server;
beforeAll(async () => {
  try {
    server = await start("3002");
  } catch (err) { }
});
afterAll(async () => {
  await server.close();
});
const serviceTypes: string[] = testJson.valueObjects.serviceType.values;
const entityTypes: { Soldier: string; Civilian: string; GoalUser: string } =
  testJson.valueObjects.EntityType;
const digitalIdentitiesDomains: string[] =
  testJson.valueObjects.digitalIdentityId.domain.values;
const allSources: string[] = testJson.valueObjects.source.values;
const allDITypes = testJson.valueObjects.digitalIdentityType;

describe("VALID CREATIONS FOR ENTITIES", () => {
  const entitySoldierToCreate: any = {
    firstName: "noam",
    lastName: "shilony",
    entityType: entityTypes.Soldier,
    identityCard: "206917817",
    personalNumber: "8517714",
    serviceType: serviceTypes[0],
  };
  const entityCivilianToCreate: any = {
    firstName: "david",
    lastName: "heymann",
    entityType: entityTypes.Civilian,
    identityCard: "207026568",
  };
  const entityGoalUserToCreate: any = {
    firstName: "roei",
    lastName: "oren",
    entityType: entityTypes.GoalUser,
    goalUserId: `t43242@${digitalIdentitiesDomains[0]}`,
  };
  it("should create an entity with SOLDIER PROPERTIES!", async (done) => {
    request(app)
      .post(`/api/entities`)
      .send(entitySoldierToCreate)
      .expect(200)
      .end(async (err: any, res: any) => {
        if (err) {
          console.log(err);
          throw done(err);
        }
        expect(res.body).toHaveProperty("id");
        return done();
      });
  });
  it("should create an entity with CIVILIAN PROPERTIES!", async (done) => {
    request(app)
      .post(`/api/entities`)
      .send(entityCivilianToCreate)
      .expect(200)
      .end(async (err: any, res: any) => {
        if (err) {
          console.log(err);
          throw done(err);
        }
        expect(res.body).toHaveProperty("id");
        return done();
      });
  });
  it("should create an entity with GoalUser PROPERTIES!", async (done) => {
    request(app)
      .post(`/api/entities`)
      .send(entityGoalUserToCreate)
      .expect(200)
      .end(async (err: any, res: any) => {
        if (err) {
          console.log(err);
          throw done(err);
        }
        expect(res.body).toHaveProperty("id");
        return done();
      });
  });
});

describe("Connect/Disconnect DI to entity", () => {
  const entitySoldierToCreate: any = {
    firstName: "hagai",
    lastName: "milo",
    entityType: entityTypes.Soldier,
    identityCard: "346131147",
    personalNumber: "8517713",
    serviceType: serviceTypes[1],
  };
  const digitalIdToCreate: any = {
    uniqueId: `t1234@${digitalIdentitiesDomains[0]}`,
    type: allDITypes.DomainUser,
    source: allSources[1],
  };
  let entityId;
  let diId = `t1234@${digitalIdentitiesDomains[0]}`;

  beforeAll(async (done) => {
    request(app)
      .post(`/api/entities`)
      .send(entitySoldierToCreate)
      .end((err: any, res: any) => {
        if (err) {
          return err;
        }
        entityId = res.body.id;
        request(app)
          .post("/api/digitalIdentities")
          .send(digitalIdToCreate)
          .end((err: any, res2: any) => {
            if (err) {
              return err;
            }
            return done();
          })
          .expect(200);
      })
      .expect(200);
  });
  afterEach(() => {
    sleep(2000);
  });

  it("should connect the both of themselves", async (done) => {
    request(app)
      .put(`/api/entities/${entityId}/digitalIdentity/${diId}`)
      .expect(200)
      .end(async (err: any, res: any) => {
        if (err) {
          return done(err);
        }
        return done();
      });
  });
  it("should return entity with the DI id Route-FIND BY ID", async (done) => {
    request(app)
      .get(`/api/entities/${entityId}`)
      .query(qs.stringify({ expanded: true }))
      .expect(200)
      .end(async (err: any, res: any) => {
        if (err) {
          return done(err);
        }
        expect(res.body.digitalIdentities[0].uniqueId).toBe(diId);
        return done();
      });
  });
  it("should return entity with the DI id Route-FIND BY UID", async (done) => {
    request(app)
      .get(`/api/entities/digitalIdentity/${diId}`)
      .query(qs.stringify({ expanded: true }))
      .expect(200)
      .end(async (err: any, res: any) => {
        if (err) {
          return done(err);
        }
        expect(res.body.digitalIdentities[0].uniqueId).toBe(diId);
        return done();
      });
  });
  it("should disconnect di from entity", async (done) => {
    request(app)
      .delete(`/api/entities/${entityId}/digitalIdentity/${diId}`)
      .expect(200)
      .end(async (err: any, res: any) => {
        if (err) {
          return done(err);
        }
        return done();
      });
  });
  it("should return entity without any di`s", async (done) => {
    request(app)
      .get(`/api/entities/${entityId}`)
      .query(qs.stringify({ expanded: true }))
      .expect(200)
      .end(async (err: any, res: any) => {
        if (err) {
          return done(err);
        }
        expect(res.body.digitalIdentities).toStrictEqual([]);
        return done();
      });
  });
  it(`it should stream`, async (done) => {
    request(app).get(`/api/entities`)
      .responseType("stream")
      .query(qs.stringify({ stream: true }))
      .expect('Content-Type', 'application/json')
      .buffer()
      .parse(binaryParser)
      .expect(200)
      .end((err, res) => {
        if (err) {
          return done(err)
        }

        expect(JSON.parse(res.body)).toBeDefined()
        return done()
      })
  });

  it(`it should stream and return everything`, async (done) => {
    request(app).get(`/api/entities`)
      .query(qs.stringify({ stream: true }))
      //.responseType("stream")
      .expect('Content-Type', 'application/json')
      .expect(200)
      .end((err, res) => {
        if (err) {
          return done(err)
        }

        expect(res.body).toBeDefined()
        return done()
      })
  });
});
function binaryParser(res, callback) {
  res.setEncoding('binary');
  res.data = '';
  let i = 0;
  res.on('data', function (chunk) {
    res.data += chunk;

  });
  res.on('end', function () {
    callback(null, new Buffer(res.data, 'binary'));
  });
}