import qs from "qs";
import request from "supertest";
import testJson from "../../src/config/test.json";
import { app } from "../../src/express";
import { sleep } from "../../src/utils/indexTest";

// const serviceTypes: string[] = testJson.valueObjects.serviceType.values;
// const entityTypes: { Soldier: string; Civilian: string; GoalUser: string } =
//   testJson.valueObjects.EntityType;
const digitalIdentitiesDomains: string[] =
  testJson.valueObjects.digitalIdentityId.domain.values;
const allSources: string[] = testJson.valueObjects.source.values;
//const allDITypes = testJson.valueObjects.digitalIdentityType;

describe("VALID CREATIONS", () => {
  const fatherGroupToCreate: any = {
    name: allSources[1],
    source: allSources[1],
    diPrefix: "123"
  };

  afterEach(() => {
    sleep(1000);
  });

  let fatherGroupId;
  it("should create a father group", (done) => {
    request(app)
      .post("/api/groups")
      .send(fatherGroupToCreate)
      .expect(200)
      .end(async (err: any, res: any) => {
        if (err) {
          console.log(err);
          throw done(err);
        }
        fatherGroupId = res.body.id;
        expect(fatherGroupId).toBeDefined();

        return done();
      });
  });
  it("should get the father diPrefix", (done) => {
    request(app)
      .get(`/api/groups/${fatherGroupId}/diPrefix`)
      .expect(200)
      .end(async (err: any, res: any) => {
        if (err) {
          console.log(err);
          throw done(err);
        }
        expect(res.body).toBe("1234")

        return done();
      });
  });



  let firstChildGroupId;
  it("should create a child group under father", (done) => {
    const firstChildGroupToCreate: any = {
      name: "firstchild",
      source: allSources[1],
      directGroup: fatherGroupId,
    };
    request(app)
      .post("/api/groups")
      .send(firstChildGroupToCreate)
      .expect(200)
      .end(async (err: any, res: any) => {
        if (err) {
          console.log(err);
          throw done(err);
        }
        firstChildGroupId = res.body.id;
        expect(firstChildGroupId).toBeDefined();

        return done();
      });
  });
  it("should get first child group expanded", (done) => {
    request(app)
      .get(`/api/groups/${firstChildGroupId}`)
      .query(qs.stringify({ expanded: true }))
      .expect(200)
      .end(async (err: any, res: any) => {
        if (err) {
          console.log(err);
          throw done(err);
        }
        expect(res.body.ancestors[0]).toBe(fatherGroupId);
        expect(res.body.hierarchy).toBe(allSources[1]);

        return done();
      });
  });
  let secondChildGroupId;
  it("should create second child group under first child", (done) => {
    const secondChildGroupToCreate: any = {
      name: "secondchild",
      source: allSources[1],
      directGroup: firstChildGroupId,

    };
    request(app)
      .post("/api/groups")
      .send(secondChildGroupToCreate)
      .expect(200)
      .end(async (err: any, res: any) => {
        if (err) {
          console.log(err);
          throw done(err);
        }
        secondChildGroupId = res.body.id;
        expect(secondChildGroupId).toBeDefined();

        return done();
      });
  });
  it("should get the father diPrefix", (done) => {
    request(app)
      .get(`/api/groups/${secondChildGroupId}/diPrefix`)
      .expect(200)
      .end(async (err: any, res: any) => {
        if (err) {
          console.log(err);
          throw done(err);
        }
        expect(res.body).toBe("1234")

        return done();
      });
  })
  it("should get second child group expanded", (done) => {
    request(app)
      .get(`/api/groups/${secondChildGroupId}`)
      .query(qs.stringify({ expanded: true }))
      .expect(200)
      .end(async (err: any, res: any) => {
        if (err) {
          console.log(err);
          throw done(err);
        }
        expect(res.body.ancestors[0]).toBe(firstChildGroupId);
        expect(res.body.ancestors[1]).toBe(fatherGroupId);
        expect(res.body.hierarchy).toBe(allSources[1] + "/firstchild");

        return done();
      });
  });

  it("should create a new role", (done) => {
    const roleToCreate: any = {
      roleId: `t123@${digitalIdentitiesDomains[0]}`,
      source: allSources[1],
      directGroup: secondChildGroupId,
    };
    request(app)
      .post("/api/roles")
      .send(roleToCreate)
      .expect(200)
      .end(async (err: any, res: any) => {
        if (err) {
          console.log(err);
          throw done(err);
        }

        return done();;
      });
  });
  it("should get the new role", (done) => {
    request(app)
      .get(`/api/roles/t123@${digitalIdentitiesDomains[0]}`)
      .expect(200)
      .end(async (err: any, res: any) => {
        if (err) {
          console.log(err);
          throw done(err);
        }
        expect(res.body.roleId).toBe(`t123@${digitalIdentitiesDomains[0]}`);
        return done();
      });
  });
  it("should connect the new role to di", (done) => {
    request(app)
      .put(
        `/api/roles/t123@${digitalIdentitiesDomains[0]}/digitalIdentity/t123@${digitalIdentitiesDomains[0]}`
      )
      .expect(200)
      .end(async (err: any, res: any) => {
        if (err) {
          throw done(err);
        }
        return done();
      });
  });
  it("should return the di expanded with direct role", (done) => {
    request(app)
      .get(`/api/digitalIdentities//t123@${digitalIdentitiesDomains[0]}`)
      .expect(200)
      .end(async (err: any, res: any) => {
        if (err) {
          console.log(err);
          throw done(err);
        }
        console.log(res.body);

        return done();
      });
  });
})
