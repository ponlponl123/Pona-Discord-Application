import { Server } from "socket.io";

export class initialize {
    public readonly server: Server;

    constructor() {
        const socketServer = new Server();
        this.server = socketServer;
    }
}