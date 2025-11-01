import { Elysia } from 'elysia';
import { HttpStatusCode } from 'axios';
import { discordClient as discord } from '@/index';
import isPonaInVoiceChannel from '@/utils/isPonaInVoiceChannel';

export default new Elysia().get('/player/:guildid', async ({ params, set }) => {
  try {
    const { guildid } = params;
    if (!guildid) {
      set.status = HttpStatusCode.BadRequest;
      return { error: 'Missing guildId' };
    }
    const guild = discord.client.guilds.cache.get(guildid);
    if (!guild) {
      set.status = HttpStatusCode.NotFound;
      return { error: 'Guild not found' };
    }
    const player = await isPonaInVoiceChannel(guildid);
    if (player) {
      const duration: number = player.queue.current?.duration || 0;
      const textChannel = guild.channels.cache.get(
        player.textChannel as string,
      );
      const voiceChannel = guild.channels.cache.get(
        player.voiceChannel as string,
      );
      set.status = HttpStatusCode.Ok;
      return {
        message: 'OK',
        state: player.state,
        volume: player.volume,
        paused: player.paused,
        playing: player.playing,
        isAutoplay: player.isAutoplay,
        equalizer: player.filters.equalizer,
        track: {
          position: player.position,
          length: duration,
          percentage: duration && (player.position * 100) / duration,
        },
        repeat: {
          track: player.trackRepeat,
          queue: player.queueRepeat,
        },
        textChannel: textChannel,
        voiceChannel: voiceChannel,
        current: player.queue.current,
      };
    }
    set.status = HttpStatusCode.NoContent;
    return { error: 'No player active' };
  } catch {
    set.status = HttpStatusCode.InternalServerError;
    return { error: 'Internal Server Error' };
  }
});
