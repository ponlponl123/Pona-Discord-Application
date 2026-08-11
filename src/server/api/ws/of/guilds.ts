import { Server } from 'socket.io';
import { container } from '@/core/container';
import { fetchUserByOAuth, fetchUserByOAuthAccessToken } from '@/utils/oauth';
import trafficDebugger from '@/server/middlewares/socket/trafficDebugger';
import register from '../register';
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
import { VoiceBasedChannel, VoiceState, GuildMember } from 'discord.js';
import joinChannel from '@/utils/player/joinVoiceChannelAsPlayer';
import leaveVoiceChannelAsPlayer from '@/utils/player/leaveVoiceChannelAsPlayer';
import addToQueue from '@/utils/player/addToQueue';
import { Player, Queue } from '@/lavalink';
import {
  fetchIsUserInSameVoiceChannel,
  fetchIsUserInVoiceChannel,
} from '@/utils/isUserIsInVoiceChannel';
import { config as expressConfig } from '@/config/express';
import getSongs from '@/utils/player/getSongs';
import { getGuildLanguage } from '@/utils/i18n';
import { ensureTrackArtist } from '@/lavalink/structures/utils';

type GuildEvents =
  | 'state_updated'
  | 'track_started'
  | 'track_updated'
  | 'track_pos_updated'
  | 'pause_updated'
  | 'queue_updated'
  | 'repeat_updated'
  | 'member_state_updated';

function encodeData(data: unknown): string {
  return Buffer.from(JSON.stringify(data)).toString('base64');
}

const namespaces = new Map<string, Server>();

function emitToGuild(guildId: string, event: GuildEvents, payload: unknown, room: string = 'pona! music') {
  const io = (container.apiServer as any)?.io;
  if (!io) return;
  io.of(`/guild/${guildId}`).to(room).emit(event, payload);
  io.of(`/guilds/${guildId}`).to(room).emit(event, payload);
}

export async function sendHandshake(socket: any) {
  try {
    const match = socket.nsp.name.match(/^\/(?:guild|guilds)\/([0-9]+)$/);
    const guildId = match ? match[1] : null;

    let isMemberInVC = null;
    let { type, key } = socket.handshake.auth || {};

    if (type === 'undefined' || type === 'null') type = undefined;
    if (key === 'undefined' || key === 'null') key = undefined;

    if (type && key && guildId) {
      const user: any = await fetchUserByOAuthAccessToken(type, key).catch(() => null);
      if (user?.id) {
        const guild =
          container.pona.client.guilds.cache.get(guildId) ||
          (await container.pona.client.guilds.fetch(guildId).catch(() => null));
        if (guild) {
          const voiceState = guild.voiceStates.cache.get(user.id);
          let vc = voiceState?.channel;
          if (!vc) {
            const member = await guild.members.fetch(user.id).catch(() => null);
            vc = member?.voice?.channel || null;
          }
          if (vc) {
            isMemberInVC = {
              id: vc.id,
              name: vc.name,
              type: vc.type,
              userLimit: (vc as any).userLimit ?? 0,
            };
          }
        }
      }
    }

    const ponaState = guildId ? await getHTTP_PlayerState(guildId) : null;
    const handshakePayload = {
      pona: ponaState,
      isMemberInVC,
    };

    socket.emit('handshake', encodeData(handshakePayload));
  } catch (err) {
    console.error('Handshake error on WS connection:', err);
  }
}

export default function setupGuildWS(ioInstance?: Server) {
  const self = container.pona;
  const events = container.eventManager;

  const io = ioInstance || (container.apiServer as any)?.io;
  if (io) {
    const dynamicGuildRegexp = /^\/(?:guild|guilds)\/([0-9]+)$/;
    io.of(dynamicGuildRegexp).on('connection', async (socket: any) => {
      socket.join('pona! music');
      socket.join('pona! voice');
      register(socket);

      await sendHandshake(socket);

      socket.on('sync', async () => {
        await sendHandshake(socket);
      });
      socket.on('handshake', async () => {
        await sendHandshake(socket);
      });

      // 1. Join Voice Channel
      socket.on('join', async (guildIdParam?: string, voiceChannelIdParam?: string) => {
        try {
          const match = socket.nsp.name.match(/^\/(?:guild|guilds)\/([0-9]+)$/);
          const guildId =
            typeof guildIdParam === 'string' && /^\d+$/.test(guildIdParam)
              ? guildIdParam
              : match
                ? match[1]
                : null;
          if (!guildId) return;

          const guild = container.pona.client.guilds.cache.get(guildId);
          if (!guild) return;

          let targetVoiceChannel =
            typeof voiceChannelIdParam === 'string' && /^\d+$/.test(voiceChannelIdParam)
              ? guild.channels.cache.get(voiceChannelIdParam)
              : null;

          if (!targetVoiceChannel) {
            const { type, key } = socket.handshake.auth || {};
            if (type && key) {
              const user: any = await fetchUserByOAuthAccessToken(type, key);
              if (user?.id) {
                const member = await guild.members.fetch(user.id).catch(() => null);
                if (member?.voice?.channel) {
                  targetVoiceChannel = member.voice.channel;
                }
              }
            }
          }

          if (!targetVoiceChannel || !targetVoiceChannel.isVoiceBased()) return;

          const textChannel =
            guild.systemChannel ||
            guild.channels.cache.find(
              (ch) =>
                ch.isTextBased() &&
                ch.permissionsFor(guild.members.me!)?.has('SendMessages'),
            ) ||
            (targetVoiceChannel as any);

          const player = await joinChannel(
            textChannel as any,
            targetVoiceChannel as VoiceBasedChannel,
            guild,
          );

          if (player) {
            const ponaState = (await getHTTP_PlayerState(guildId)) || convertTo_HTTPPlayerState(player);
            socket.emit('player_created', encodeData(ponaState));
            emitToGuild(guildId, 'state_updated', encodeData(ponaState), 'pona! music');
          }
        } catch (err) {
          console.error('Error handling join socket event:', err);
        }
      });

      // 2. Play (Resume)
      socket.on('play', async (cb?: (res: any) => void) => {
        const match = socket.nsp.name.match(/^\/(?:guild|guilds)\/([0-9]+)$/);
        const guildId = match ? match[1] : null;
        if (!guildId) {
          if (typeof cb === 'function') cb({ status: 'error', message: 'No guild ID' });
          return;
        }
        const player = container.lavalink.manager.get(guildId);
        if (player) {
          await player.pause(false);
          emitToGuild(guildId, 'state_updated', encodeData(await getHTTP_PlayerState(guildId)), 'pona! music');
          if (typeof cb === 'function') cb({ status: 'ok' });
        } else {
          if (typeof cb === 'function') cb({ status: 'error', message: 'No active player' });
        }
      });

      // 3. Pause
      socket.on('pause', async (cb?: (res: any) => void) => {
        const match = socket.nsp.name.match(/^\/(?:guild|guilds)\/([0-9]+)$/);
        const guildId = match ? match[1] : null;
        if (!guildId) {
          if (typeof cb === 'function') cb({ status: 'error', message: 'No guild ID' });
          return;
        }
        const player = container.lavalink.manager.get(guildId);
        if (player) {
          await player.pause(true);
          emitToGuild(guildId, 'state_updated', encodeData(await getHTTP_PlayerState(guildId)), 'pona! music');
          if (typeof cb === 'function') cb({ status: 'ok' });
        } else {
          if (typeof cb === 'function') cb({ status: 'error', message: 'No active player' });
        }
      });

      // 4. Next / Skip
      socket.on('next', async (cb?: (res: any) => void) => {
        const match = socket.nsp.name.match(/^\/(?:guild|guilds)\/([0-9]+)$/);
        const guildId = match ? match[1] : null;
        if (!guildId) {
          if (typeof cb === 'function') cb({ status: 'error', message: 'No guild ID' });
          return;
        }
        const player = container.lavalink.manager.get(guildId);
        if (player) {
          await player.stop();
          if (typeof cb === 'function') cb({ status: 'ok' });
        } else {
          if (typeof cb === 'function') cb({ status: 'error', message: 'No active player' });
        }
      });

      // 5. Previous
      socket.on('previous', async (cb?: (res: any) => void) => {
        const match = socket.nsp.name.match(/^\/(?:guild|guilds)\/([0-9]+)$/);
        const guildId = match ? match[1] : null;
        if (!guildId) {
          if (typeof cb === 'function') cb({ status: 'error', message: 'No guild ID' });
          return;
        }
        const player = container.lavalink.manager.get(guildId);
        if (player) {
          if (player.position > 5000) {
            await player.seek(0);
          } else if (player.queue.previous) {
            player.queue.add([player.queue.previous, ...player.queue]);
            await player.stop();
          }
          if (typeof cb === 'function') cb({ status: 'ok' });
        } else {
          if (typeof cb === 'function') cb({ status: 'error', message: 'No active player' });
        }
      });

      // 6. Skipto
      socket.on('skipto', async (index: number | string, cb?: (res: any) => void) => {
        const match = socket.nsp.name.match(/^\/(?:guild|guilds)\/([0-9]+)$/);
        const guildId = match ? match[1] : null;
        if (!guildId) {
          if (typeof cb === 'function') cb({ status: 'error', message: 'No guild ID' });
          return;
        }
        const targetIndex = typeof index === 'string' ? parseInt(index, 10) : index;
        const player = container.lavalink.manager.get(guildId);
        if (player && typeof targetIndex === 'number' && !isNaN(targetIndex) && targetIndex >= 0 && targetIndex < player.queue.length) {
          player.skipto(targetIndex);
          const statePayload = await getHTTP_PlayerState(guildId);
          emitToGuild(guildId, 'state_updated', encodeData(statePayload));
          if (typeof cb === 'function') cb({ status: 'ok' });
        } else {
          if (typeof cb === 'function') cb({ status: 'error', message: 'Invalid track index or no player' });
        }
      });

      // 7. Seek
      socket.on('seek', async (val: number, cb?: (res: any) => void) => {
        const match = socket.nsp.name.match(/^\/(?:guild|guilds)\/([0-9]+)$/);
        const guildId = match ? match[1] : null;
        if (!guildId) {
          if (typeof cb === 'function') cb({ status: 'error', message: 'No guild ID' });
          return;
        }
        const player = container.lavalink.manager.get(guildId);
        if (player && typeof val === 'number') {
          const durationMs = (player.queue.current?.duration as number) || 0;
          // If val is passed in seconds (e.g. 35s when duration is 180,000ms), convert to ms; otherwise val is already in ms.
          const posMs =
            durationMs > 0 && val > 0 && val <= Math.ceil(durationMs / 1000)
              ? Math.floor(val * 1000)
              : Math.floor(val);

          await player.seek(posMs);
          const ponaState = await getHTTP_PlayerState(guildId);
          emitToGuild(guildId, 'state_updated', encodeData(ponaState), 'pona! music');
          if (typeof cb === 'function') cb({ status: 'ok' });
        } else {
          if (typeof cb === 'function') cb({ status: 'error', message: 'Invalid position or no player' });
        }
      });

      // 7b. Repeat / Loop
      socket.on(
        'repeat',
        async (
          mode: string | ((res: any) => void),
          cbArg?: (res: any) => void,
        ) => {
          const cb = typeof mode === 'function' ? mode : cbArg;
          const repeatMode = typeof mode === 'string' ? mode : 'none';
          const match = socket.nsp.name.match(/^\/(?:guild|guilds)\/([0-9]+)$/);
          const guildId = match ? match[1] : null;
          if (!guildId) {
            if (typeof cb === 'function') cb({ status: 'error', message: 'No guild ID' });
            return;
          }
          const player = container.lavalink.manager.get(guildId);
          if (player) {
            if (repeatMode === 'track') {
              player.setTrackRepeat(true);
            } else if (repeatMode === 'queue') {
              player.setQueueRepeat(true);
            } else if (repeatMode === 'off' || repeatMode === 'none') {
              player.setTrackRepeat(false);
            }
            const repeatData: HTTP_PonaRepeatState = {
              track: player.trackRepeat,
              queue: player.queueRepeat,
              dynamic: player.dynamicRepeat,
            };
            emitToGuild(guildId, 'repeat_updated', encodeData(repeatData), 'pona! music');
            if (typeof cb === 'function') cb({ status: 'ok' });
          } else {
            if (typeof cb === 'function') cb({ status: 'error', message: 'No active player' });
          }
        },
      );

      // 8. Add track
      socket.on(
        'add',
        async (
          uri: string,
          arg2?: string | ((res: any) => void),
          arg3?: (res: any) => void,
        ) => {
          const cb = typeof arg2 === 'function' ? arg2 : typeof arg3 === 'function' ? arg3 : undefined;
          const sourceName = typeof arg2 === 'string' ? arg2 : 'pona! search';
          try {
            const match = socket.nsp.name.match(/^\/(?:guild|guilds)\/([0-9]+)$/);
            const guildId = match ? match[1] : null;
            if (!guildId || !uri) {
              if (typeof cb === 'function') cb({ status: 'error', message: 'Invalid arguments' });
              return;
            }

            let player = container.lavalink.manager.get(guildId);
            if (!player) {
              const guild = container.pona.client.guilds.cache.get(guildId);
              const { type, key } = socket.handshake.auth || {};
              if (type && key && guild) {
                const user: any = await fetchUserByOAuthAccessToken(type, key);
                if (user?.id) {
                  const member = await guild.members.fetch(user.id).catch(() => null);
                  if (member?.voice?.channel) {
                    const textChannel =
                      guild.systemChannel ||
                      guild.channels.cache.find(
                        (ch) =>
                          ch.isTextBased() &&
                          ch.permissionsFor(guild.members.me!)?.has('SendMessages'),
                      ) ||
                      (member.voice.channel as any);

                    player = await joinChannel(textChannel as any, member.voice.channel, guild);
                  }
                }
              }
            }

            if (!player) {
              if (typeof cb === 'function') cb({ status: 'error', message: 'No voice connection' });
              return;
            }

            const user: any = socket.handshake.auth?.key
              ? await fetchUserByOAuthAccessToken(
                socket.handshake.auth.type,
                socket.handshake.auth.key,
              ).catch(() => null)
              : null;

            const member = user?.id && player?.guild
              ? await container.pona.client.guilds.cache.get(player.guild)?.members.fetch(user.id).catch(() => null)
              : null;

            const result = await getSongs(uri, (sourceName || 'pona! search') as any, member as GuildMember);
            if (typeof result !== 'string' && result.tracks && result.tracks.length > 0) {
              await addToQueue(result.tracks, player);
              if (typeof cb === 'function') cb({ status: 'ok' });
              emitToGuild(guildId, 'queue_updated', encodeData(player.queue), 'pona! music');
              emitToGuild(guildId, 'state_updated', encodeData(await getHTTP_PlayerState(guildId)), 'pona! music');
            } else {
              if (typeof cb === 'function') cb({ status: 'error', message: 'Track not found' });
            }
          } catch (err: any) {
            if (typeof cb === 'function') cb({ status: 'error', message: err?.message || 'Error adding track' });
          }
        },
      );

      // 9. Add playlist
      socket.on('add-playlist', async (tracks: string[], metadata: any, cb?: (res: any) => void) => {
        try {
          const match = socket.nsp.name.match(/^\/(?:guild|guilds)\/([0-9]+)$/);
          const guildId = match ? match[1] : null;
          if (!guildId || !Array.isArray(tracks) || !tracks.length) {
            if (typeof cb === 'function') cb({ status: 'error', message: 'Invalid parameters' });
            return;
          }

          let player = container.lavalink.manager.get(guildId);
          if (!player) {
            const guild = container.pona.client.guilds.cache.get(guildId);
            const { type, key } = socket.handshake.auth || {};
            if (type && key && guild) {
              const user: any = await fetchUserByOAuthAccessToken(type, key);
              if (user?.id) {
                const member = await guild.members.fetch(user.id).catch(() => null);
                if (member?.voice?.channel) {
                  const textChannel =
                    guild.systemChannel ||
                    guild.channels.cache.find(
                      (ch) =>
                        ch.isTextBased() &&
                        ch.permissionsFor(guild.members.me!)?.has('SendMessages'),
                    ) ||
                    (member.voice.channel as any);

                  player = await joinChannel(textChannel as any, member.voice.channel, guild);
                }
              }
            }
          }

          if (!player) {
            if (typeof cb === 'function') cb({ status: 'error', message: 'No voice connection' });
            return;
          }

          const user: any = socket.handshake.auth?.key
            ? await fetchUserByOAuthAccessToken(
              socket.handshake.auth.type,
              socket.handshake.auth.key,
            ).catch(() => null)
            : null;

          const member = user?.id && player?.guild
            ? await container.pona.client.guilds.cache.get(player.guild)?.members.fetch(user.id).catch(() => null)
            : null;

          const loadedTracks: any[] = [];
          for (const trackUri of tracks) {
            const result = await getSongs(trackUri, 'pona! search', member as GuildMember);
            if (typeof result !== 'string' && result.tracks && result.tracks.length > 0) {
              loadedTracks.push(result.tracks[0]);
            }
          }

          if (loadedTracks.length > 0) {
            await addToQueue(loadedTracks, player);
            if (typeof cb === 'function') cb({ status: 'ok' });
            emitToGuild(guildId, 'queue_updated', encodeData(player.queue), 'pona! music');
            emitToGuild(guildId, 'state_updated', encodeData(await getHTTP_PlayerState(guildId)), 'pona! music');
          } else {
            if (typeof cb === 'function') cb({ status: 'error', message: 'No valid tracks loaded' });
          }
        } catch (err: any) {
          if (typeof cb === 'function') cb({ status: 'error', message: err?.message || 'Error adding playlist' });
        }
      });

      // 10. Remove track (rm)
      socket.on('rm', async (uniqueId: string, cb?: (res: any) => void) => {
        const match = socket.nsp.name.match(/^\/(?:guild|guilds)\/([0-9]+)$/);
        const guildId = match ? match[1] : null;
        if (!guildId) return;
        const player = container.lavalink.manager.get(guildId);
        if (player) {
          const index = player.queue.findIndex(
            (t: any) => t.uniqueId === uniqueId || t.identifier === uniqueId,
          );
          if (index !== -1) {
            player.queue.remove(index);
            emitToGuild(guildId, 'queue_updated', encodeData(player.queue), 'pona! music');
            if (typeof cb === 'function') cb({ status: 'ok' });
            return;
          }
        }
        if (typeof cb === 'function') cb({ status: 'error', message: 'Track not found' });
      });

      // 11. Move track in queue
      socket.on(
        'move',
        async (
          oldIndex: number,
          newIndex: number,
          cb?: (res: any) => void,
        ) => {
          const match = socket.nsp.name.match(/^\/(?:guild|guilds)\/([0-9]+)$/);
          const guildId = match ? match[1] : null;
          if (!guildId) {
            if (typeof cb === 'function') cb({ status: 'error', message: 'No guild ID' });
            return;
          }
          const player = container.lavalink.manager.get(guildId);
          if (
            player &&
            typeof oldIndex === 'number' &&
            typeof newIndex === 'number' &&
            oldIndex >= 0 &&
            oldIndex < player.queue.length &&
            newIndex >= 0 &&
            newIndex < player.queue.length
          ) {
            const track = player.queue[oldIndex];
            player.queue.splice(oldIndex, 1);
            player.queue.splice(newIndex, 0, track);
            emitToGuild(guildId, 'queue_updated', encodeData(player.queue), 'pona! music');
            if (typeof cb === 'function') cb({ status: 'ok' });
          } else {
            if (typeof cb === 'function') cb({ status: 'error', message: 'Invalid indices or no player' });
          }
        },
      );

      // 12. Volume
      socket.on('volume', async (vol: number, cb?: (res: any) => void) => {
        const match = socket.nsp.name.match(/^\/(?:guild|guilds)\/([0-9]+)$/);
        const guildId = match ? match[1] : null;
        if (!guildId) {
          if (typeof cb === 'function') cb({ status: 'error', message: 'No guild ID' });
          return;
        }
        const player = container.lavalink.manager.get(guildId);
        if (player && typeof vol === 'number') {
          player.setVolume(vol);
          emitToGuild(guildId, 'state_updated', encodeData(await getHTTP_PlayerState(guildId)), 'pona! music');
          if (typeof cb === 'function') cb({ status: 'ok' });
        } else {
          if (typeof cb === 'function') cb({ status: 'error', message: 'Invalid volume or no player' });
        }
      });

      // 13. Leave / Destroy
      socket.on('leave', async (cb?: (res: any) => void) => {
        const match = socket.nsp.name.match(/^\/(?:guild|guilds)\/([0-9]+)$/);
        const guildId = match ? match[1] : null;
        if (!guildId) {
          if (typeof cb === 'function') cb({ status: 'error', message: 'No guild ID' });
          return;
        }
        const player = container.lavalink.manager.get(guildId);
        if (player) {
          await leaveVoiceChannelAsPlayer(guildId);
          emitToGuild(guildId, 'state_updated', encodeData(null), 'pona! music');
          if (typeof cb === 'function') cb({ status: 'ok' });
        } else {
          if (typeof cb === 'function') cb({ status: 'error', message: 'No active player' });
        }
      });
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

      const isUserJoined = oldState?.channel === undefined && newState?.channel !== undefined;
      const isUserSwitched = oldState?.channel !== undefined && newState?.channel !== undefined && oldState?.channel?.id !== newState?.channel?.id;
      const isUserLeaved = oldState?.channel !== undefined && newState?.channel === undefined;
      const isSameVC = guildId && memberId ? await fetchIsUserInVoiceChannel(guildId, memberId) : false;

      const formatVC = (ch: any) =>
        ch
          ? {
            id: ch.id,
            name: ch.name,
            type: ch.type,
            userLimit: ch.userLimit ?? 0,
          }
          : null;

      const data: MemberVoiceChangedState = {
        oldVC: formatVC(oldState?.channel) as any,
        newVC: formatVC(newState?.channel) as any,
        isUserJoined,
        isUserSwitched,
        isUserLeaved,
        isSameVC: !!isSameVC,
      };

      emitToGuild(guildId, 'member_state_updated', encodeData(data), 'pona! voice');
    } catch {
      return;
    }
  });

  events.registerHandler('playerStateUpdate', async (oldPlayer, newPlayer, changeType) => {
    if (!newPlayer || !newPlayer.guild) return;
    const data = await getHTTP_PlayerState(newPlayer.guild);
    emitToGuild(newPlayer.guild, 'state_updated', encodeData(data), 'pona! music');

    if (changeType === 'pauseChange' || changeType === 'connectionChange') {
      const isPaused = newPlayer.paused ? 1 : 0;
      emitToGuild(newPlayer.guild, 'pause_updated', isPaused, 'pona! music');
    }

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

  events.registerHandler('trackPos', async (guildId, pos) => {
    emitToGuild(guildId, 'track_pos_updated', pos, 'pona! music');
  });

  events.registerHandler('trackStart', async (player, track) => {
    if (!player || !player.guild) return;
    await ensureTrackArtist(track);
    emitToGuild(player.guild, 'track_started', encodeData(track), 'pona! music');
    emitToGuild(player.guild, 'queue_updated', encodeData([track, ...player.queue]), 'pona! music');

    let cachedLyrics: Lyric | null = null;

    if (container.redis?.redis) {
      const value = await container.redis.redis.get(
        `yt:lyrics:${track.identifier}`,
      );
      if (value) {
        cachedLyrics = JSON.parse(value) as Lyric;
        track.lyrics = cachedLyrics;
        emitToGuild(player.guild, 'track_updated', encodeData(track), 'pona! music');
        if (cachedLyrics.isTimestamp) return;
      }
    }

    try {
      const requesterId =
        (typeof track.requester === 'string'
          ? track.requester
          : (track.requester as any)?.id || (track.requester as any)?.user?.id) || '';
      const fetchLyricByInternalAPI = await fetch(
        `http://localhost:${expressConfig.EXPRESS_PORT}/v1/music/lyrics?v=${track.identifier}&title=${encodeURIComponent(track.cleanTitle)}&author=${encodeURIComponent(track.cleanAuthor)}&duration=${track.duration}&engine=dynamic&uid=${encodeURIComponent(requesterId)}`,
        {
          headers: {
            Authorization: `Pona! ${expressConfig.EXPRESS_SECRET_API_KEY || ''}`,
          },
        },
      );
      if (fetchLyricByInternalAPI.ok) {
        const freshLyrics = (await fetchLyricByInternalAPI.json()) as Lyric;
        if (!cachedLyrics || freshLyrics.isTimestamp) {
          track.lyrics = freshLyrics;
          emitToGuild(player.guild, 'track_updated', encodeData(track), 'pona! music');
          if (container.redis?.redis)
            container.redis.redis.setex(
              `yt:lyrics:${track.identifier}`,
              10800,
              JSON.stringify(track.lyrics),
            );
        }
      } else if (fetchLyricByInternalAPI.status === 404 && !cachedLyrics && container.redis?.redis)
        container.redis.redis.setex(`yt:lyrics:${track.identifier}`, 3600, '');
    } catch {
      console.log('failed to fetch lyrics');
    }
  });

  events.registerHandler('clientReady', async () => {
    const io = (container.apiServer as any)?.io;
    if (!io) return;
    const dynamicGuildRegexp = /^\/(?:guild|guilds)\/([0-9]+)$/;
    const nsps = io._nsps || io.sockets?.nsp;
    if (nsps) {
      for (const [nspName, nsp] of nsps.entries()) {
        if (dynamicGuildRegexp.test(nspName)) {
          for (const socket of nsp.sockets.values()) {
            sendHandshake(socket).catch(() => { });
          }
        }
      }
    }
  });
}
