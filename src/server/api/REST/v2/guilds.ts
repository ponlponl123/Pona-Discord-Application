import express from 'express';
import axios, { HttpStatusCode } from 'axios';
import { discordClient as self } from '@/index';
import { Guild, type OAuth2Guild } from 'discord.js';

export async function GET_PRIVATE(request: express.Request, response: express.Response) {
  try {
    const authorization_type = request.cookies.type;
    const authorization_key = request.cookies.key;
    if ( !authorization_type || !authorization_key ) return response.status(HttpStatusCode.Unauthorized).json({error: 'Unauthorized'});

    try {
      const user = await axios.get('https://discord.com/api/v10/users/@me/guilds', {
        headers: {
          Authorization: `${authorization_type} ${authorization_key}`,
          'Content-Type': 'application/x-www-form-urlencoded',
          "User-Agent": "Pona! Endpoint (OpenPonlponl123.com/v1)"
        }
      })
      if ( user.status === 200 )
      {
        const guilds = user.data.map((guild: OAuth2Guild) => guild.id);

        const guildWithPona: Guild[] = [];
    
        (guilds as Array<string>).forEach(guild => {
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
      }
    } catch (err) {
      // console.error("Error fetching user from Discord API :", err);
      return response.status(HttpStatusCode.Unauthorized).json({error: 'Unauthorized'});
    }
  } catch {
    return response.status(HttpStatusCode.InternalServerError).json({error: 'Internal Server Error'});
  }
}