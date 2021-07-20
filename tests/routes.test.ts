import { NextFunction, Request, Response } from 'express';
import { setEntityType, setService } from '../src/express/middlewares';

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