import Server from './express';
import config from './config';

const { web } = config;

const main = async () => {
    await Server(web.port);
    console.log(`Server started on port: ${web.port}`);
};

main().catch((err) => console.error(err));