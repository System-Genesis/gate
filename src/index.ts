// Add this to the VERY top of the first 
// file loaded in your app
import apm from 'elastic-apm-node';
export const apmAgent = apm.start({
    // Override service name from package.json
    // Allowed characters: a-z, A-Z, 0-9, -, _, 
    // and space
    serviceName: 'gate',

    // Use if APM Server requires a token
    secretToken: process.env['APM_SECRET_TOKEN'],

    // Set custom APM Server URL
    // Default: http://localhost:8200
    serverUrl: process.env['APM_SERVER'],
});

import Server from './express';
import config from './config';
const { web } = config;

!apmAgent.isStarted() || console.log('apm-agent is started');

const main = async () => {
    await Server(web.port);
    console.log(`Server started on port: ${web.port}`);
};

main().catch((err) => console.error(err));