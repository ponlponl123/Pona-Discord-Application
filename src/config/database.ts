import env, { argv } from './env';

const {
  DATABASE_HOST,
  DATABASE_PORT,
  DATABASE_USER,
  DATABASE_PASS,
  DATABASE_NAME,
} = env;
const isProduction =
  argv.includes('--production') ||
  argv.includes('-launch') ||
  env.NODE_ENV === 'production';

export const config = {
  host: DATABASE_HOST || 'localhost',
  port: Number(DATABASE_PORT) || 3306,
  user: DATABASE_USER || 'me',
  password: DATABASE_PASS || 'secret',
  database: DATABASE_NAME || 'my_db',
  url: `mysql://${DATABASE_USER}:${DATABASE_PASS}@${DATABASE_HOST}:${DATABASE_PORT}/${DATABASE_NAME}`,
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
