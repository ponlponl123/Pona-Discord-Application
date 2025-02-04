import { RedisClusterType } from "@/interfaces/redis";

const { REDIS_ENABLED, REDIS_TYPE, REDIS_HOST, REDIS_PORT } = process.env;

export const config = {
  REDIS_ENABLED: REDIS_ENABLED === "true" ? true : REDIS_ENABLED === "false" ? false : undefined,
  REDIS_TYPE: REDIS_TYPE === "sentinel" ? "sentinel" : "redis" as RedisClusterType,
  REDIS_HOST,
  REDIS_PORT: REDIS_PORT ? Number(REDIS_PORT) : undefined
};