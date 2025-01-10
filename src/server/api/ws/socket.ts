import { Server } from "socket.io";
import { Server as HttpServer } from "http";
import { prefix as consolePrefix } from "@/config/console";
import register from "./register";

export class initialize {
    public readonly server: Server;

    constructor(http: HttpServer) {
        const socketServer = new Server(http, {
            cors: {
                origin: "https://pona.ponlponl123.com",
                methods: ["GET", "POST"]
            }
        });
        this.server = socketServer;

        // Websocket Handshake
        this.server.on("connection", (socket) => {
            socket.emit("hello", "socket " + socket.id);
            console.log(consolePrefix.socket + `🟢 connected with transport ${socket.conn.transport.name} (${socket.id}) from ${socket.handshake.address}`);

            register(socket);

            socket.on("disconnect", (reason) => {
                console.log(consolePrefix.socket + `⚫ Good bye ${socket.conn.transport.name} (${socket.id}) from ${socket.handshake.address}\n             ↳`, reason);
            });
        });
    }
}