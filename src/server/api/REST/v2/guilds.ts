import express from 'express';
import axios, { HttpStatusCode } from 'axios';
import { redisClient, discordClient as self } from '@/index';
import { Guild, type OAuth2Guild } from 'discord.js';
import { fetchUserByOAuthAccessToken } from '@/utils/oauth';

export async function GET_PRIVATE(request: express.Request, response: express.Response) {
  try {
    const authorization_type = request.cookies["type"];
    const authorization_key = request.cookies["key"];
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
        const userInfo = await fetchUserByOAuthAccessToken(authorization_type, authorization_key);
        if ( !userInfo ) return response.status(HttpStatusCode.Unauthorized).json({error: 'Unauthorized'});
        if ( redisClient?.redis )
        {
          const value = await redisClient.redis.get(`user:${userInfo.id}:guilds`);
          if ( value ) 
            return response.status(HttpStatusCode.Ok).json({message: 'Ok', guilds: JSON.parse(value)});
        }
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
        redisClient?.redis.setex(`user:${userInfo.id}:guilds`, 300, JSON.stringify(guildWithPona));
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