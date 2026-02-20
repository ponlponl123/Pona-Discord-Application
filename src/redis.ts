import Redis, { type SentinelAddress } from "ioredis";
import { prefix as consolePrefix, type as consoleType } from '@config/console'
import { toml } from ".";

export class RedisClient {
  public redis: Redis;
  private redisSentinels: Partial<SentinelAddress>[];

  constructor() {
    this.redisSentinels = [
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
    ];
    this.redisSentinels.forEach((sentinel, index) => {
        console.log(consoleType.info, consolePrefix.redis, `Configured Redis Sentinel ${index + 1}: ${sentinel.host}:${sentinel.port}`);
    });
    toml?.redis?.sentinel?.natmap && toml.redis.sentinel.natmap.forEach((nat, index) => {
        console.log(consoleType.info, consolePrefix.redis, `Configured Redis Sentinel NAT Mapping ${index + 1}: ${nat.nat} -> ${nat.host}:${nat.port}`);
    });
    this.redis = new Redis({
        password: process.env["REDIS_PASSWORD"] || undefined,
        ...(process.env["REDIS_SENTINEL_ENABLED"] === "true" ? {
            sentinelPassword: process.env["REDIS_SENTINEL_PASSWORD"] || undefined,
            sentinels: this.redisSentinels,
        }: {
            host: process.env["REDIS_HOST"] || "localhost",
            port: parseInt(process.env["REDIS_PORT"] || "6379"),
        }),
        natMap: toml?.redis?.sentinel?.natmap ? Object.fromEntries(
            toml.redis.sentinel.natmap.map((nat) => [
                `${nat.nat}`,
                { host: nat.host, port: nat.port }
            ])
        ) : undefined,
        name: process.env["REDIS_NAME"] || undefined,
        db: parseInt(process.env["REDIS_DB"] || "0"),
        lazyConnect: true,
        enableReadyCheck: true,
        keyPrefix: 'pona:',
        sentinelReconnectStrategy(times) {
            if (times > 10) {
                console.error(consoleType.error, consolePrefix.redis, '❗ Redis Sentinel connection failed after 10 attempts');
                return null; // Stop retrying
            }
            return Math.min(times * 100, 3000); // Exponential backoff
        },
        retryStrategy(times) {
            if (times > 10) {
                console.error(consoleType.error, consolePrefix.redis, '❗ Redis connection failed after 10 attempts');
                return null; // Stop retrying
            }
            return Math.min(times * 100, 3000); // Exponential backoff
        }
    });
    
    console.log(consoleType.info, consolePrefix.redis, '🟠 Attempting to connect to Redis Database...');
    this.redis.connect().then(() => {
        console.log(consoleType.info, consolePrefix.redis, '🟢 Redis Database connected successfully!');
    }).catch((err) => {
        console.error(consoleType.error, consolePrefix.redis, '🔴 Redis Database connection error:', err);
    })
  }
}

export default RedisClient;