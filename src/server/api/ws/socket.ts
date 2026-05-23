import register from './register';
import { Server } from 'socket.io';
import { Server as HttpServer } from 'http';
import dynamicGuildNamespace from './of/guilds';
import trafficDebugger from '@/server/middlewares/socket/trafficDebugger';
import { prefix as consolePrefix, type as consoleType } from '@/config/console';
import { config as redisConfig } from '@/config/redis';
import toml from '@/config/toml';
import Redis, { RedisOptions } from 'ioredis';
import { createAdapter } from '@socket.io/redis-adapter';

export class initialize {
  public readonly server: Server;
  private redis_pub?: Redis;
  private redis_sub?: Redis;

  constructor(http: HttpServer) {
    const socketServer = new Server(http, {
      cors: {
        origin: 'https://pona.ponlponl123.com',
        methods: ['GET', 'POST'],
      },
      maxHttpBufferSize: 15e6, // 15 MB
      // Performance optimizations
      pingTimeout: 20000, // Faster dead connection detection
      pingInterval: 25000,
      upgradeTimeout: 10000,
      transports: ['websocket', 'polling'], // Prefer WebSocket
      allowUpgrades: true,
      perMessageDeflate: {
        threshold: 1024, // Only compress messages > 1KB
        zlibDeflateOptions: {
          level: 6, // Balance between speed and compression
        },
      },
      httpCompression: {
        threshold: 1024,
      },
      // Connection limits for stability
      connectTimeout: 45000,
      // Parser options for better performance
      parser: undefined, // Use default parser (fastest)
    });
    this.server = socketServer;

    if (redisConfig && redisConfig.REDIS_ENABLED) {
      const redis_conf = redisConfig;

      const natMapData = toml?.redis?.sentinel?.natmap;
      if (natMapData) {
        console.log(
          consoleType.info,
          consolePrefix.redis,
          `Socket.io: Found ${natMapData.length} NAT mappings in TOML configuration.`,
        );
      }

      const redisOptions: RedisOptions = {
        password: redis_conf.REDIS_PASSWORD || undefined,
        ...(redis_conf.REDIS_SENTINEL_ENABLED
          ? {
              sentinelPassword: redis_conf.REDIS_SENTINEL_PASSWORD || undefined,
              sentinels: redis_conf.sentinels,
            }
          : {
              host: redis_conf.REDIS_HOST || 'localhost',
              port: redis_conf.REDIS_PORT || 6379,
            }),
        natMap: natMapData
          ? Object.fromEntries(
              natMapData.map((nat: any) => [
                `${nat.nat}`,
                { host: nat.host, port: nat.port },
              ]),
            )
          : undefined,
        db: redis_conf.REDIS_DB || 0,
        name: redis_conf.REDIS_NAME || 'mymaster',
        keyPrefix: 'pona:',
        lazyConnect: true,
        enableReadyCheck: true,
        retryStrategy(times) {
          if (times > 20) {
            console.error(
              consoleType.error,
              consolePrefix.redis,
              '❗ Redis connection for Socket.io failed after 20 attempts',
            );
            return null; // Stop retrying
          }
          return Math.min(times * 200, 5000); // Exponential backoff
        },
      };

      if (redisOptions.natMap) {
        console.log(
          consoleType.info,
          consolePrefix.redis,
          `Socket.io Redis natMap: ${JSON.stringify(redisOptions.natMap)}`,
        );
      }

      console.log(
        consoleType.warn,
        consolePrefix.redis,
        '🟠 Attempting to connect to Redis for Socket.io Adapter...',
      );

      const redis_pub = new Redis(redisOptions);
      const redis_sub = new Redis(redisOptions);

      redis_pub.on('ready', () => {
        console.log(
          consoleType.info,
          consolePrefix.redis,
          '🟢 Redis for Socket.io Adapter Publisher connected successfully!',
        );
      });

      redis_pub.on('error', (err) => {
        console.error(
          consoleType.error,
          consolePrefix.redis,
          '🔴 Redis for Socket.io Adapter Publisher connection error:',
          err,
        );
      });

      redis_sub.on('ready', () => {
        console.log(
          consoleType.info,
          consolePrefix.redis,
          '🟢 Redis for Socket.io Adapter Subscriber connected successfully!',
        );
      });

      redis_sub.on('error', (err) => {
        console.error(
          consoleType.error,
          consolePrefix.redis,
          '🔴 Redis for Socket.io Adapter Subscriber connection error:',
          err,
        );
      });

      // Assign to class properties to prevent garbage collection
      this.redis_pub = redis_pub;
      this.redis_sub = redis_sub;

      // Use the Redis adapter for Socket.io with optimized settings
      this.server.adapter(
        createAdapter(this.redis_pub, this.redis_sub, {
          // Optimize Redis adapter performance
          key: 'pona:socket.io',
          requestsTimeout: 5000,
        }),
      );
    }

    dynamicGuildNamespace();

    // Websocket Handshake
    this.server.on('connection', (socket) => {
      socket.emit('hello', 'socket ' + socket.id);

      register(socket);
      trafficDebugger(socket);
    });
  }
}
