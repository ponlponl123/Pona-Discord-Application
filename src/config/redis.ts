import env from './env';
import { RedisClusterType } from "@/interfaces/redis";

const {
  REDIS_ENABLED,
  REDIS_PUB_HOST,
  REDIS_PUB_PORT,
  REDIS_PUB_PASSWORD,
  REDIS_SUB_TYPE,
  REDIS_SUB_HOST,
  REDIS_SUB_PORT,
  REDIS_SUB_PASSWORD
} = env;

export const config = {
  REDIS_ENABLED: REDIS_ENABLED === "true" ? true : REDIS_ENABLED === "false" ? false : undefined,
  pub: {
    host: REDIS_PUB_HOST,
    port: REDIS_PUB_PORT ? Number(REDIS_PUB_PORT) : undefined,
    auth: REDIS_PUB_PASSWORD ? {
      password: REDIS_PUB_PASSWORD
    } : null
  },
  sub: {
    type: REDIS_SUB_TYPE === "sentinel" ? "sentinel" : "standalone" as RedisClusterType,
    host: REDIS_SUB_HOST,
    port: REDIS_SUB_PORT ? Number(REDIS_SUB_PORT) : undefined,
    auth: REDIS_SUB_PASSWORD ? {
      password: REDIS_SUB_PASSWORD
    } : null
  }
};