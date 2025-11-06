import { Elysia } from 'elysia';
import axios, { HttpStatusCode } from 'axios';
import { redisClient, discordClient as self } from '@/index';
import { Guild, type OAuth2Guild } from 'discord.js';
import { fetchUserByOAuthAccessToken } from '@/utils/oauth';

export default new Elysia().get('/guilds', async ({ cookie, set }) => {
  try {
    const authorization_type = String(cookie['type']?.value || '');
    const authorization_key = String(cookie['key']?.value || '');
    if (!authorization_type || !authorization_key) {
      set.status = HttpStatusCode.Unauthorized;
      return { error: 'Unauthorized' };
    }

    try {
      const user = await axios.get(
        'https://discord.com/api/v10/users/@me/guilds',
        {
          headers: {
            Authorization: `${authorization_type} ${authorization_key}`,
            'Content-Type': 'application/x-www-form-urlencoded',
            'User-Agent': 'Pona! Endpoint (OpenPonlponl123.com/v1)',
          },
        },
      );
      if (user.status === 200) {
        const userInfo = await fetchUserByOAuthAccessToken(
          authorization_type,
          authorization_key,
        );
        if (!userInfo) {
          set.status = HttpStatusCode.Unauthorized;
          return { error: 'Unauthorized' };
        }
        if (redisClient?.redis) {
          const value = await redisClient.redis.get(
            `user:${userInfo.id}:guilds`,
          );
          if (value) {
            set.status = HttpStatusCode.Ok;
            return { message: 'Ok', guilds: JSON.parse(value) };
          }
        }
        const guilds = user.data.map((guild: OAuth2Guild) => guild.id);

        const guildWithPona: Guild[] = [];

        (guilds as Array<string>).forEach((guild) => {
          const guildCache = self.client.guilds.cache.get(guild);
          if (guildCache) guildWithPona.push(guildCache);
        });

        if (!(guildWithPona.length > 0)) {
          set.status = HttpStatusCode.NotFound;
          return {
            message: 'Not Found',
          };
        }
        if (userInfo && typeof userInfo !== 'boolean') {
          redisClient?.redis.setex(
            `user:${userInfo.id}:guilds`,
            300,
            JSON.stringify(guildWithPona),
          );
        }
        set.status = HttpStatusCode.Ok;
        return {
          message: 'OK',
          guilds: guildWithPona,
        };
      }
    } catch (err) {
      // console.error("Error fetching user from Discord API :", err);
      set.status = HttpStatusCode.Unauthorized;
      return { error: 'Unauthorized' };
    }
  } catch (e) {
    if (String(cookie['debug']?.value || '') === 'true') {
      console.error('Error in /guilds endpoint :', e);
    }
    set.status = HttpStatusCode.InternalServerError;
    return { error: 'Internal Server Error' };
  }
});
