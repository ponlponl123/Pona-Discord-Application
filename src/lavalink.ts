import {
    Manager,
    Node,
    NodeOptions
} from "magmastream";
import { prefix as consolePrefix } from "./config/console";
import { discordClient as self } from "@/index";
import { config as discordConf } from "./config/discord";
import { config } from "./config/lavalink";
import { Events, User } from "discord.js";
import leaveVoiceChannelAsPlayer from "./utils/magma/leaveVoiceChannelAsPlayer";

export class LavalinkServer {
    public manager: Manager;
    public lavanodes = new Array<NodeOptions>();

    public constructor(public readonly clientId: string) {
        console.log(consolePrefix.system + `\x1b[33mLogging in lavalink server with ${clientId}...\x1b[0m`);

        this.lavanodes.push({
            identifier: "Node 1",
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
            clientName: 'Pona Discord Application',
            clientId: discordConf.DISCORD_CLIENT_ID,
            defaultSearchPlatform: 'youtube music',
            send: (id, payload) => {
                const guild = self.client.guilds.cache.get(id);
                // NOTE: FOR ERIS YOU NEED JSON.stringify() THE PAYLOAD
                if (guild) guild.shard.send(payload);
                console.log(consolePrefix.lavalink + "Manager send: " + JSON.stringify(payload));
            }
        });
        
        self.client.on('raw', (d) => this.manager.updateVoiceState(d));

        this.manager.on('trackStart', async (player, track) => {
            self.saveSessionOnFile();
            if ( !player.textChannel ) return false;
            const channel = await self.client.channels.cache.get(player.textChannel)?.fetch();
            (channel && channel.isSendable()) && channel.send(`Now playing: \`${track.title}\`, requested by \`${(track.requester as User).username}\`.`);
        });

        // Emitted the player queue ends
        this.manager.on('queueEnd', async (player) => {
            leaveVoiceChannelAsPlayer(player.guild);
            self.saveSessionOnFile();
            if ( !player.textChannel ) return false;
            const channel = await self.client.channels.cache.get(player.textChannel)?.fetch();
            (channel && channel.isSendable()) && channel.send('Queue has ended.');
        });

        // Emitted whenever a node connects
        this.manager.on('nodeConnect', (node: Node) => {
            console.log(consolePrefix.lavalink + `Node "${node.options.identifier}" connected.`);
        });

        // The error event, which you should handle otherwise your application will crash when an error is emitted
        this.manager.on("nodeError", (node: Node, error: Error) => {
            console.log(consolePrefix.lavalink + `Node "${node.options.identifier}" encountered an error: ${error.message}.`);
        });

        self.client.on(Events.ClientReady, (e) => {
            this.manager.init(clientId);
        })
    }
}