import { NextFunction, Request, Response } from 'express';
import { ServiceError } from '../src/express/middlewares/error';
import config from '../src/config';
import authMiddleware, { basicScopeHandler, } from '../src/auth/auth';
const { web: { isAuth, requiredScopes }, } = config;

jest.mock('../src', () => { })

describe('test basicScopeHandler to catch missing scopes', () => {
  let nextFunction: NextFunction = jest.fn();

  test('should give 401 with bad token/no token', async () => {
    if (!isAuth) {
      expect(true).toBe(true);
    }

    await authMiddleware(
      { headers: { Authorization: 'bad token' }, header: () => 'bad token' } as any as Request,
      {} as any as Response,
      nextFunction
    );

    expect(nextFunction).toBeCalledWith(new ServiceError(401, 'Unauthorized'));
  });

  test('no error because has one of requiredScopes scopes', async () => {
    if (!isAuth) {
      expect(true).toBe(true);
    }

    const scopes = ['write'];

    expect(() => {
      basicScopeHandler(scopes, requiredScopes, 'POST');
    }).not.toThrow(ServiceError);
  });

  test('error because missing required scope', async () => {
    if (!isAuth) {
      expect(true).toBe(true);
    }

    const scopes = [''];
    expect(() => {
      basicScopeHandler(scopes, requiredScopes, 'GET');
    }).toThrow(ServiceError);
  });
});
