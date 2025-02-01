import {
  pona,
  lavalink,
  database,
  apiServer
} from './index'
import { voiceStateChange } from './client'
import { Player } from './lavalink'

import ping from './utils/ping'
import { Client, VoiceState } from 'discord.js'
import { Track } from './interfaces/player'
import os from 'os';

export default class eventManager {
  private customHandlers: { [key: string]: Function[] } = {};

  constructor () {
    pona.on('heartbeat', this.pona_heartbeat.bind(this));
    pona.on('voiceStateUpdate', this.pona_voiceStateUpdate.bind(this));

    lavalink.on('trackStart', this.player_trackStart.bind(this));
    lavalink.on('playerDestroy', this.player_playerDestroy.bind(this));
  }

  public registerHandler(event: string, handler: Function) {
    if (!this.customHandlers[event]) {
      this.customHandlers[event] = [];
    }
    this.customHandlers[event].push(handler);
  }

  private async invokeHandlers(event: string, ...args: any[]) {
    if (this.customHandlers[event]) {
      for (const handler of this.customHandlers[event]) {
        await handler(...args);
      }
    }
  }

  private async pona_heartbeat (client: Client) {
    const date = new Date(new Date().toLocaleString("en-US", {timeZone: "Asia/Bangkok"}));
    const clusterId = os.hostname();
    const shardId = pona.ponaId;

    ping('https://discord.com/api/gateway', 443, async (ping) => {
      await database.connection?.query(`INSERT INTO pona_heartbeat_interval (time, clusterid, shardid, pingtomaster) VALUES (?, ?, ?, ?)`, [date, clusterId, shardId, ping]);
    });
    await this.invokeHandlers('heartbeat', client);
  }
  
  private async pona_voiceStateUpdate (type: voiceStateChange, oldState: VoiceState, newState: VoiceState) {
    const date = new Date(new Date().toLocaleString("en-US", {timeZone: "Asia/Bangkok"}));
    const guildId = oldState.guild.id || newState.guild.id;
    const memberid = oldState.member?.id || newState.member?.id;
    const channelid = oldState.channel?.id || newState.channel?.id;
    const stateType = type.toString();
    // const oldchannelid = oldState.channel?.id;
    // const newchannelid = newState.channel?.id;
    switch (type) {
      default : {
        await database.connection?.query(
          `INSERT INTO pona_voicestate_history (guildid, memberid, channelid, beforestate, afterstate, date, type)
          VALUES (?, ?, ?, ?, ?, ?, ?)`
        , [
            guildId,
            memberid,
            channelid,
            JSON.stringify(oldState),
            JSON.stringify(newState),
            date,
            stateType
          ]
        );
        break;
      }
    }
    if ( (oldState && !newState) && oldState.member?.id === pona.client.user?.id )
      apiServer.io.to(guildId).emit('voiceStateUpdate', false);
    await this.invokeHandlers('voiceStateUpdate', type, oldState, newState);
  }

  private async player_trackStart (player: Player, track: Track) {
    const date = new Date(new Date().toLocaleString("en-US", {timeZone: "Asia/Bangkok"}));
    await database.connection?.query(
        `INSERT INTO player_track_history (requestby, uniqueid, time, voicechannel, guildid, track)
        VALUES (?, ?, ?, ?, ?, ?)`
    , [
      track.requester?.id,
      track.uniqueId,
      date,
      player.voiceChannel,
      player.guild,
      JSON.stringify(track)
      ]
    )
    await database.connection?.query(
        `INSERT INTO pona_flipflop_state (time, guildid, active)
        VALUES (?, ?, ?)`
    , [
      date,
      player.guild,
      1
      ]
    )
    apiServer.io.to(player.guild).emit('trackStarted', track);
    apiServer.io.to(player.guild).emit('queueUpdated', player.queue);
    await this.invokeHandlers('trackStart', player, track);
  }
  private async player_playerDestroy (player: Player) {
    const date = new Date(new Date().toLocaleString("en-US", {timeZone: "Asia/Bangkok"}));
    await database.connection?.query(
        `INSERT INTO pona_flipflop_state (time, guildid, active)
        VALUES (?, ?, ?)`
    , [
      date,
      player.guild,
      0
      ]
    )
    apiServer.io.to(player.guild).emit('playerDestroyed');
    await this.invokeHandlers('playerDestroy', player);
  }
}