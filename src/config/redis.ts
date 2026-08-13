import env from './env';
import type { RedisClusterType } from '@/interfaces/redis';

const {
  REDIS_ENABLED,
  REDIS_SENTINEL_ENABLED,
  REDIS_HOST,
  REDIS_PORT,
  REDIS_PASSWORD,
  REDIS_NAME,
  REDIS_DB,
  REDIS_PREFIX,
  REDIS_SENTINEL_HOST,
  REDIS_SENTINEL_PORT,
  REDIS_SENTINEL_PASSWORD,
  REDIS_SENTINEL_HOST_2,
  REDIS_SENTINEL_PORT_2,
  REDIS_SENTINEL_HOST_3,
  REDIS_SENTINEL_PORT_3,
} = env;

function parseBool(val?: string): boolean | undefined {
  if (val === 'true') return true;
  if (val === 'false') return false;
  return undefined;
}

function buildSentinels() {
  if (REDIS_SENTINEL_ENABLED !== 'true') return [];
  const sentinels = [
    {
      host: REDIS_SENTINEL_HOST || 'localhost',
      port: parseInt(REDIS_SENTINEL_PORT || '26379'),
    },
  ];
  if (REDIS_SENTINEL_HOST_2)
    sentinels.push({
      host: REDIS_SENTINEL_HOST_2,
      port: parseInt(REDIS_SENTINEL_PORT_2 || '26379'),
    });
  if (REDIS_SENTINEL_HOST_3)
    sentinels.push({
      host: REDIS_SENTINEL_HOST_3,
      port: parseInt(REDIS_SENTINEL_PORT_3 || '26379'),
    });
  return sentinels;
}

export const config = {
  REDIS_ENABLED: parseBool(REDIS_ENABLED),
  REDIS_SENTINEL_ENABLED: parseBool(REDIS_SENTINEL_ENABLED),
  REDIS_HOST: REDIS_HOST || 'localhost',
  REDIS_PORT: parseInt(REDIS_PORT || '6379'),
  REDIS_PASSWORD: REDIS_PASSWORD || undefined,
  REDIS_SENTINEL_PASSWORD: REDIS_SENTINEL_PASSWORD || undefined,
  REDIS_NAME: REDIS_NAME || undefined,
  REDIS_PREFIX: REDIS_PREFIX || 'pona:',
  REDIS_DB: parseInt(REDIS_DB || '0'),
  REDIS_TYPE: (REDIS_SENTINEL_ENABLED === 'true'
    ? 'sentinel'
    : 'standalone') as RedisClusterType,
  sentinels: buildSentinels(),
};
