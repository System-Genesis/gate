import { NextFunction, Request, Response } from 'express';
import * as http from 'http';
import start from '../src/express/index'
import { setEntityType, setService } from '../src/express/middlewares';

let server: http.Server;


beforeAll(async () => {
    try {
        server = await start(3003);
        return server;
    } catch (err) { console.log(err.message) }
    console.log(`Server started test bla bla`)
    return;
})
describe('Test server handling scopes', () => {

    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;
    let nextFunction: NextFunction = jest.fn();

    beforeEach(() => {
        mockRequest = {};
        mockResponse = {
            json: jest.fn(),
            locals: {}
        };
    });

    test('It should set the entity type', async () => {
        const middleware = setEntityType('entity');
        await middleware(mockRequest as Request, mockResponse as Response, nextFunction);

        expect((mockResponse.locals as any).entityType).toBe('entity');
    });

    test('It should set the route for the propper service', async () => {
        const middleware = setService('https://www.google.com');
        await middleware(mockRequest as Request, mockResponse as Response, nextFunction);

        expect((mockResponse.locals as any).destServiceUrl).toBe('https://www.google.com');
    });
});
