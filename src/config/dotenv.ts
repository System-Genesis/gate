import * as dotenv from 'dotenv';

const dotenvPath = process.env.NODE_ENV === 'dev' ? '.env.dev' : '.env';

dotenv.config({ path: dotenvPath });