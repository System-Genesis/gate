import request from "supertest";
import testJson from "../../src/config/test.json";
import { app } from "../../src/express";

// const serviceTypes: string[] = testJson.valueObjects.serviceType.values;
// const entityTypes: { Soldier: string; Civilian: string; GoalUser: string } =
//   testJson.valueObjects.EntityType;
const digitalIdentitiesDomains: string[] =
  testJson.valueObjects.digitalIdentityId.domain.values;
const allSources: string[] = testJson.valueObjects.source.values;
const allDITypes = testJson.valueObjects.digitalIdentityType;

describe("VALID CREATIONS", () => {
  const digitalIdToCreate: any = {
    uniqueId: `t123@${digitalIdentitiesDomains[0]}`,
    type: allDITypes.DomainUser,
    source: allSources[1],
  };
  it("should create a new digital identity", (done) => {
    request(app)
      .post("/api/digitalIdentities")
      .send(digitalIdToCreate)
      .expect(200)
      .end(async (err: any, res: any) => {
        if (err) {
          console.log(err);
          throw done(err);
        }

        return done();
      });
  });
});
