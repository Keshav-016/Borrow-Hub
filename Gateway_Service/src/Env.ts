import { cleanEnv, num, str } from 'envalid';
import dotenv from 'dotenv';

dotenv.config();

const ENV = cleanEnv(process.env, {
    PORT:num({ default: 3000}),
    JWT_SECRET: str(),
    USER_SERVICE_URL: str(),
});
export default ENV;