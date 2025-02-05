import { Server } from "socket.io";
import eventManager from '@/events';
import { discordClient as self } from '@/index';
import { fetchUserByOAuth, fetchUserByOAuthAccessToken } from "@/utils/oauth";
import trafficDebugger from "@/server/middlewares/socket/trafficDebugger";
import { HTTP_PonaRepeatState } from "@/interfaces/player";
import { getHTTP_PlayerState } from "@/utils/player/httpReq";

export type GuildEvents =
  'player_created'      |
  'player_destroyed'    |
  'pause_updated'       |
  'volume_updated'      |
  'autoplay_updated'    |
  'repeat_updated'      |
  'track_started'       |
  'track_updated'       |
  'channel_updated'     |
  'connection_updated'  |
  'queue_updated'       |
  'queue_ended'         ;

export default async function dynamicGuildNamespace(io: Server) {
  const io_guild = io.of(/^\/guild\/\d+$/);
  const events = new eventManager();

  events.registerHandler("trackStart", (player, track) => {
    const guildId = player.guild;
    const namespace_io = io.of(`/guild/${guildId}`);
    namespace_io.to("pona! music").emit('track_started' as GuildEvents, track);
  });

  events.registerHandler("playerStateUpdate", (oldPlayer, newPlayer, changeType) => {
    const guildId = oldPlayer.options.guild || newPlayer.options.guild;
    const namespace_io = io.of(`/guild/${guildId}`);
    switch (changeType) {
      case 'channelChange':
        namespace_io.to("pona! music").emit('channel_updated' as GuildEvents, newPlayer.voiceChannel);
        break;
      case 'queueChange':
        namespace_io.to("pona! music").emit('queue_updated' as GuildEvents, newPlayer.queue);
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
      case 'playerCreate':
        namespace_io.to("pona! music").emit('player_created' as GuildEvents, getHTTP_PlayerState(guildId));
        break;
      case 'playerDestroy':
        namespace_io.to("pona! music").emit('player_destroyed' as GuildEvents);
        break;
      default:
        namespace_io.to("pona! music").emit('unknown_updated' as GuildEvents);
        break;
    }
  });

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
    next();
  });

  io_guild.on("connection", async (socket) => {
    const guildId = socket.nsp.name.split('/')[2];
    socket.join("pona! music");
    const playerState = getHTTP_PlayerState(guildId);
    socket.emit("handshake", playerState);
  });
}