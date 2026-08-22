import env, { argv } from './env';

const {
  LAVALINK_SERVER,
  LAVALINK_PORT,
  LAVALINK_PASSWORD,
  LAVALINK_SECURE,
  NODELINK_SERVER,
  NODELINK_HOST,
  NODELINK_PORT,
  NODELINK_PASSWORD,
  NODELINK_SECURE,
  NODELINK_ENABLED,
} = env;

const isProduction =
  argv.includes('--production') ||
  argv.includes('-launch') ||
  env.NODE_ENV === 'production';

export const config = {
  host: LAVALINK_SERVER || 'localhost',
  port: Number(LAVALINK_PORT) || 2333,
  password: LAVALINK_PASSWORD || 'youshallnotpass',
  secure: LAVALINK_SECURE === 'true',
};

const nodelinkHost = NODELINK_SERVER || NODELINK_HOST;
const nodelinkPort = Number(NODELINK_PORT) || (nodelinkHost && nodelinkHost !== config.host ? config.port : 2334);

export const nodelinkConfig = {
  enabled:
    NODELINK_ENABLED === 'true' ||
    (NODELINK_ENABLED !== 'false' && (Boolean(nodelinkHost) || Boolean(NODELINK_PORT))),
  host: nodelinkHost || 'localhost',
  port: nodelinkPort,
  password: NODELINK_PASSWORD || config.password || 'youshallnotpass',
  secure: NODELINK_SECURE === 'true',
};

if (isProduction && (!config.host || !config.port || !config.password)) {
  throw new Error('Missing Lavalink environment variables for production');
}

