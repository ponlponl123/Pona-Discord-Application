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
            console.log(consolePrefix.socket, '🟠 Starting Redis Network');
            this.redis = new Redis({
                sentinels: [{ host: redisConfig.REDIS_HOST, port: redisConfig.REDIS_PORT }],
                name: "pona_master",
                connectTimeout: 10000,
                retryStrategy(times) {
                    return Math.min(times * 50, 2000);
                },
            });
            this.redis.on("ready", () => {
                console.log(consolePrefix.socket, '🟢 Redis Network is ready');
            })
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