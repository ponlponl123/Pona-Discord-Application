import Redis from "ioredis";
import { prefix } from '@config/console'

export class RedisClient {
  public redis: Redis;
  public redis_ReadOnly: Redis;

  constructor(host: string, port: number, password?: string, options?: {
    replica: {
        enabled: boolean;
        host: string;
        port: number;
        password?: string;
    }
  }) {
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

    if ( options?.replica.enabled )
    {
        this.redis_ReadOnly = new Redis(options.replica.port, options.replica.host, {
            password: options.replica.password,
            lazyConnect: true,
            enableReadyCheck: true,
            keyPrefix: 'pona:',
            retryStrategy(times) {
                if (times > 10) {
                    console.error(prefix.redis, '❗ Redis connection failed 10 attempts');
                    // Stop retrying after 10 attempts
                    console.error(prefix.redis, '❗ Exiting the process now...');
                    process.exit(1);
                    // Return null to stop retrying (if posible)
                    return null;
                }
                return Math.min(times * 100, 3000);
            }
        });
        console.error(prefix.redis, '🟠 Attempting to connect to Redis Replica Database...');
        this.redis_ReadOnly.connect().then(() => {
            console.log(prefix.redis, '🟢 Redis Replica Database connected successfully!');
        }).catch((err) => {
            console.error(prefix.redis, '🔴 Redis Replica Database connection error:', err);
        })
    }
    else this.redis_ReadOnly = this.redis;
    
    console.error(prefix.redis, '🟠 Attempting to connect to Redis Database...');
    this.redis.connect().then(() => {
        console.log(prefix.redis, '🟢 Redis Database connected successfully!');
    }).catch((err) => {
        console.error(prefix.redis, '🔴 Redis Database connection error:', err);
    })
  }
}

export default RedisClient;