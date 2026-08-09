import { Manager } from './structures/manager';
import { Player } from './structures/player';
import { Node } from './structures/node';

import type { NodeOptions } from '@interfaces/node';
import type { Track } from '@interfaces/player';
import type { PlayerStateEventType } from '@/interfaces/manager';
import { prefix as consolePrefix, type as consoleType } from '@config/console';
import { config as discordConf } from '@config/discord';
import { config } from '@config/lavalink';
import { getGuildLanguage } from '@/utils/i18n';
import { EventEmitter } from 'events';
import setVoiceChannelStatus from '@/utils/setVoiceChannelStatus';
import * as discord from 'discord.js';
import { Routes } from 'discord.js';
import type Pona from '@/client';

export interface PlayerEvents {
  trackPos: (guildId: string, pos: number) => void;
  trackStart: (player: Player, track: Track) => void;
  playerStateUpdate: (
    oldPlayer: Player,
    newPlayer: Player,
    changeType: PlayerStateEventType,
  ) => void;
  queueEnded: (player: Player) => void;
  playerCreate: (player: Player) => void;
  playerDestroy: (player: Player) => void;
}

declare interface LavalinkServer {
  on<U extends keyof PlayerEvents>(event: U, listener: PlayerEvents[U]): this;
  emit<U extends keyof PlayerEvents>(
    event: U,
    ...args: Parameters<PlayerEvents[U]>
  ): boolean;
}

class LavalinkServer extends EventEmitter {
  public manager: Manager;
  public lavanodes: NodeOptions[] = [];

  private handleError(error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error(
      consoleType.error,
      consolePrefix.lavalink + 'Unexpected error:',
      msg,
    );
  }

  constructor(public readonly clientId: string, private readonly pona: Pona) {
    super();
    console.log(
      consoleType.info,
      consolePrefix.system +
      `\x1b[33mLogging in lavalink server with ${clientId}...\x1b[0m`,
    );

    this.lavanodes.push({
      identifier: 'Node 1',
      host: config.host,
      port: config.port,
      password: config.password,
      retryAmount: 1000,
      retryDelay: 10_000,
      resumeStatus: true,
      resumeTimeout: 1000,
      secure: false,
    });

    this.manager = new Manager({
      nodes: this.lavanodes,
      clientName: 'Pona Discord Application',
      clientId: discordConf.DISCORD_CLIENT_ID,
      defaultSearchPlatform: 'pona! search',
      send: (id, payload) => {
        const guild = this.pona.client.guilds.cache.get(id);
        if (guild) guild.shard.send(payload);
        console.log(
          consoleType.info,
          consolePrefix.lavalink + 'Manager send: ' + JSON.stringify(payload),
        );
      },
    });

    this.pona.client.on('raw', (d) => this.manager.updateVoiceState(d));
    this.registerManagerEvents();
  }

  private registerManagerEvents() {
    this.manager.on('trackStart', async (player, track) => {
      try {
        if (!player.voiceChannel) return;
        const lang = await getGuildLanguage(player.guild);
        await setVoiceChannelStatus(
          player.voiceChannel,
          `${lang.data.music.state.voiceChannel.status} ${track.cleanTitle} ${lang.data.music.play.author} ${track.cleanAuthor}`,
        );
        this.emit('trackStart', player, track);
      } catch (error) {
        this.handleError(error);
      }
    });

    this.manager.on('queueEnd', async (player) => {
      try {
        if (player.voiceChannel) {
          const rest = new discord.REST({ version: '10' }).setToken(
            discordConf.DISCORD_TOKEN,
          );
          await rest.put(
            (Routes.channel(player.voiceChannel) +
              '/voice-status') as discord.RouteLike,
            { body: { status: null } },
          );
        }
        this.emit('queueEnded', player);
      } catch (error) {
        this.handleError(error);
      }
    });

    this.manager.on('playerStateUpdate', (oldPlayer, newPlayer, changeType) => {
      this.emit('playerStateUpdate', oldPlayer, newPlayer, changeType);
    });

    this.manager.on('trackPos', (guildId, pos) =>
      this.emit('trackPos', guildId, pos),
    );
    this.manager.on('playerDestroy', (player) =>
      this.emit('playerDestroy', player),
    );

    this.manager.on('nodeConnect', (node: Node) => {
      console.log(
        consoleType.info,
        consolePrefix.lavalink + `Node "${node.options.identifier}" connected.`,
      );
    });

    this.manager.on('nodeError', (node: Node, error: Error) => {
      console.log(
        consoleType.error,
        consolePrefix.lavalink +
        `Node "${node.options.identifier}" error: ${error.message}`,
      );
    });

    this.manager.on('playerCreate', (player: Player) => {
      console.log(
        consoleType.info,
        consolePrefix.lavalink +
        `Player created, playing ${player.queue.current?.title} for ${player.guild}`,
      );
      this.emit('playerCreate', player);
    });

    this.manager.on('chaptersLoaded', (player: Player) => {
      console.log(
        consoleType.info,
        consolePrefix.lavalink +
        `Chapters loaded for ${player.queue.current?.title} in ${player.guild}`,
      );
    });

    this.manager.on('segmentsLoaded', (player: Player) => {
      console.log(
        consoleType.info,
        consolePrefix.lavalink +
        `Segments loaded for ${player.queue.current?.title} in ${player.guild}`,
      );
    });
  }
}

export * from './structures/manager';
export * from './structures/player';
export * from './structures/queue';
export * from './structures/utils';
export * from './structures/node';

export default LavalinkServer;
