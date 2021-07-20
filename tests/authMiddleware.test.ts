import { basicScopeHandler } from '../src/express/middlewares/auth';
import { ServiceError } from '../src/express/middlewares/error';


const requiredScopes: string [] =  ['write', 'read'];

// heyman asked for this tests

describe('test basicScopeHandler to catch missing scopes', () => {
    it('no error because has one of requiredScopes scopes', async () => {
        const scopes = ['write'];
        // try {
            // basicScopeHandler(scopes, requiredScopes);
        //     expect
        // }
        // catch(e) {

        // }
        
        expect(() => {basicScopeHandler(scopes, requiredScopes) }).not.toThrow(ServiceError);
    });

    test('error because missing required scope', async () => {
        const scopes = [''];
        expect(() => {basicScopeHandler(scopes, requiredScopes) }).toThrow(ServiceError);
    });
});