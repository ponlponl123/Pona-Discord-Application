import { Server } from 'socket.io';
import { container } from '@/core/container';
import { fetchUserByOAuth, fetchUserByOAuthAccessToken } from '@/utils/oauth';
import trafficDebugger from '@/server/middlewares/socket/trafficDebugger';
import {
  HTTP_PonaCommonStateWithTracks,
  HTTP_PonaRepeatState,
  Lyric,
} from '@/interfaces/player';
import {
  convertTo_HTTPPlayerState,
  getHTTP_PlayerState,
} from '@/utils/player/httpReq';
import { MemberVoiceChangedState } from '@/interfaces/member';
import { VoiceBasedChannel, VoiceState } from 'discord.js';
import joinChannel from '@/utils/player/joinVoiceChannelAsPlayer';
import { Player, Queue } from '@/lavalink';
import {
  fetchIsUserInSameVoiceChannel,
  fetchIsUserInVoiceChannel,
} from '@/utils/isUserIsInVoiceChannel';
import { config as expressConfig } from '@/config/express';
import getSongs from '@/utils/player/getSongs';
import { getGuildLanguage } from '@/utils/i18n';
import axios from 'axios';

type GuildEvents =
  | 'state_updated'
  | 'track_started'
  | 'track_updated'
  | 'queue_updated'
  | 'repeat_updated'
  | 'member_voice_changed';

function encodeData(data: unknown): string {
  return JSON.stringify(data);
}

const namespaces = new Map<string, Server>();

function emitToGuild(guildId: string, event: GuildEvents, payload: unknown, room: string = 'pona! music') {
  const io = (container.apiServer as any)?.io;
  if (!io) return;
  io.of(`/guild/${guildId}`).to(room).emit(event, payload);
  io.of(`/guilds/${guildId}`).to(room).emit(event, payload);
}

export default function setupGuildWS() {
  const self = container.pona;
  const events = container.eventManager;

  const io = (container.apiServer as any)?.io;
  if (io) {
    const dynamicGuildRegexp = /^\/(?:guild|guilds)\/([0-9]+)$/;
    io.of(dynamicGuildRegexp).on('connection', (socket: any) => {
      socket.join('pona! music');
      socket.join('pona! voice');
      register(socket);
    });
  }

  events.registerHandler('voiceStateUpdate', async (type, oldState, newState) => {
    try {
      if (
        type === 'clientJoined' ||
        type === 'clientLeaved' ||
        type === 'clientSwitched'
      )
        return;
      const guildId = oldState?.guild.id || newState?.guild.id;
      if (!guildId) return;
      const memberId = oldState?.member?.id || newState?.member?.id;
      const namespace_io = getNamespace(guildId);
      
      const isUserJoined = oldState?.channel === undefined && newState?.channel !== undefined;
      const isUserSwitched = oldState?.channel !== undefined && newState?.channel !== undefined && oldState?.channel?.id !== newState?.channel?.id;
      const isUserLeaved = oldState?.channel !== undefined && newState?.channel === undefined;
      const isSameVC = guildId && memberId ? await fetchIsUserInVoiceChannel(guildId, memberId) : false;

      const data: MemberVoiceChangedState = {
        oldVC: (oldState?.channel as VoiceBasedChannel) || null,
        newVC: (newState?.channel as VoiceBasedChannel) || null,
        isUserJoined,
        isUserSwitched,
        isUserLeaved,
        isSameVC: !!isSameVC,
      };

      emitToGuild(guildId, 'member_voice_changed', encodeData(data), 'pona! voice');
    } catch {
      return;
    }
  });

  events.registerHandler('playerStateUpdate', async (oldPlayer, newPlayer, changeType) => {
    const data = await getHTTP_PlayerState(newPlayer.guild);
    emitToGuild(newPlayer.guild, 'state_updated', encodeData(data), 'pona! music');

    if (changeType === 'trackChange' || changeType === 'queueChange') {
      emitToGuild(newPlayer.guild, 'queue_updated', encodeData(newPlayer.queue), 'pona! music');
    }

    if (changeType === 'repeatChange') {
      const repeatData: HTTP_PonaRepeatState = {
        track: newPlayer.trackRepeat,
        queue: newPlayer.queueRepeat,
        dynamic: newPlayer.dynamicRepeat,
      };
      emitToGuild(newPlayer.guild, 'repeat_updated', encodeData(repeatData), 'pona! music');
    }
  });

  events.registerHandler('trackStart', async (player, track) => {
    emitToGuild(player.guild, 'track_started', encodeData(track), 'pona! music');
    emitToGuild(player.guild, 'queue_updated', encodeData([track, ...player.queue]), 'pona! music');

    if (container.redis?.redis) {
      const value = await container.redis.redis.get(
        `yt:lyrics:${track.identifier}`,
      );
      if (value) {
        track.lyrics = JSON.parse(value) as Lyric;
        emitToGuild(player.guild, 'track_updated', encodeData(track), 'pona! music');
        return;
      }
    }

    try {
      const fetchLyricByInternalAPI = await fetch(
        `http://localhost:${expressConfig.EXPRESS_PORT}/v1/music/lyrics?id=${track.identifier}`,
        {
          headers: {
            Authorization: `Pona! ${expressConfig.EXPRESS_SECRET_API_KEY || ''}`,
          },
        },
      );
      if (fetchLyricByInternalAPI.ok) {
        track.lyrics = (await fetchLyricByInternalAPI.json()) as Lyric;
        emitToGuild(player.guild, 'track_updated', encodeData(track), 'pona! music');
        if (container.redis?.redis)
          container.redis.redis.setex(
            `yt:lyrics:${track.identifier}`,
            10800,
            JSON.stringify(track.lyrics),
          );
      } else if (fetchLyricByInternalAPI.status === 404 && container.redis?.redis)
        container.redis.redis.setex(`yt:lyrics:${track.identifier}`, 3600, '');
    } catch {
      console.log('failed to fetch lyrics');
    }
  });
}
