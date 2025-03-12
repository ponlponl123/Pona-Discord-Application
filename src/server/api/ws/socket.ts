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
    public readonly redis_pub: Redis | undefined;
    public readonly redis_sub: Redis | undefined;

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

            const redis_pub_options: RedisOptions = {
                sentinels: [{ host: "redis-sentinel", port: 26379 }],
                name: "pona_master",
                keyPrefix: "pona",
                sentinelRetryStrategy(times) {
                    return Math.min(times * 50, 2000);
                },
                lazyConnect: true,
                keepAlive: 30 * 60 * 1000,
                maxRetriesPerRequest: null, // disable the max retries per request limit
            };

            const redis_sub_options: RedisOptions = {
                sentinels: [{ host: "redis-sentinel", port: 26379 }],
                name: "pona_master",
                keyPrefix: "pona",
                sentinelRetryStrategy(times) {
                    return Math.min(times * 50, 2000);
                },
                lazyConnect: true,
                keepAlive: 30 * 60 * 1000,
                sentinelMaxConnections: 5,
                sentinelCommandTimeout: 5 * 60 * 1000, // 30 seconds
                connectTimeout: 10 * 1000, // 10 seconds
                maxRetriesPerRequest: null, // disable the max retries per request limit
            };

            this.redis_pub = new Redis(redis_pub_options);
            this.redis_sub = new Redis(redis_sub_options);

            const onRedisReady = (type: 'pub' | 'sub') => {
                console.log(consolePrefix.socket, `🟢 Redis Network is ready (${type})`);
            };

            const onRedisError = (err: { code: string; message: string }, type: 'pub' | 'sub') => {
                if (err.code === 'ETIMEDOUT') {
                    console.error(consolePrefix.socket + `🔴 (${type}) Redis: Connection timed out. Retrying...`);
                } else if (err.message.includes('All sentinels are unreachable')) {
                    console.error(consolePrefix.socket + `🔴 (${type}) Redis: All Sentinels are unreachable. Retrying from scratch...`);
                } else if (err.message.includes('Connection in subscriber mode, only subscriber commands may be used')) {
                    console.error(consolePrefix.socket + `🔴 (${type}) Redis: Redis is in subscriber mode. Please check your Redis configuration.`);
                } else if (err.message.includes('Only HELLO messages are accepted by Sentinel instances')) {
                    console.error(consolePrefix.socket + `🔴 (${type}) Redis: Attempted to connect to a Sentinel instance. Please check your Redis configuration.`);
                } else {
                    console.error(consolePrefix.socket + `🔴 (${type}) Redis: Unknown Redis error occurred:`, err);
                }
            };

            this.redis_pub.on("ready", () => { onRedisReady('pub') });
            this.redis_sub.on("ready", () => { onRedisReady('sub') });

            this.redis_pub.on("error", (err: { code: string; message: string }) => { onRedisError(err, 'pub') });
            this.redis_sub.on("error", (err: { code: string; message: string }) => { onRedisError(err, 'sub') });

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