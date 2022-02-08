/**
 * extract the user scopes array from the token
 * 
 * @param token - jwt token
 * @returns 
 */
function extractScopes(token: string): string[] {
    try {
        const scopes = JSON.parse(Buffer.from((token || '').split('.')[1], 'base64').toString('ascii')).scope;
        return Array.isArray(scopes) ? scopes : [scopes];
    } catch (err) {
        return [];
    }
}

/**
 * extract the client name from the token
 * 
 * @param token - jwt token
 * @returns 
 */
function extractClientName(token: string): string {
    try {
        return JSON.parse(Buffer.from((token || '').split('.')[1], 'base64').toString('ascii')).clientName || '';
    } catch (err) {
        return '';
    }
}

export { extractScopes, extractClientName };