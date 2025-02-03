import register from "./register";
import { Server } from "socket.io";
import { Server as HttpServer } from "http";
import dynamicGuildNamespace from "./of/guilds";
import trafficDebugger from "@/server/middlewares/socket/trafficDebugger";
import { config as redisConfig } from "@/config/redis";
import Redis from "ioredis";

export class initialize {
    public readonly server: Server;
    public readonly redis: Redis | undefined;

    constructor(http: HttpServer) {
        if ( redisConfig )
            this.redis = new Redis({
                sentinels: [{ host: redisConfig.REDIS_HOST, port: redisConfig.REDIS_PORT }],
                name: "pona_master",
            });
        const socketServer = new Server(http, {
            cors: {
                origin: "https://pona.ponlponl123.com",
                methods: ["GET", "POST"]
            }
        });
        this.server = socketServer;
        if ( this.redis )
            this.server.adapter(require("socket.io-redis")({ pubClient: this.redis, subClient: this.redis }));

        dynamicGuildNamespace(this.server);

        // Websocket Handshake
        this.server.on("connection", (socket) => {
            socket.emit("hello", "socket " + socket.id);

            register(socket);
            trafficDebugger(socket);
        });
    }
}