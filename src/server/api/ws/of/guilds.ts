import { Server } from "socket.io";
import eventManager from '@/events';
import { lavalink, redisClient, discordClient as self } from '@/index';
import { fetchUserByOAuth, fetchUserByOAuthAccessToken } from "@/utils/oauth";
import trafficDebugger from "@/server/middlewares/socket/trafficDebugger";
import { HTTP_PonaCommonStateWithTracks, HTTP_PonaRepeatState, Lyric } from "@/interfaces/player";
import { convertTo_HTTPPlayerState, getHTTP_PlayerState } from "@/utils/player/httpReq";
import { MemberVoiceChangedState } from "@/interfaces/member";
import { VoiceBasedChannel } from "discord.js";
import joinChannel from "@/utils/player/joinVoiceChannelAsPlayer";
import { Player, Queue } from "@/lavalink";
import { fetchIsUserInSameVoiceChannel, fetchIsUserInVoiceChannel } from "@/utils/isUserIsInVoiceChannel";
import { config as expressConfig } from "@/config/express";
import getSongs from "@/utils/player/getSongs";
import { SearchPlatform } from "@/interfaces/manager";
import addToQueue from "@/utils/player/addToQueue";
import { parseYouTubeAuthorTitle } from "@/utils/parser";
import isPonaInVoiceChannel from "@/utils/isPonaInVoiceChannel";

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
  try {
    if ( guildId && voiceBasedChannelId ) {
      const guild = self.client.guilds.cache.get(guildId);
      if (!guild ) throw new Error("Guild not found");
      const textChannel = guild.systemChannel;
      if (!textChannel ) throw new Error("TextChannel not found");
      const voiceChannel = guild.channels.cache.get(voiceBasedChannelId) as VoiceBasedChannel;
      if (!voiceChannel ) throw new Error("VoiceChannel not found");
      await joinChannel(textChannel, voiceChannel, guild);
    }
  } catch (e: any) {
    throw new Error(`Failed to connect to voice channel\n\tReason: ${e?.message || e}\n${e?.stack || ''}`);
  }
}

export default async function dynamicGuildNamespace(io: Server) {
  const io_guild = io.of(/^\/guild\/\d+$/);
  const events = new eventManager();

  async function playerUpdate(player: Player, event: GuildEvents) {
    const guildId = player.guild;
    const namespace_io = io.of(`/guild/${guildId}`);
    const httpPlayer = convertTo_HTTPPlayerState(player);
    namespace_io.to("pona! music").emit(event, Buffer.from(JSON.stringify(httpPlayer), 'utf-8').toString('base64'));
  }

  events.registerHandler("trackStart",async (player, track) => {
    const guildId = player.guild;
    const namespace_io = io.of(`/guild/${guildId}`);
    namespace_io.to("pona! music").emit('track_started' as GuildEvents, Buffer.from(JSON.stringify(track), 'utf-8').toString('base64'));
    namespace_io.to("pona! music").emit('queue_updated' as GuildEvents, Buffer.from(JSON.stringify([
      track,
      ...player.queue
    ]), 'utf-8').toString('base64'));
    if ( redisClient?.redis)
    {
      const value = await redisClient.redis.get(`yt:lyrics:${track.identifier}`);
      if ( value )
      {
        track.lyrics = JSON.parse(value) as Lyric;
        return namespace_io.to("pona! music").emit('track_updated' as GuildEvents, Buffer.from(JSON.stringify(track), 'utf-8').toString('base64'));
      }
    }
    const endpoint = `http://localhost:${expressConfig.EXPRESS_PORT}/v1/music/lyrics`;
    const fetchLyric = new URL(endpoint);
    fetchLyric.searchParams.append('engine', 'dynamic');
    fetchLyric.searchParams.append('title', track.title);
    fetchLyric.searchParams.append('author', parseYouTubeAuthorTitle(track.author));
    fetchLyric.searchParams.append('v', track.identifier);
    fetchLyric.searchParams.append('duration', String(track.duration/1000));
    try {
      const fetchLyricByInternalAPI = await fetch(fetchLyric.toString(), {
        headers: {
          'Authorization': `Pona! ${expressConfig.EXPRESS_SECRET_API_KEY}`,
        }
      });
      if ( fetchLyricByInternalAPI.ok )
      {
        track.lyrics = (await fetchLyricByInternalAPI.json()) as Lyric;
        namespace_io.to("pona! music").emit('track_updated' as GuildEvents, Buffer.from(JSON.stringify(track), 'utf-8').toString('base64'));
        if ( redisClient?.redis )
          redisClient.redis.setex(`yt:lyrics:${track.identifier}`, 10800, JSON.stringify(track.lyrics));
      }
      else if ( fetchLyricByInternalAPI.status === 404 && redisClient?.redis )
        redisClient.redis.setex(`yt:lyrics:${track.identifier}`, 3600, '');
    } catch {
      console.log('failed to fetch lyrics')
    }
  });

  events.registerHandler("trackPos", (guildId, pos) => {
    try {
      const namespace_io = io.of(`/guild/${guildId}`);
      namespace_io.to("pona! music").emit('track_pos_updated' as GuildEvents, pos);
    } catch { return; }
  });

  events.registerHandler("playerStateUpdate", (oldPlayer, newPlayer, changeType) => {
    try {
      const guildId = oldPlayer?.options?.guild || newPlayer?.options?.guild;
      if ( !guildId ) return;
      const namespace_io = io.of(`/guild/${guildId}`);
      switch (changeType) {
        case 'channelChange':
          namespace_io.to("pona! music").emit('channel_updated' as GuildEvents, Buffer.from(JSON.stringify(newPlayer.voiceChannel), 'utf-8').toString('base64'));
          break;
        case 'queueChange':
          namespace_io.to("pona! music").emit('queue_updated' as GuildEvents, Buffer.from(JSON.stringify([
            newPlayer.queue.current,
            ...newPlayer.queue
          ]), 'utf-8').toString('base64'));
          break;
        case 'connectionChange':
          namespace_io.to("pona! music").emit('connection_updated' as GuildEvents);
          break;
        case 'trackChange':
          namespace_io.to("pona! music").emit('track_updated' as GuildEvents, Buffer.from(JSON.stringify(newPlayer.queue.current), 'utf-8').toString('base64'));
          break;
        case 'volumeChange':
          namespace_io.to("pona! music").emit('volume_updated' as GuildEvents, newPlayer.volume);
          break;
        case 'repeatChange':
          namespace_io.to("pona! music").emit('repeat_updated' as GuildEvents, Buffer.from(JSON.stringify({
            track: newPlayer.trackRepeat,
            queue: newPlayer.queueRepeat,
            dynamic: newPlayer.dynamicRepeat,
          } as HTTP_PonaRepeatState), 'utf-8').toString('base64'));
          break;
        case 'autoplayChange':
          namespace_io.to("pona! music").emit('autoplay_updated' as GuildEvents, newPlayer.isAutoplay?1:0);
          break;
        case 'pauseChange':
          namespace_io.to("pona! music").emit('pause_updated' as GuildEvents, newPlayer.paused?1:0);
          break;
        default:
          namespace_io.to("pona! music").emit('unknown_updated' as GuildEvents);
          break;
      }
  } catch { return; }
  });

  events.registerHandler("voiceStateUpdate", async (type, oldState, newState) => {
    try {
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
      namespace_io.to(`stream:${memberId}`).emit('member_state_updated', Buffer.from(JSON.stringify(memberVoiceState), 'utf-8').toString('base64'));
    } catch { return; }
  });

  events.registerHandler("playerCreate", (player) => {playerUpdate(player, 'player_created')});
  events.registerHandler("playerDestroy", (player) => {playerUpdate(player, 'player_destroyed')});

  events.registerHandler("queueEnded", (player) => {
    try {
      const guildId = player.guild;
      const namespace_io = io.of(`/guild/${guildId}`);
      namespace_io.to("pona! music").emit('queue_ended' as GuildEvents);
    } catch { return; }
  });

  io_guild.use(async (socket, next) => {
    try {
      trafficDebugger(socket);
      const guildId = socket.nsp.name.split('/')[2];
      const authorization = socket.handshake.headers.authorization;
      const accesstoken_type = socket.handshake.auth["type"];
      const accesstoken_key = socket.handshake.auth["key"];
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
    } catch { return; }
  });

  io_guild.on("connection", async (socket) => {
    try {
      const guildId = socket.nsp.name.split('/')[2];
      socket.join("pona! music");
      socket.join(`stream:${socket.data.member.id}`);
      const playerState = await getHTTP_PlayerState(guildId);
      let newPlayerState: HTTP_PonaCommonStateWithTracks | undefined
      if ( playerState?.current && playerState?.queue )
      {
        newPlayerState = {
          ...playerState,
          queue: ([ playerState.queue.current, ...playerState.queue ] as Queue),
        }
      }
      const member = await self.client.guilds.cache.get(guildId)?.members.fetch(socket.data.member.id);
      const memberVC = member?.voice.channel;
      const data : {
        pona: HTTP_PonaCommonStateWithTracks | null;
        isMemberInVC: VoiceBasedChannel | null;
      } = {
        pona: newPlayerState || playerState,
        isMemberInVC: memberVC || null
      }
      socket.emit("handshake", Buffer.from(JSON.stringify(data), 'utf-8').toString('base64'));
      socket.on("join", async (guildId: string, voiceBasedChannelId: string)=>{ try {
          if ( !lavalink.manager.useableNodes.connected ) return;
          if ( member && (await fetchIsUserInVoiceChannel(guildId, member.id)) )
          connectToVoiceChannelBySocket(guildId, voiceBasedChannelId);
        } catch { return; }
      });
      socket.on("repeat", async (type: 'none' | 'track' | 'queue', callback)=>{ try{
        if ( !member || !type || !(await fetchIsUserInSameVoiceChannel(guildId, member.id)) ) return callback?callback({status: "error"}):false;
        const player = await isPonaInVoiceChannel(guildId);
        if ( !player ) return callback?callback({status: "error"}):false;
        let repeatType: typeof type = 'none';
        switch ( type ) {
          case 'track':
            player.setTrackRepeat(true);
            repeatType = 'track';
            break;
          case 'queue':
            player.setQueueRepeat(true);
            repeatType = 'queue';
            break;
          default:
            player.setTrackRepeat(false);
            repeatType = 'none';
            break;
        }
        if ( callback ) callback({
          status: "ok"
        });
        events.pona_action('repeat', member.id, repeatType, guildId, player.voiceChannel || '');
        } catch { return callback?callback({status: "error"}):false; }
      });
      socket.on("move", async (from: number, to: number, callback)=>{try{
        if ( !member || !(await fetchIsUserInSameVoiceChannel(guildId, member.id)) ) return callback?callback({status: "error"}):false;
        const player = await isPonaInVoiceChannel(guildId);
        if ( !player ) return callback?callback({status: "error"}):false;
        console.log("Moving!", from, to);
        io_guild.to("pona! music").emit("queue_updating");
        setTimeout(async () => {
          try {
            player.queue.move(from, to);
            if ( callback ) callback({
              status: "ok"
            });
          } catch (e) {
            console.log("Error While moving track: ", e);
            if ( callback ) callback({
              status: "error"
            });
            try {
              io_guild.to("pona! music").emit('queue_updated' as GuildEvents, Buffer.from(JSON.stringify(player.queue), 'utf-8').toString('base64'));
            } catch (e) {
              console.error("Failed to emit queue_updated", e);
              return callback?callback({status: "error"}):false;
            }
          }
          io_guild.emit("track_moved", Buffer.from(JSON.stringify(member), 'utf-8').toString('base64'));
          events.pona_action('queue-move', member.id, `from ${from} to ${to}`, guildId, player.voiceChannel || '');
        }, 320);
        } catch { return callback?callback({status: "error"}):false; }
      });
      socket.on("pause", async (callback)=>{try{
        if ( !member || !(await fetchIsUserInSameVoiceChannel(guildId, member.id)) ) return callback?callback({status: "error"}):false;
        const player = await isPonaInVoiceChannel(guildId);
        if ( !player ) return callback?callback({status: "error"}):false;
        player.pause(true);
        if ( callback ) callback({
          status: "ok"
        });
        events.pona_action('pause', member.id, 'true', guildId, player.voiceChannel || '');
        } catch { return callback?callback({status: "error"}):false; }
      });
      socket.on("seek", async (position: number, callback)=>{try{
        if ( !member || !(await fetchIsUserInSameVoiceChannel(guildId, member.id)) ) return callback?callback({status: "error"}):false;
        const player = await isPonaInVoiceChannel(guildId);
        if ( !player ) return callback?callback({status: "error"}):false;
        player.seek(position);
        player.pause(false);
        if ( callback ) callback({
          status: "ok"
        });
        events.pona_action('seek', member.id, position, guildId, player.voiceChannel || '');
        } catch { return callback?callback({status: "error"}):false; }
      });
      socket.on("skipto", async (index: number, callback)=>{try{
        if ( !member || !(await fetchIsUserInSameVoiceChannel(guildId, member.id)) || !Number(index) ) return callback?callback({status: "error"}):false;
        const player = await isPonaInVoiceChannel(guildId);
        if ( !player ) return callback?callback({status: "error"}):false;
        player.skipto(index);
        player.pause(false);
        if ( callback ) callback({
          status: "ok"
        });
        events.pona_action('skipto', member.id, index, guildId, player.voiceChannel || '');
        } catch { return callback?callback({status: "error"}):false; }
      });
      socket.on("rm", async (uniqueId: string, callback)=>{try{
        if ( !member || !(await fetchIsUserInSameVoiceChannel(guildId, member.id)) || !String(uniqueId) ) return callback?callback({status: "error"}):false;
        const player = await isPonaInVoiceChannel(guildId);
        if ( !player ) return callback?callback({status: "error"}):false;
        const index = player.queue.findIndex((track) => track.uniqueId === uniqueId);
        if ( index === -1 ) return callback?callback({status: "error"}):false;
        io_guild.to("pona! music").emit("queue_updating");
        setTimeout(async () => {
          try {
            player.queue.remove(index);
            if ( callback ) callback({
              status: "ok"
            });
          } catch (e) {
            console.log("Error While removing track: ", e);
            if ( callback ) callback({
              status: "error"
            });
            try {
              io_guild.to("pona! music").emit('queue_updated' as GuildEvents, Buffer.from(JSON.stringify(player.queue), 'utf-8').toString('base64'));
            } catch (e) {
              console.error("Failed to emit queue_updated", e);
              return callback?callback({status: "error"}):false;
            }
          }
          io_guild.emit("track_removed", Buffer.from(JSON.stringify(member), 'utf-8').toString('base64'));
          events.pona_action('trackremove', member.id, uniqueId, guildId, player.voiceChannel || '');
        }, 320);
        } catch { return callback?callback({status: "error"}):false; }
      });
      socket.on("play", async (callback)=>{try{
        if ( !member || !(await fetchIsUserInSameVoiceChannel(guildId, member.id)) ) return callback?callback({status: "error"}):false;
        const player = await isPonaInVoiceChannel(guildId);
        if ( !player ) return callback?callback({status: "error"}):false;
        player.pause(false);
        if ( callback ) callback({
          status: "ok"
        });
        events.pona_action('pause', member.id, 'false', guildId, player.voiceChannel || '');
        } catch { return callback?callback({status: "error"}):false; }
      });
      socket.on("add", async (uri: string, searchengine: SearchPlatform, callback)=>{try{
        if ( !member || !(await fetchIsUserInSameVoiceChannel(guildId, member.id)) || !uri || !searchengine ) return callback?callback({status: "error"}):false;
        const player = await isPonaInVoiceChannel(guildId);
        if ( !player ) return callback?callback({status: "error"}):false;
          const track = await getSongs(uri, 'youtube music', member);
          if ( typeof track === 'string' ) return callback?callback({status: "error"}):false;
          addToQueue(track.tracks, player);
          if ( callback ) callback({
            status: "ok"
          });
          events.pona_action('trackadd', member.id, JSON.stringify(track), guildId, player.voiceChannel || '');
        } catch { return callback?callback({status: "error"}):false; }
      });
      socket.on("previous", async (callback)=>{try{
        if ( !member || !(await fetchIsUserInSameVoiceChannel(guildId, member.id)) ) return callback({
          status: "error"
        });
        const player = await isPonaInVoiceChannel(guildId);
        if ( !player || !player.queue.previous ) return callback?callback({status: "error"}):false;
        player.previous();
        player.pause(false);
        if ( callback ) callback({
          status: "ok"
        });
        events.pona_action('previous', member.id, 'true', guildId, player.voiceChannel || '');
        } catch { return callback?callback({status: "error"}):false; }
      });
      socket.on("next", async (callback)=>{try{
        if ( !member || !(await fetchIsUserInSameVoiceChannel(guildId, member.id)) ) return callback?callback({status: "error"}):false;
        const player = await isPonaInVoiceChannel(guildId);
        if ( !player || !(player.queue.length > 0) ) return callback({
          status: "error"
        });
        player.skipto(0);
        player.pause(false);
        if ( callback ) callback({
          status: "ok"
        });
        events.pona_action('next', member.id, 'true', guildId, player.voiceChannel || '');
        } catch { return callback?callback({status: "error"}):false; }
      });
    } catch { return; }
  });
}