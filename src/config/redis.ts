const { REDIS_HOST, REDIS_PORT } = process.env;

var toPort = Number(REDIS_PORT);

if (!REDIS_PORT || !toPort) 
  throw new Error("Missing environment variables");

export const config = {
  REDIS_HOST,
  REDIS_PORT: toPort
};