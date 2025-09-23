import Redis from "ioredis";
import { prefix } from '@config/console'

export class RedisClient {
  public redis: Redis;

  constructor() {
    this.redis = new Redis(
        parseInt(process.env["REDIS_PORT"] || "6379"),
        process.env["REDIS_HOST"] || "localhost",
    {
        password: process.env["REDIS_PASSWORD"] || undefined,
        ...(process.env["REDIS_SENTINEL_ENABLED"] === "true" ? {
            sentinelPassword: process.env["REDIS_SENTINEL_PASSWORD"] || undefined,
            sentinels: [
                {
                    host: process.env["REDIS_SENTINEL_HOST"] || "localhost",
                    port: parseInt(process.env["REDIS_SENTINEL_PORT"] || "26379"),
                },
                ...(process.env["REDIS_SENTINEL_HOST_2"] ? [{
                    host: process.env["REDIS_SENTINEL_HOST_2"] || "localhost",
                    port: parseInt(process.env["REDIS_SENTINEL_PORT_2"] || "26379"),
                }] : []),
                ...(process.env["REDIS_SENTINEL_HOST_3"] ? [{
                    host: process.env["REDIS_SENTINEL_HOST_3"] || "localhost",
                    port: parseInt(process.env["REDIS_SENTINEL_PORT_3"] || "26379"),
                }] : []),
            ],
        }: {}),
        name: process.env["REDIS_NAME"] || undefined,
        db: parseInt(process.env["REDIS_DB"] || "0"),
        lazyConnect: true,
        enableReadyCheck: true,
        keyPrefix: 'pona:',
        retryStrategy(times) {
            if (times > 10) {
                console.error(prefix.redis, '❗ Redis connection failed after 10 attempts');
                return null; // Stop retrying
            }
            return Math.min(times * 100, 3000); // Exponential backoff
        }
    });
    
    console.error(prefix.redis, '🟠 Attempting to connect to Redis Database...');
    this.redis.connect().then(() => {
        console.log(prefix.redis, '🟢 Redis Database connected successfully!');
    }).catch((err) => {
        console.error(prefix.redis, '🔴 Redis Database connection error:', err);
    })
  }
}

export default RedisClient;