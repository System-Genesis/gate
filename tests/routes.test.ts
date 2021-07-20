import { NextFunction, Request, Response } from 'express';
import { setEntityType } from '../src/express/middlewares';

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
});