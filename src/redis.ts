import Redis, { type SentinelAddress } from 'ioredis';
import { prefix as consolePrefix, type as consoleType } from '@config/console';
import toml from './config/toml';

export class RedisClient {
  public redis: Redis;
  private redisSentinels: Partial<SentinelAddress>[];

  constructor() {
    this.redisSentinels = this.buildSentinels();
    console.log(
      consoleType.info,
      consolePrefix.redis,
      `Configured Redis Sentinel Group: ${process.env['REDIS_NAME'] || 'mymaster'}`,
    );

    this.redisSentinels.forEach((sentinel, i) => {
      console.log(
        consoleType.info,
        consolePrefix.redis,
        `Configured Redis Sentinel ${i + 1}: ${sentinel.host}:${sentinel.port}`,
      );
    });

    const isSentinel = process.env['REDIS_SENTINEL_ENABLED'] === 'true';
    const natMapData = toml?.redis?.sentinel?.natmap;
    
    if (natMapData) {
      console.log(
        consoleType.info,
        consolePrefix.redis,
        `Found ${natMapData.length} NAT mappings in TOML configuration.`,
      );
      natMapData.forEach((nat, i) => {
        console.log(
          consoleType.info,
          consolePrefix.redis,
          `  Mapping ${i + 1}: ${nat.nat} -> ${nat.host}:${nat.port}`,
        );
      });
    } else {
      console.log(
        consoleType.warn,
        consolePrefix.redis,
        'No Redis Sentinel NAT mappings found in TOML configuration.',
      );
    }

    const natMap = natMapData
      ? Object.fromEntries(
          natMapData.map((nat) => [
            `${nat.nat}`,
            { host: nat.host, port: nat.port },
          ]),
        )
      : undefined;

    this.redis = new Redis({
      password: process.env['REDIS_PASSWORD'] || undefined,
      ...(isSentinel
        ? {
            sentinelPassword:
              process.env['REDIS_SENTINEL_PASSWORD'] || undefined,
            sentinels: this.redisSentinels,
          }
        : {
            host: process.env['REDIS_HOST'] || 'localhost',
            port: parseInt(process.env['REDIS_PORT'] || '6379'),
          }),
      natMap,
      name: process.env['REDIS_NAME'] || 'mymaster',
      db: parseInt(process.env['REDIS_DB'] || '0'),
      lazyConnect: true,
      enableReadyCheck: true,
      keyPrefix: 'pona:',
      sentinelReconnectStrategy: (times) =>
        times > 20 ? null : Math.min(times * 200, 5000),
      retryStrategy: (times) =>
        times > 20 ? null : Math.min(times * 200, 5000),
    });

    console.log(
      consoleType.info,
      consolePrefix.redis,
      'Attempting to connect to Redis Database...',
    );
    this.redis
      .connect()
      .then(() =>
        console.log(
          consoleType.info,
          consolePrefix.redis,
          'Redis Database connected successfully!',
        ),
      )
      .catch((err) =>
        console.error(
          consoleType.error,
          consolePrefix.redis,
          'Redis Database connection error:',
          err,
        ),
      );
  }

  private buildSentinels(): Partial<SentinelAddress>[] {
    const sentinels: Partial<SentinelAddress>[] = [
      {
        host: process.env['REDIS_SENTINEL_HOST'] || 'localhost',
        port: parseInt(process.env['REDIS_SENTINEL_PORT'] || '26379'),
      },
    ];
    for (const suffix of ['_2', '_3']) {
      const host = process.env[`REDIS_SENTINEL_HOST${suffix}`];
      if (host) {
        sentinels.push({
          host,
          port: parseInt(
            process.env[`REDIS_SENTINEL_PORT${suffix}`] || '26379',
          ),
        });
      }
    }
    return sentinels;
  }
}

export default RedisClient;
