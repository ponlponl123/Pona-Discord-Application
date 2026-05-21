import { pona, lavalink, apiServer } from './index';
import type { PonaEvents, voiceStateChange } from './client';
import type { Player, PlayerEvents } from './lavalink';

import ping from './utils/ping';
import type { Track } from './interfaces/player';
import type { Client, VoiceState } from 'discord.js';
import type { PlayerStateEventType } from './interfaces/manager';
import { type apiServer as ApiServer } from './server/main';
import os from 'os';
import { prisma } from './prisma';

export type EventEmitter = keyof PonaEvents | keyof PlayerEvents;

interface CommonEventHandler {
  heartbeat: (client: Client) => void;
  voiceStateUpdate: (
    type: voiceStateChange,
    oldState?: VoiceState,
    newState?: VoiceState,
  ) => void;
  playerStateUpdate: (
    oldPlayer: Player,
    newPlayer: Player,
    changeType: PlayerStateEventType,
  ) => void;
  trackStart: (player: Player, track: Track) => void;
  trackPos: (guildId: string, pos: number) => void;
  playerDestroy: (player: Player) => void;
  playerCreate: (player: Player) => void;
  clientReady: (client: Client) => void;
  queueEnded: (player: Player) => void;
}

function bangkokNow(): Date {
  return new Date(
    new Date().toLocaleString('en-US', { timeZone: 'Asia/Bangkok' }),
  );
}

export default class eventManager {
  private customHandlers: {
    [K in EventEmitter]?: CommonEventHandler[keyof CommonEventHandler][];
  } = {};

  constructor() {
    pona.on('heartbeat', this.pona_heartbeat.bind(this));
    pona.on('voiceStateUpdate', this.pona_voiceStateUpdate.bind(this));

    lavalink.on('trackPos', this.player_trackPos.bind(this));
    lavalink.on('trackStart', this.player_trackStart.bind(this));
    lavalink.on('playerCreate', this.player_playerCreate.bind(this));
    lavalink.on('playerDestroy', this.player_playerDestroy.bind(this));
    lavalink.on('playerStateUpdate', this.player_playerStateUpdate.bind(this));
  }

  public registerHandler<T extends EventEmitter>(
    event: T,
    handler: CommonEventHandler[T & keyof CommonEventHandler],
  ) {
    if (!this.customHandlers[event]) this.customHandlers[event] = [];
    this.customHandlers[event]!.push(handler);
  }

  private async invokeHandlers<T extends EventEmitter>(
    event: T,
    ...args:
      | Parameters<CommonEventHandler[T & keyof CommonEventHandler]>
      | unknown[]
  ) {
    const handlers = this.customHandlers[event];
    if (!handlers) return;
    for (const handler of handlers) {
      await (handler as (...a: unknown[]) => void)(...args);
    }
  }

  private async pona_heartbeat(client: Client) {
    const date = bangkokNow();
    const clusterId = os.hostname();
    const shardId = pona.ponaId;

    ping('https://discord.com/api/gateway', 443, async (ms) => {
      await prisma.pona_heartbeat_interval.create({
        data: {
          time: date,
          clusterid: clusterId,
          shardid: shardId.toString(),
          ptm: ms,
        },
      });
    });
    await this.invokeHandlers('heartbeat', client);
  }

  private async pona_voiceStateUpdate(
    type: voiceStateChange,
    oldState: VoiceState,
    newState: VoiceState,
  ) {
    const date = bangkokNow();
    const guildId = oldState.guild.id || newState.guild.id;
    const memberId = oldState.member?.id || newState.member?.id;
    const channelId = oldState.channel?.id || newState.channel?.id;

    const serializeVoiceState = (s: VoiceState) =>
      JSON.stringify({
        channelId: s.channelId,
        mute: s.mute,
        deaf: s.deaf,
        selfMute: s.selfMute,
        selfDeaf: s.selfDeaf,
        selfVideo: s.selfVideo,
        streaming: s.streaming,
        serverMute: s.serverMute,
        serverDeaf: s.serverDeaf,
        suppress: s.suppress,
      });

    await prisma.pona_voicestate_history.create({
      data: {
        guildid: guildId,
        memberid: memberId,
        channelid: channelId || '',
        beforestate: serializeVoiceState(oldState),
        afterstate: serializeVoiceState(newState),
        date: date,
        type: type.toString(),
      },
    });

    if (oldState && !newState && oldState.member?.id === pona.client.user?.id) {
      (apiServer as ApiServer).io.to(guildId).emit('voiceStateUpdate', false);
    }

    await this.invokeHandlers('voiceStateUpdate', type, oldState, newState);
  }

  private async player_playerStateUpdate(
    oldPlayer: Player,
    newPlayer: Player,
    changeType: PlayerStateEventType,
  ) {
    await this.invokeHandlers(
      'playerStateUpdate',
      oldPlayer,
      newPlayer,
      changeType,
    );
  }

  private async player_trackPos(guildId: string, pos: number) {
    await this.invokeHandlers('trackPos', guildId, pos);
  }

  private async player_trackStart(player: Player, track: Track) {
    const date = bangkokNow();

    await prisma.$transaction([
      prisma.player_track_history.create({
        data: {
          requestby: track.requester?.id || '',
          uniqueid: track.uniqueId,
          time: date,
          voicechannel: player.voiceChannel,
          guildid: player.guild,
          track: JSON.stringify(track),
        },
      }),
      prisma.pona_flipflop_state.create({
        data: {
          time: date,
          guildid: player.guild,
          active: true,
        },
      }),
    ]);

    (apiServer as ApiServer).io.to(player.guild).emit('trackStarted', track);
    (apiServer as ApiServer).io
      .to(player.guild)
      .emit('queueUpdated', player.queue);
    await this.invokeHandlers('trackStart', player, track);
  }

  private async player_playerCreate(player: Player) {
    await this.invokeHandlers('playerCreate', player);
  }

  public async pona_action(
    name: string,
    by: string,
    data: unknown,
    guildId: string,
    channelId: string,
  ): Promise<void> {
    const date = bangkokNow();

    await prisma.player_action_history.create({
      data: {
        action_name: name,
        actionby: by,
        data: JSON.stringify(data),
        guild: guildId,
        channel: channelId,
        timestamp: date,
      },
    });

    (apiServer as ApiServer).io.to(guildId).emit('action', name, by, data);
  }

  private async player_playerDestroy(player: Player) {
    const date = bangkokNow();

    await prisma.pona_flipflop_state.create({
      data: {
        time: date,
        guildid: player.guild,
        active: false,
      },
    });

    (apiServer as ApiServer).io.to(player.guild).emit('playerDestroyed');
    await this.invokeHandlers('playerDestroy', player);
  }
}
