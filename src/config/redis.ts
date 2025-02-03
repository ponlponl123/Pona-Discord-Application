const { REDIS_ENABLED, REDIS_HOST, REDIS_PORT } = process.env;

export const config = {
  REDIS_ENABLED: REDIS_ENABLED === "true" ? true : REDIS_ENABLED === "false" ? false : undefined,
  REDIS_HOST,
  REDIS_PORT: REDIS_PORT ? Number(REDIS_PORT) : undefined
};