import { config } from 'dotenv';
import path from 'node:path';

export const env_path = __dirname + path.sep + '..' + path.sep + '..' + path.sep + '.env' + (process.env.NODE_ENV ? '.'+process.env.NODE_ENV : '');
export const env_config = config({
    path: env_path,
});
export const env = process.env;
export const argv = process.argv;

export default env;