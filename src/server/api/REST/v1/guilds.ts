import { Elysia } from 'elysia';
import { HttpStatusCode } from '@/types/http';
import { container } from '@/core/container';
import { Guild } from 'discord.js';

export default new Elysia().get('/guilds', ({ body, set }) => {
  const { pona } = container;
  try {
    const guilds = body;

    if (typeof guilds !== 'object') {
      set.status = HttpStatusCode.BadRequest;
      return { error: 'Guilds is not object' };
    }
    if (!((guilds as Array<string>).length > 0)) {
      set.status = HttpStatusCode.BadRequest;
      return { error: 'Guilds is not array' };
    }

    const guildWithPona: Guild[] = [];

    (guilds as Array<string>).forEach((guild) => {
      const guildCache = pona.client.guilds.cache.get(guild);
      if (guildCache) guildWithPona.push(guildCache);
    });

    if (guildWithPona.length === 0) {
      set.status = HttpStatusCode.NotFound;
      return {
        message: 'Not Found',
      };
    }

    set.status = HttpStatusCode.Ok;
    return {
      message: 'OK',
      guilds: guildWithPona,
    };
  } catch {
    set.status = HttpStatusCode.InternalServerError;
    return { error: 'Internal Server Error' };
  }
});
