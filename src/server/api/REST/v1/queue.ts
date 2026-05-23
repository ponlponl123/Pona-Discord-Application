import { Elysia, t } from 'elysia';
import { HttpStatusCode } from 'axios';
import { container } from '@/core/container';
import isPonaInVoiceChannel from '@/utils/isPonaInVoiceChannel';

export default new Elysia().get(
  '/queue/:guildid',
  async ({ params, set }) => {
    try {
      const { guildid } = params;
      if (!guildid) {
        set.status = HttpStatusCode.BadRequest;
        return { error: 'Missing guildId' };
      }
      const guild = container.pona.client.guilds.cache.get(guildid);
      if (!guild) {
        set.status = HttpStatusCode.NotFound;
        return { error: 'Guild not found' };
      }
      const player = await isPonaInVoiceChannel(guildid);
      if (player) {
        set.status = HttpStatusCode.Ok;
        return {
          message: 'OK',
          current: player.queue.current,
          queue: player.queue,
        };
      }
      set.status = HttpStatusCode.NoContent;
      return { error: 'No player active' };
    } catch {
      set.status = HttpStatusCode.InternalServerError;
      return { error: 'Internal Server Error' };
    }
  },
  {
    params: t.Object({
      guildid: t.String(),
    }),
  },
);
