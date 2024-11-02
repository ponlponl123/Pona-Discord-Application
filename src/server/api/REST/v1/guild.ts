import express from 'express';
import { HttpStatusCode } from 'axios';
import { discordClient as self } from '@/index';

export const path = '/:guildId?';

export function GET_PRIVATE(request: express.Request, response: express.Response) {
  const guildId = request.params.guildId

  if ( typeof guildId !== 'string' ) return response.status(HttpStatusCode.BadRequest).json({
    message: 'guildId is not a string',
  });

  const guild = self.client.guilds.cache.get(guildId);

  if ( !guild ) return response.status(HttpStatusCode.NotFound).json({
    message: 'Not Found',
  });

  return response.status(HttpStatusCode.Ok).json({
    message: 'OK',
    guild: guild
  });
}