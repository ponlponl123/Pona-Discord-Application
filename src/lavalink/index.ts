import { Manager } from "./structures/manager";
import { Player } from "./structures/player";
import { Node } from "./structures/node";

import { NodeOptions } from "@interfaces/node";
import { Track, UnresolvedTrack } from "@interfaces/player";
import { discordClient as self } from "@/index";
import { prefix as consolePrefix } from "@config/console";
import { config as discordConf } from "@config/discord";
import { config } from "@config/lavalink";
import discord, { Routes } from "discord.js";
import leaveVoiceChannelAsPlayer from "@utils/player/leaveVoiceChannelAsPlayer";
import { getGuildLanguage } from "@/utils/i18n";
import { EventEmitter } from "events";

interface PlayerEvents {
    'trackStart': (player: Player, track: Track) => void;
    'queueEnded': (player: Player) => void;
}

declare interface LavalinkServer {
    on<U extends keyof PlayerEvents>(
      event: U, listener: PlayerEvents[U]
    ): this;
  
    emit<U extends keyof PlayerEvents>(
      event: U, ...args: Parameters<PlayerEvents[U]>
    ): boolean;
}

class LavalinkServer extends EventEmitter {
    public manager: Manager;
    public lavanodes = new Array<NodeOptions>();

    public constructor(public readonly clientId: string) {
        super();
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
            defaultSearchPlatform: 'youtube',
            send: (id, payload) => {
                const guild = self.client.guilds.cache.get(id);
                if (guild) guild.shard.send(payload);
                console.log(consolePrefix.lavalink + "Manager send: " + JSON.stringify(payload));
            }
        });
        
        self.client.on('raw', (d) => this.manager.updateVoiceState(d));

        this.manager.on('trackStart', async (player, track) => {
            self.saveSessionOnFile();
            // set voice channel status to current playing track
            if ( !player.voiceChannel ) return false;
            const lang = getGuildLanguage(player.guild);
            const rest = new discord.REST({ version: "10" }).setToken(discordConf.DISCORD_TOKEN);
            await rest.put((Routes.channel(player.voiceChannel) + '/voice-status' as discord.RouteLike), {
                body: {"status": `${lang.data.music.state.voiceChannel.status} ${track.title} ${lang.data.music.play.author} ${track.author}`}
            })

            this.emit('trackStart', player, track);

            // Notify currently playing to text channel
            // if ( !player.textChannel ) return false;
            // const channel = await self.client.channels.cache.get(player.textChannel)?.fetch();
            // (channel && channel.isSendable()) && channel.send(`Now playing: \`${track.title}\`, requested by \`${(track.requester as User).username}\`.`);
        });

        // Emitted the player queue ends
        this.manager.on('queueEnd', async (player) => {
            // set voice channel status to null
            if ( player.voiceChannel ) {
                const rest = new discord.REST({ version: "10" }).setToken(discordConf.DISCORD_TOKEN);
                await rest.put((Routes.channel(player.voiceChannel) + '/voice-status' as discord.RouteLike), {
                    body: {"status": null}
                })
            }

            leaveVoiceChannelAsPlayer(player.guild);
            this.emit('queueEnded', player);

            // Notify queue ended to text channel
            // if ( !player.textChannel ) return false;
            // const channel = await self.client.channels.cache.get(player.textChannel)?.fetch();
            // (channel && channel.isSendable()) && channel.send('Queue has ended.');
        });

        // Emitted whenever a node connects
        this.manager.on('nodeConnect', (node: Node) => {
            console.log( consolePrefix.lavalink + `Node "${node.options.identifier}" connected.` );
        });

        // The error event, which you should handle otherwise your application will crash when an error is emitted
        this.manager.on("nodeError", (node: Node, error: Error) => {
            console.log( consolePrefix.lavalink + `Node "${node.options.identifier}" encountered an error: ${error.message}.` );
        });

        this.manager.on('playerCreate', async (player: Player) => {
            console.log( consolePrefix.lavalink + `Player Created, playing ${player.queue.current?.title} for ${player.guild}` )
        });

        this.manager.on('chaptersLoaded', async (player: Player, track: UnresolvedTrack | Track) => {
            console.log( consolePrefix.lavalink + `Player chaptersLoaded, Continue playing ${player.queue.current?.title} for ${player.guild}` )
        });

        this.manager.on('segmentsLoaded', async (player: Player, track: UnresolvedTrack | Track) => {
            console.log( consolePrefix.lavalink + `Player segmentsLoaded, Continue playing ${player.queue.current?.title} for ${player.guild}` )
        });
    }
}

export * from "./structures/manager";
export * from "./structures/player";
export * from "./structures/queue";
export * from "./structures/utils";
export * from "./structures/node";

export default LavalinkServer;