import { Server } from "socket.io";
import eventManager from '@/events';
import { database, discordClient as self } from '@/index';
import { fetchUserByOAuth, fetchUserByOAuthAccessToken } from "@/utils/oauth";
import trafficDebugger from "@/server/middlewares/socket/trafficDebugger";
import { HTTP_PonaCommonStateWithTracks, HTTP_PonaRepeatState } from "@/interfaces/player";
import { convertTo_HTTPPlayerState, getHTTP_PlayerState } from "@/utils/player/httpReq";
import { MemberVoiceChangedState } from "@/interfaces/member";
import { VoiceBasedChannel } from "discord.js";
import joinChannel from "@/utils/player/joinVoiceChannelAsPlayer";
import { Player } from "@/lavalink";
import { fetchIsUserInSameVoiceChannel, fetchIsUserInVoiceChannel } from "@/utils/isUserIsInVoiceChannel";

export type GuildEvents =
  'player_created'      |
  'player_destroyed'    |
  'pause_updated'       |
  'volume_updated'      |
  'autoplay_updated'    |
  'repeat_updated'      |
  'track_started'       |
  'track_pos_updated'   |
  'track_updated'       |
  'channel_updated'     |
  'connection_updated'  |
  'queue_updated'       |
  'queue_ended'         ;

async function connectToVoiceChannelBySocket(guildId: string, voiceBasedChannelId: string) {
  if ( guildId && voiceBasedChannelId ) {
    const guild = self.client.guilds.cache.get(guildId);
    if (!guild ) return;
    const textChannel = guild.systemChannel;
    if (!textChannel ) return;
    const voiceChannel = guild.channels.cache.get(voiceBasedChannelId) as VoiceBasedChannel;
    if (!voiceChannel ) return;
    await joinChannel(textChannel, voiceChannel, guild);
  }
}



export default async function dynamicGuildNamespace(io: Server) {
  const io_guild = io.of(/^\/guild\/\d+$/);
  const events = new eventManager();

  async function playerUpdate(player: Player, event: GuildEvents) {
    const guildId = player.guild;
    const namespace_io = io.of(`/guild/${guildId}`);
    const httpPlayer = convertTo_HTTPPlayerState(player);
    namespace_io.to("pona! music").emit(event, httpPlayer);
  }

  events.registerHandler("trackStart", (player, track) => {
    const guildId = player.guild;
    const namespace_io = io.of(`/guild/${guildId}`);
    namespace_io.to("pona! music").emit('track_started' as GuildEvents, track);
    namespace_io.to("pona! music").emit('queue_updated' as GuildEvents, [
      track,
      ...player.queue
    ]);
  });

  events.registerHandler("trackPos", (guildId, pos) => {
    const namespace_io = io.of(`/guild/${guildId}`);
    namespace_io.to("pona! music").emit('track_pos_updated' as GuildEvents, pos);
  });

  events.registerHandler("playerStateUpdate", (oldPlayer, newPlayer, changeType) => {
    const guildId = oldPlayer?.options?.guild || newPlayer?.options?.guild;
    if ( !guildId ) return;
    const namespace_io = io.of(`/guild/${guildId}`);
    switch (changeType) {
      case 'channelChange':
        namespace_io.to("pona! music").emit('channel_updated' as GuildEvents, newPlayer.voiceChannel);
        break;
      case 'queueChange':
        namespace_io.to("pona! music").emit('queue_updated' as GuildEvents, [
          newPlayer.queue.current,
          ...newPlayer.queue
        ]);
        break;
      case 'connectionChange':
        namespace_io.to("pona! music").emit('connection_updated' as GuildEvents);
        break;
      case 'trackChange':
        namespace_io.to("pona! music").emit('track_updated' as GuildEvents, newPlayer.queue.current);
        break;
      case 'volumeChange':
        namespace_io.to("pona! music").emit('volume_updated' as GuildEvents, newPlayer.volume);
        break;
      case 'repeatChange':
        namespace_io.to("pona! music").emit('repeat_updated' as GuildEvents, {
          track: newPlayer.trackRepeat,
          queue: newPlayer.queueRepeat,
          dynamic: newPlayer.dynamicRepeat,
        } as HTTP_PonaRepeatState);
        break;
      case 'autoplayChange':
        namespace_io.to("pona! music").emit('autoplay_updated' as GuildEvents, newPlayer.isAutoplay);
        break;
      case 'pauseChange':
        namespace_io.to("pona! music").emit('pause_updated' as GuildEvents, newPlayer.paused);
        break;
      default:
        namespace_io.to("pona! music").emit('unknown_updated' as GuildEvents);
        break;
    }
  });

  events.registerHandler("voiceStateUpdate", async (type, oldState, newState) => {
    if (
      type==='clientJoined' ||
      type==='clientLeaved' ||
      type==='clientSwitched'
    ) return;
    const guildId = oldState?.guild.id || newState?.guild.id;
    const memberId = oldState?.member?.id || newState?.member?.id;
    const namespace_io = io.of(`/guild/${guildId}`);
    const isUserJoined = ( oldState?.channel === undefined && newState?.channel !== undefined );
    const isUserSwitched = ( oldState?.channel !== undefined && newState?.channel !== undefined );
    const isUserLeaved = ( oldState?.channel !== undefined && newState?.channel === undefined );
    const isSameVC = (guildId && memberId) ? await fetchIsUserInVoiceChannel(guildId, memberId) : false;
    const memberVoiceState: MemberVoiceChangedState = {
      oldVC: oldState?.channel || null,
      newVC: newState?.channel || null,
      isUserJoined,
      isUserSwitched,
      isUserLeaved,
      isSameVC
    }
    namespace_io.to(`stream:${memberId}`).emit('member_state_updated', memberVoiceState);
  });

  events.registerHandler("playerCreate", (player) => {playerUpdate(player, 'player_created')});
  events.registerHandler("playerDestroy", (player) => {playerUpdate(player, 'player_destroyed')});

  events.registerHandler("queueEnded", (player) => {
    const guildId = player.guild;
    const namespace_io = io.of(`/guild/${guildId}`);
    namespace_io.to("pona! music").emit('queue_ended' as GuildEvents);
  });

  io_guild.use(async (socket, next) => {
    trafficDebugger(socket);
    const guildId = socket.nsp.name.split('/')[2];
    const authorization = socket.handshake.headers.authorization;
    const accesstoken_type = socket.handshake.auth.type;
    const accesstoken_key = socket.handshake.auth.key;
    if (
      !Number.isInteger(Number(guildId)) ||
      (!authorization &&
      (!accesstoken_type ||
      !accesstoken_key))
    ) return next(new Error("Authentication token required"));

    const guild = self.client.guilds.cache.get(guildId);
    const user = authorization ?
      await fetchUserByOAuth(authorization) :
      await fetchUserByOAuthAccessToken(accesstoken_type, accesstoken_key);

    if ( !user ) return next(new Error("unauthorized"));
    if ( !guild ) return next(new Error("invalid guild"));

    const member = await guild.members.fetch(user.id);

    if (!member) return next(new Error("not a member of this guild"));
    socket.data.member = member;
    next();
  });

  io_guild.on("connection", async (socket) => {
    const guildId = socket.nsp.name.split('/')[2];
    socket.join("pona! music");
    socket.join(`stream:${socket.data.member.id}`);
    const playerState = getHTTP_PlayerState(guildId);
    // get member voice channel by guild id and member id without know user voice channel permission
    const member = await self.client.guilds.cache.get(guildId)?.members.fetch(socket.data.member.id);
    const memberVC = member?.voice.channel;
    const data : {
      pona: HTTP_PonaCommonStateWithTracks | null;
      isMemberInVC: VoiceBasedChannel | null;
    } = {
      pona: playerState,
      isMemberInVC: memberVC || null
    }
    socket.emit("handshake", data);
    socket.on("join", async (guildId: string, voiceBasedChannelId: string)=>{
      if ( member && (await fetchIsUserInVoiceChannel(guildId, member.id)) )
      connectToVoiceChannelBySocket(guildId, voiceBasedChannelId);
    });
    socket.on("repeat", async (type: 'none' | 'track' | 'queue')=>{
      if ( !member || !type || !(await fetchIsUserInSameVoiceChannel(guildId, member.id)) ) return;
      const player = self.playerConnections.filter(connection => connection.guild.id === guildId)[0];
      let repeatType: typeof type = 'none';
      switch ( type ) {
        case 'track':
          player.player.setTrackRepeat(true);
          repeatType = 'track';
          break;
        case 'queue':
          player.player.setQueueRepeat(true);
          repeatType = 'queue';
          break;
        default:
          player.player.setTrackRepeat(false);
          repeatType = 'none';
          break;
      }
      const date = new Date(new Date().toLocaleString("en-US", {timeZone: "Asia/Bangkok"}));
      await database.connection?.query(
          `INSERT INTO player_action_history (actionby, timestamp, action_name, data, guild, channel)
          VALUES (?, ?, ?, ?, ?, ?)`
      , [
          member.id,
          date,
          'repeat',
          repeatType,
          guildId,
          player.voiceChannel.id
        ]
      )
    });
    socket.on("pause", async ()=>{
      if ( !member || !(await fetchIsUserInSameVoiceChannel(guildId, member.id)) ) return;
      const player = self.playerConnections.filter(connection => connection.guild.id === guildId)[0];
      player.player.pause(true);
      const date = new Date(new Date().toLocaleString("en-US", {timeZone: "Asia/Bangkok"}));
      await database.connection?.query(
          `INSERT INTO player_action_history (actionby, timestamp, action_name, data, guild, channel)
          VALUES (?, ?, ?, ?, ?, ?)`
      , [
          member.id,
          date,
          'pause',
          'true',
          guildId,
          player.voiceChannel.id
        ]
      )
    });
    socket.on("seek", async (position: number)=>{
      if ( !member || !(await fetchIsUserInSameVoiceChannel(guildId, member.id)) ) return;
      const player = self.playerConnections.filter(connection => connection.guild.id === guildId)[0];
      player.player.seek(position);
      player.player.pause(false);
      const date = new Date(new Date().toLocaleString("en-US", {timeZone: "Asia/Bangkok"}));
      await database.connection?.query(
          `INSERT INTO player_action_history (actionby, timestamp, action_name, data, guild, channel)
          VALUES (?, ?, ?, ?, ?, ?)`
      , [
          member.id,
          date,
          'seek',
          position,
          guildId,
          player.voiceChannel.id
        ]
      )
    });
    socket.on("skipto", async (index: number)=>{
      if ( !member || !(await fetchIsUserInSameVoiceChannel(guildId, member.id)) ) return;
      const player = self.playerConnections.filter(connection => connection.guild.id === guildId)[0];
      player.player.skipto(index);
      player.player.pause(false);
      const date = new Date(new Date().toLocaleString("en-US", {timeZone: "Asia/Bangkok"}));
      await database.connection?.query(
          `INSERT INTO player_action_history (actionby, timestamp, action_name, data, guild, channel)
          VALUES (?, ?, ?, ?, ?, ?)`
      , [
          member.id,
          date,
          'skipto',
          index,
          guildId,
          player.voiceChannel.id
        ]
      )
    });
    socket.on("play", async ()=>{
      if ( !member || !(await fetchIsUserInSameVoiceChannel(guildId, member.id)) ) return;
      const player = self.playerConnections.filter(connection => connection.guild.id === guildId)[0];
      player.player.pause(false);
      const date = new Date(new Date().toLocaleString("en-US", {timeZone: "Asia/Bangkok"}));
      await database.connection?.query(
          `INSERT INTO player_action_history (actionby, timestamp, action_name, data, guild, channel)
          VALUES (?, ?, ?, ?, ?, ?)`
      , [
          member.id,
          date,
          'pause',
          'false',
          guildId,
          player.voiceChannel.id
        ]
      )
    });
    socket.on("previous", async ()=>{
      if ( !member || !(await fetchIsUserInSameVoiceChannel(guildId, member.id)) ) return;
      const player = self.playerConnections.filter(connection => connection.guild.id === guildId)[0];
      player.player.previous();
      player.player.pause(false);
      const date = new Date(new Date().toLocaleString("en-US", {timeZone: "Asia/Bangkok"}));
      await database.connection?.query(
          `INSERT INTO player_action_history (actionby, timestamp, action_name, data, guild, channel)
          VALUES (?, ?, ?, ?, ?, ?)`
      , [
          member.id,
          date,
          'previous',
          'true',
          guildId,
          player.voiceChannel.id
        ]
      )
    });
    socket.on("next", async ()=>{
      if ( !member || !(await fetchIsUserInSameVoiceChannel(guildId, member.id)) ) return;
      const player = self.playerConnections.filter(connection => connection.guild.id === guildId)[0];
      player.player.skipto(0);
      player.player.pause(false);
      const date = new Date(new Date().toLocaleString("en-US", {timeZone: "Asia/Bangkok"}));
      await database.connection?.query(
          `INSERT INTO player_action_history (actionby, timestamp, action_name, data, guild, channel)
          VALUES (?, ?, ?, ?, ?, ?)`
      , [
          member.id,
          date,
          'next',
          'true',
          guildId,
          player.voiceChannel.id
        ]
      )
    });
  });
}