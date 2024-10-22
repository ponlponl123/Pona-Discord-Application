import {
    Manager,
    LavalinkNodeOptions,
    LavalinkNode
} from "lavacord";
import { prefix as consolePrefix } from "./config/console";
import { config } from "./config/lavalink";

export const nodes: LavalinkNodeOptions[] = [
    { id: "1", host: config.host, port: config.port, password: config.password }
]

export class LavalinkServer {
    public manager;

    public constructor(public readonly clientId: string) {
        this.manager = new Manager(nodes, {
            user: clientId, // Client id
            send: (packet) => {
                
            }
        });

        // The error event, which you should handle otherwise your application will crash when an error is emitted
        this.manager.on("error", (error: unknown, node: LavalinkNode) => {
            node // is the node which the error is from
        });

        this.connectToLavalinkServer();
    }

    private async connectToLavalinkServer(): Promise<void> {
        const connectionResult = await this.manager.connect();
        
        if ( connectionResult.length > 0 )
            console.log(consolePrefix.lavalink + 'Lavalink server connected successfully!');
        else
            console.log(consolePrefix.lavalink + 'Lavalink server connection failed :(');
    }
}