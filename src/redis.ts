import Redis from "ioredis";
import { prefix } from '@config/console'

export class RedisClient {
  public redis: Redis;

  constructor(host: string, port: number, password?: string) {
    this.redis = new Redis(port, host, {
        password: password,
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