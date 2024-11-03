import {
  pona,
  lavalink,
  database,
  apiServer
} from './index'
import Pona, { voiceStateChange } from './client'
import { apiServer as APIServ } from './server/main'
import LavalinkServer, { Player } from './lavalink'
import { Database } from './database'

import ping from './utils/ping'
import { Client, VoiceState } from 'discord.js'
import { Track } from './interfaces/player'
import os from 'os';

export default class eventManager {
  constructor () {
    pona.on('heartbeat', this.pona_heartbeat);
    pona.on('voiceStateUpdate', this.pona_voiceStateUpdate)

    lavalink.on('trackStart', this.player_trackStart)
    lavalink.on('playerDestroy', this.player_playerDestroy)
  }

  private async pona_heartbeat (client: Client) {
    const date = new Date(new Date().toLocaleString("en-US", {timeZone: "Asia/Bangkok"}));
    const clusterId = os.hostname();
    const shardId = pona.ponaId;

    ping('https://discord.com/api/gateway', 443, async (ping) => {
      await database.connection?.query(`INSERT INTO pona_heartbeat_interval (time, clusterid, shardid, pingtomaster) VALUES (?, ?, ?, ?)`, [date, clusterId, shardId, ping]);
    });
  }
  
  private async pona_voiceStateUpdate (type: voiceStateChange, oldState: VoiceState, newState: VoiceState) {
    const date = new Date(new Date().toLocaleString("en-US", {timeZone: "Asia/Bangkok"}));
    const guildId = oldState.guild.id || newState.guild.id;
    const stateType = type.toString();
    await database.connection?.query(
        `INSERT INTO pona_voicestate_history (guildid, beforestate, afterstate, date, type)
        VALUES (?, ?, ?, ?, ?)`
    , [
        guildId,
        JSON.stringify(oldState),
        JSON.stringify(newState),
        date,
        stateType
      ]
    )
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
  }
}