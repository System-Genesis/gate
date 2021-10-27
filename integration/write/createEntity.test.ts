/* eslint-disable prettier/prettier */
/* eslint-disable import/prefer-default-export */
/* eslint-disable import/no-mutable-exports */
import request from "supertest";
import testJson from "../../src/config/test.json";
import start, { app } from "../../src/express/index";
import { Server } from "http";

let server: Server;
beforeAll(async () => {
  try {
    server = await start("3002");
  } catch (err) {}
});
afterAll(async () => {
  await server.close();
});
const serviceTypes: string[] = testJson.valueObjects.serviceType.values;
const entityTypes: { Soldier: string; Civilian: string; GoalUser: string } =
  testJson.valueObjects.EntityType;

describe("VALID CREATIONS", () => {
  const entityToCreate: any = {
    firstName: "noam",
    lastName: "shilony",
    entityType: entityTypes.Soldier,
    identityCard: "206917817",
    personalNumber: "8517714",
    serviceType: serviceTypes[0],
  };
  it("should create an entity with object properties", async (done) => {
    request(app)
      .post(`/api/entities`)
      .send(entityToCreate)
      .expect(200)
      .end(async (err: any, res: any) => {
        if (err) {
          console.log(err);
          throw done(err);
        }
        console.log(res.body);
        expect(res.body).toHaveProperty("id");
        return done();
      });
  });
});
