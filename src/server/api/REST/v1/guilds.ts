import express from 'express';
import { HttpStatusCode } from 'axios';
import { discordClient as self } from '@/index';
import { Guild } from 'discord.js';

export function GET_PRIVATE(request: express.Request, response: express.Response) {
  try {
    const guilds = request.body

    if ( typeof guilds !== 'object' ) return response.status(HttpStatusCode.BadRequest).json({ error: 'Guilds is not object' });
    if ( !((guilds as Array<string>).length > 0) ) return response.status(HttpStatusCode.BadRequest).json({ error: 'Guilds is not array' });

    const guildWithPona: Guild[] = [];

    (guilds as Array<string>).forEach(guild => {
      // if (!self.client.guilds.cache.has(guild) ) return response.status(HttpStatusCode.NotFound).json({ error: `Guild ${guild} not found` });
      const guildCache = self.client.guilds.cache.get(guild);
      if (guildCache) guildWithPona.push(guildCache);
    })

    if ( !(guildWithPona.length > 0) )
      return response.status(HttpStatusCode.NotFound).json({
        message: 'Not Found'
      });

    return response.status(HttpStatusCode.Ok).json({
      message: 'OK',
      guilds: guildWithPona
    });
  } catch {
    return response.status(HttpStatusCode.InternalServerError).json({error: 'Internal Server Error'});
  }
}