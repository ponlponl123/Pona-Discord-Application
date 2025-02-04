import register from "./register";
import { Server } from "socket.io";
import { Server as HttpServer } from "http";
import dynamicGuildNamespace from "./of/guilds";
import trafficDebugger from "@/server/middlewares/socket/trafficDebugger";
import { prefix as consolePrefix } from "@/config/console";
import { config as redisConfig } from "@/config/redis";
import Redis from "ioredis";

export class initialize {
    public readonly server: Server;
    public readonly redis: Redis | undefined;

    constructor(http: HttpServer) {
        const socketServer = new Server(http, {
            cors: {
                origin: "https://pona.ponlponl123.com",
                methods: ["GET", "POST"]
            }
        });
        this.server = socketServer;

        if ( redisConfig && redisConfig.REDIS_ENABLED && redisConfig.REDIS_HOST && redisConfig.REDIS_PORT )
        {
            const redis_host = redisConfig.REDIS_HOST;
            const redis_port = redisConfig.REDIS_PORT;
            const redis_type = redisConfig.REDIS_TYPE;
            console.log(consolePrefix.socket, `🟠 Starting Redis(type: ${redis_type}) Network (${redis_host}:${redis_port})`);
            this.redis =
                redis_type === 'sentinel' ? new Redis({
                    sentinels: [
                        { host: redis_host, port: redis_port }
                    ],
                    name: "pona_master",
                    keyPrefix: "pona",
                    sentinelRetryStrategy(times) {
                      return Math.min(times * 50, 2000);
                    },
                    keepAlive: 60 * 1000,
                    sentinelMaxConnections: 5,
                    sentinelCommandTimeout: 30 * 1000, // 30 seconds
                    connectTimeout: 10 * 1000 // 10 seconds
                }) : new Redis({
                    host: redis_host,
                    port: redis_port,
                    name: "pona_master",
                    keyPrefix: "pona",
                    commandTimeout: 30 * 1000,
                });
            
            this.redis.on("ready", () => {
                console.log(consolePrefix.socket, '🟢 Redis Network is ready');
            });
            
            this.redis.on("error", (err) => {
                console.error(consolePrefix.socket, '🔴 Redis Network error :', err);
            });

            this.server.adapter(require("socket.io-redis")({ pubClient: this.redis, subClient: this.redis }));
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