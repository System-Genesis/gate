import { NextFunction, Request, Response } from 'express';
import * as http from 'http';
import * as request from 'supertest'
import * as qs from 'qs'
import start, { app } from '../src/express/index'
import { setEntityType, setService } from '../src/express/middlewares';

let server: http.Server;


beforeAll(async () => {
    try {
        server = await start(3003);
        return server;
    } catch (err) { console.log(err.message) }
    console.log(`Server started test bla bla`)

})
describe('Test server handling scopes', () => {
    // let mockRequest: Partial<Request>;
    // let mockResponse: Partial<Response>;
    // let nextFunction: NextFunction = jest.fn();

    // beforeEach(() => {
    //     mockRequest = {};
    //     mockResponse = {
    //         json: jest.fn(),
    //         locals: {}
    //     };
    // });

    // test('It should set the entity type', async () => {
    //     const middleware = setEntityType('entity');
    //     await middleware(mockRequest as Request, mockResponse as Response, nextFunction);

    //     expect((mockResponse.locals as any).entityType).toBe('entity');
    // });

    // test('It should set the route for the propper service', async () => {
    //     const middleware = setService('https://www.google.com');
    //     await middleware(mockRequest as Request, mockResponse as Response, nextFunction);

    //     expect((mockResponse.locals as any).destServiceUrl).toBe('https://www.google.com');
    // });

    test(`it should stream`, async (done) => {
        request(app).get(`/api/entities`)
            .query(qs.stringify({ stream: true }))
            .expect(200)
            .end((err, res) => {
                if (err) {
                    throw done(err)
                }
                expect(res.body).toBe(undefined)
                return done()
            })
    })
});