import Elysia from 'elysia';
import cluster from './cluster';
import guild from './guild';
import guilds from './guilds';
import player from './player';
import playlist from './playlist';
import queue from './queue';
import lavalink_handshake from './lavalink/handshake';
import music_fetch from './music/fetch';
import music_history from './music/history';
import music_lyrics from './music/lyrics';
import music_search from './music/search';
import proxy_ytThumbnail from './proxy/yt-thumbnail';
import socket_handshake from './socket/handshake';
import channel_subscribe from './channel/subscribe';
import redis_handshake from './redis/handshake';
import music_favorite from './music/favorite';

export const lavalink = new Elysia({ prefix: '/lavalink' }).use(
  lavalink_handshake,
);
export const proxy = new Elysia({ prefix: '/proxy' }).use(proxy_ytThumbnail);
export const socket = new Elysia({ prefix: '/socket' }).use(socket_handshake);
export const redis = new Elysia({ prefix: '/redis' }).use(redis_handshake);
export const channel = new Elysia({ prefix: '/channel' }).use(
  channel_subscribe,
);
export const music = new Elysia({ prefix: '/music' })
  .use(music_fetch)
  .use(music_search)
  .use(music_lyrics)
  .use(music_history)
  .use(music_favorite);

export default new Elysia({ prefix: '/v1' })
  .use(cluster)
  .use(guild)
  .use(guilds)
  .use(player)
  .use(playlist)
  .use(queue)
  .use(music)
  .use(lavalink)
  .use(proxy)
  .use(socket)
  .use(redis)
  .use(channel);
