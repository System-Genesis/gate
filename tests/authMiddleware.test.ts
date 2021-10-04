import { NextFunction, Request, Response } from 'express';
import authMiddleware, { basicScopeHandler } from '../src/express/middlewares/auth';
import { ServiceError } from '../src/express/middlewares/error';


const requiredScopes: string [] =  ['write', 'read'];

// heyman asked for this tests

describe('test basicScopeHandler to catch missing scopes', () => {
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;
    let nextFunction: NextFunction = jest.fn();

    beforeEach(() => {
        mockRequest = {};
        mockResponse = {
            json: jest.fn()
        };
    });

    test('should give 401 with bad token/no token', async () => {
        mockRequest = {
            headers: {
                'Authorization': 'bad token'
            }
        }
        await authMiddleware(mockRequest as Request, mockResponse as Response, nextFunction);
        expect(nextFunction).toBeCalledWith(new ServiceError(401, 'Unauthorized'));
    });
    test('no error because has one of requiredScopes scopes', async () => {
        const scopes = ['write'];
        expect(() => { basicScopeHandler(scopes, requiredScopes, 'POST') }).not.toThrow(ServiceError);
    });

    test('error because missing required scope', async () => {
        const scopes = [''];
        expect(() => { basicScopeHandler(scopes, requiredScopes, 'GET') }).toThrow(ServiceError);
    });

    test('error because missing required scope', async () => {
        const scopes = ['read'];
        expect(() => { basicScopeHandler(scopes, requiredScopes, 'PUT') }).toThrow(ServiceError);
    });
});