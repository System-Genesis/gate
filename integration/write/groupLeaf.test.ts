import request from "supertest";
//import testJson from "../../src/config/test.json";
import { app } from "../../src/express";
import { sleep } from "../../src/utils/indexTest";



describe("Testing leaf update", () => {
    const fatherGroupToCreate: any = {
        name: "city_name",
        source: "city_name",
        diPrefix: "1234421"
    };

    afterEach(() => {
        sleep(1000);
    });

    let fatherGroupId;
    it("should create root group with leaf true", (done) => {
        request(app).post("/api/groups").send(fatherGroupToCreate).expect(200)
            .end(async (err: any, res: any) => {
                if (err) {
                    console.log(err);
                    throw done(err);
                }
                fatherGroupId = res.body.id;
                expect(fatherGroupId).toBeDefined();

                return done();
            });

    })

    let firstChildGroupId;
    it("should create root group with leaf true", (done) => {
        const fatherGroupToCreate: any = {
            name: "lol",
            source: "city_name",
            diPrefix: "1234421",
            directGroup: fatherGroupId
        };
        request(app).post("/api/groups").send(fatherGroupToCreate).expect(200)
            .end(async (err: any, res: any) => {
                if (err) {
                    console.log(err);
                    throw done(err);
                }
                firstChildGroupId = res.body.id;
                expect(firstChildGroupId).toBeDefined();

                return done();
            });

    })

})