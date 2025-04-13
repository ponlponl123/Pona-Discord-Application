import { config } from 'dotenv';
import path from 'node:path';

if ( process.env.NODE_ENV === 'development' )
{
    const env_path = __dirname + path.sep + '..' + path.sep + '..' + path.sep + '.env' + (process.env.NODE_ENV ? '.'+process.env.NODE_ENV : '');
    config({
        path: env_path,
    });
}
export const env = process.env;
export const argv = process.argv;

export default env;