import env from './env';
import { RedisClusterType } from "@/interfaces/redis";

const {
  REDIS_ENABLED,
  REDIS_SENTINEL_ENABLED,
  REDIS_HOST,
  REDIS_PORT,
  REDIS_PASSWORD,
  REDIS_NAME,
  REDIS_DB,
  REDIS_SENTINEL_HOST,
  REDIS_SENTINEL_PORT,
  REDIS_SENTINEL_PASSWORD,
  REDIS_SENTINEL_HOST_2,
  REDIS_SENTINEL_PORT_2,
  REDIS_SENTINEL_HOST_3,
  REDIS_SENTINEL_PORT_3
} = env;

export const config = {
  REDIS_ENABLED: REDIS_ENABLED === "true" ? true : REDIS_ENABLED === "false" ? false : undefined,
  REDIS_SENTINEL_ENABLED: REDIS_SENTINEL_ENABLED === "true" ? true : REDIS_SENTINEL_ENABLED === "false" ? false : undefined,
  REDIS_HOST: REDIS_HOST || "localhost",
  REDIS_PORT: parseInt(REDIS_PORT || "6379"),
  REDIS_PASSWORD: REDIS_PASSWORD || undefined,
  REDIS_SENTINEL_PASSWORD: REDIS_SENTINEL_PASSWORD || undefined,
  REDIS_NAME: REDIS_NAME || undefined,
  REDIS_DB: parseInt(REDIS_DB || "0"),
  REDIS_TYPE: (REDIS_SENTINEL_ENABLED === "true" ? "sentinel" : "standalone") as RedisClusterType,
  sentinels: REDIS_SENTINEL_ENABLED === "true" ? [
    {
      host: REDIS_SENTINEL_HOST || "localhost",
      port: parseInt(REDIS_SENTINEL_PORT || "26379"),
    },
    ...(REDIS_SENTINEL_HOST_2 ? [{
      host: REDIS_SENTINEL_HOST_2 || "localhost",
      port: parseInt(REDIS_SENTINEL_PORT_2 || "26379"),
    }] : []),
    ...(REDIS_SENTINEL_HOST_3 ? [{
      host: REDIS_SENTINEL_HOST_3 || "localhost",
      port: parseInt(REDIS_SENTINEL_PORT_3 || "26379"),
    }] : []),
  ] : [],
};