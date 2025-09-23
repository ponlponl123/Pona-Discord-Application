import register from "./register";
import { Server } from "socket.io";
import { Server as HttpServer } from "http";
import dynamicGuildNamespace from "./of/guilds";
import trafficDebugger from "@/server/middlewares/socket/trafficDebugger";
import { prefix as consolePrefix } from "@/config/console";
import { config as redisConfig } from "@/config/redis";
import Redis, { RedisOptions } from "ioredis";
import { createAdapter } from "@socket.io/redis-adapter";

export class initialize {
    public readonly server: Server;
    private redis_pub?: Redis;
    private redis_sub?: Redis;

    constructor(http: HttpServer) {
        const socketServer = new Server(http, {
            cors: {
                origin: "https://pona.ponlponl123.com",
                methods: ["GET", "POST"]
            },
            maxHttpBufferSize: 15e6 // 15 MB
        });
        this.server = socketServer;

        if (redisConfig && redisConfig.REDIS_ENABLED) {
            const redis_conf = redisConfig;

            const redisOptions: RedisOptions = {
                password: redis_conf.REDIS_PASSWORD || undefined,
                ...(redis_conf.REDIS_SENTINEL_ENABLED ? {
                    sentinelPassword: redis_conf.REDIS_SENTINEL_PASSWORD || undefined,
                    sentinels: redis_conf.sentinels,
                } : {}),
                db: redis_conf.REDIS_DB || 0,
                name: redis_conf.REDIS_NAME || undefined,
                keyPrefix: 'pona:',
                lazyConnect: true,
                enableReadyCheck: true,
                retryStrategy(times) {
                    if (times > 10) {
                        console.error(consolePrefix.redis, '❗ Redis connection failed after 10 attempts');
                        return null; // Stop retrying
                    }
                    return Math.min(times * 100, 3000); // Exponential backoff
                }
            };

            console.log(consolePrefix.redis, '🟠 Attempting to connect to Redis for Socket.io Adapter...');

            const redis_pub = new Redis(
                redis_conf.REDIS_PORT,
                redis_conf.REDIS_HOST,
                redisOptions
            );

            const redis_sub = new Redis(
                redis_conf.REDIS_PORT,
                redis_conf.REDIS_HOST,
                redisOptions
            );

            redis_pub.on('ready', () => {
                console.log(consolePrefix.redis, '🟢 Redis for Socket.io Adapter Publisher connected successfully!');
            });

            redis_pub.on('error', (err) => {
                console.error(consolePrefix.redis, '🔴 Redis for Socket.io Adapter Publisher connection error:', err);
            });

            redis_sub.on('ready', () => {
                console.log(consolePrefix.redis, '🟢 Redis for Socket.io Adapter Subscriber connected successfully!');
            });

            redis_sub.on('error', (err) => {
                console.error(consolePrefix.redis, '🔴 Redis for Socket.io Adapter Subscriber connection error:', err);
            });

            // Assign to class properties to prevent garbage collection
            this.redis_pub = redis_pub;
            this.redis_sub = redis_sub;

            // Use the Redis adapter for Socket.io
            this.server.adapter(createAdapter(this.redis_pub, this.redis_sub));
        }

        dynamicGuildNamespace(this.server);

        // Websocket Handshake
        this.server.on("connection", (socket) => {
            socket.emit("hello", "socket " + socket.id);

            register(socket);
            trafficDebugger(socket);
        });
    }
}
