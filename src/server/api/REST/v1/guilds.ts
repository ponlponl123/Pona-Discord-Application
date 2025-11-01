import { Elysia } from 'elysia';
import { HttpStatusCode } from 'axios';
import { discordClient as self } from '@/index';
import { Guild } from 'discord.js';

export default new Elysia().get('/guilds', ({ body, set }) => {
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
      // if (!self.client.guilds.cache.has(guild) ) {
      //   set.status = HttpStatusCode.NotFound;
      //   return { error: `Guild ${guild} not found` };
      // }
      const guildCache = self.client.guilds.cache.get(guild);
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
