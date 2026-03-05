import env, { argv } from './env';

const { LAVALINK_SERVER, LAVALINK_PORT, LAVALINK_PASSWORD } = env;
const isProduction =
  argv.includes('--production') ||
  argv.includes('-launch') ||
  env.NODE_ENV === 'production';

export const config = {
  host: LAVALINK_SERVER || 'localhost',
  port: Number(LAVALINK_PORT) || 2333,
  password: LAVALINK_PASSWORD || 'youshallnotpass',
};

if (isProduction && (!config.host || !config.port || !config.password)) {
  throw new Error('Missing Lavalink environment variables for production');
}
