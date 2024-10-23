import {
    Manager,
    Node,
    NodeOptions
} from "magmastream";
import { prefix as consolePrefix } from "./config/console";
import { discordClient as self } from "@/index";
import { config } from "./config/lavalink";

export class LavalinkServer {
    public manager: Manager;
    public lavanodes = new Array<NodeOptions>();

    public constructor(public readonly clientId: string) {
        console.log(consolePrefix.system + `\x1b[33mLogging in lavalink server with ${clientId}...\x1b[0m`);

        this.lavanodes.push({
            identifier: "1",
            host: config.host,
            port: config.port,
            password: config.password,
            retryAmount: 1000,
            retryDelay: 10000,
            resumeStatus: true, // default: false,
            resumeTimeout: 1000,
            secure: false
        })

        this.manager = new Manager({
            nodes: this.lavanodes,
            send: (id, payload) => {
                const guild = self.client.guilds.cache.get(id);
                // NOTE: FOR ERIS YOU NEED JSON.stringify() THE PAYLOAD
                if (guild) guild.shard.send(payload);
                console.log(consolePrefix.lavalink + "Manager send: " + JSON.stringify(payload));
            }
        });

        // Emitted whenever a node connects
        this.manager.on('nodeConnect', (node: Node) => {
            console.log(consolePrefix.lavalink + `Node "${node.options.identifier}" connected.`);
        });

        // The error event, which you should handle otherwise your application will crash when an error is emitted
        this.manager.on("nodeError", (node: Node, error: Error) => {
            console.log(consolePrefix.lavalink + `Node "${node.options.identifier}" encountered an error: ${error.message}.`);
        });

        this.manager.init(clientId);
    }
}