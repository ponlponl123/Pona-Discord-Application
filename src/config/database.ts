import env, { argv } from './env';

const {
  DATABASE_HOST,
  DATABASE_PORT,
  DATABASE_USER,
  DATABASE_PASS,
  DATABASE_NAME,
  DATABASE_URL,
} = env;
const isProduction =
  argv.includes('--production') ||
  argv.includes('-launch') ||
  env.NODE_ENV === 'production';

const host = DATABASE_HOST || 'localhost';
const port = Number(DATABASE_PORT) || 3306;
const user = DATABASE_USER || 'me';
const password = DATABASE_PASS || 'secret';
const database = DATABASE_NAME || 'my_db';

const encodedUser = encodeURIComponent(user);
const encodedPass = encodeURIComponent(password);

export const config = {
  host,
  port,
  user,
  password,
  database,
  url: DATABASE_URL || `mysql://${encodedUser}:${encodedPass}@${host}:${port}/${database}`,
};

if (
  isProduction &&
  (!config.host ||
    !config.port ||
    !config.user ||
    !config.password ||
    !config.database)
) {
  throw new Error('Missing Database environment variables for production');
}
