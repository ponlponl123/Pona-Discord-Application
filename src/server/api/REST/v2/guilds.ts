import { Elysia, t } from 'elysia';
import axios, { HttpStatusCode } from 'axios';
import { container } from '@/core/container';
import { Guild, type OAuth2Guild } from 'discord.js';
import { fetchUserByOAuthAccessToken } from '@/utils/oauth';
import { isApiKeyInDatabase } from '@/utils/apikey';

// Helper to check debug access
async function canDebug(
  headers: Record<string, string | undefined>,
): Promise<boolean> {
  const authorization = headers['pona-authorization'] || '';
  if (
    authorization &&
    typeof authorization === 'string' &&
    authorization.startsWith('Pona! ')
  ) {
    const apiKey = authorization.replace('Pona! ', '');
    const isValidKey = await isApiKeyInDatabase(
      headers['x-forwarded-for'] as string,
      headers['user-agent'] as string,
      apiKey,
      true,
    );
    return !!(
      isValidKey &&
      typeof isValidKey !== 'boolean' &&
      isValidKey.canDebug
    );
  }
  return false;
}

export default new Elysia().get(
  '/guilds',
  async ({ cookie: { type, key }, headers, set }) => {
    const { pona } = container;
    try {
      const authorization_type = String(type?.value || '');
      const authorization_key = String(key?.value || '');

      if (!authorization_type || !authorization_key) {
        set.status = HttpStatusCode.Unauthorized;
        if (await canDebug(headers)) {
          return {
            error: 'Unauthorized',
            debug: { authorization_type, authorization_key },
          };
        }
        return { error: 'Unauthorized' };
      }

      // Fetch user info first (needed for cache key)
      const userInfo = await fetchUserByOAuthAccessToken(
        authorization_type,
        authorization_key,
      );
      if (!userInfo) {
        set.status = HttpStatusCode.Unauthorized;
        if (await canDebug(headers)) {
          return {
            error: 'Unauthorized',
            debug: { status: userInfo, authorization_type, authorization_key },
          };
        }
        return { error: 'Unauthorized' };
      }

      // Check Redis cache FIRST (before Discord API call)
      const cacheKey = `user:${userInfo.id}:guilds`;
      if (container.redis?.redis) {
        const cached = await container.redis.redis.get(cacheKey);
        if (cached) {
          const rawGuilds = JSON.parse(cached);
          const guilds = rawGuilds.map((g: any) => {
            const guildCache = pona.client.guilds.cache.get(g.id);
            const isConnected = guildCache
              ? !!(
                  guildCache.voiceStates.cache.get(userInfo.id)?.channelId ||
                  guildCache.members.cache.get(userInfo.id)?.voice?.channelId
                )
              : (g.isConnected ?? false);
            return {
              ...g,
              isConnected,
              isUserConnectedToVCInThisGuild: isConnected,
            };
          });
          set.status = HttpStatusCode.Ok;
          set.headers['Cache-Control'] = 'private, max-age=60'; // Client can cache for 60s
          return { message: 'Ok', guilds };
        }
      }

      // Fetch user's guilds from Discord API
      const userGuildsRes = await axios.get(
        'https://discord.com/api/v10/users/@me/guilds',
        {
          headers: {
            Authorization: `${authorization_type} ${authorization_key}`,
            'Content-Type': 'application/x-www-form-urlencoded',
            'User-Agent': 'Pona! Endpoint (OpenPonlponl123.com/v1)',
          },
          timeout: 5000,
        },
      );

      if (userGuildsRes.status !== 200) {
        set.status = HttpStatusCode.Unauthorized;
        if (await canDebug(headers)) {
          return {
            error: 'Unauthorized',
            debug: {
              status: userGuildsRes.status,
              statusText: userGuildsRes.statusText,
              data: userGuildsRes.data,
            },
          };
        }
        return { error: 'Unauthorized' };
      }

      // Filter guilds where Pona bot is present
      const userGuildIds = userGuildsRes.data.map((g: OAuth2Guild) => g.id);
      const guildWithPona: Array<Record<string, unknown>> = [];

      for (const guildId of userGuildIds) {
        const guildCache = pona.client.guilds.cache.get(guildId);
        if (guildCache) {
          const isConnected = !!(
            guildCache.voiceStates.cache.get(userInfo.id)?.channelId ||
            guildCache.members.cache.get(userInfo.id)?.voice?.channelId
          );
          const guildData = (
            typeof guildCache.toJSON === 'function'
              ? guildCache.toJSON()
              : guildCache
          ) as Record<string, any>;
          guildWithPona.push({
            ...guildData,
            isConnected,
            isUserConnectedToVCInThisGuild: isConnected,
          });
        }
      }

      if (guildWithPona.length === 0) {
        set.status = HttpStatusCode.NotFound;
        return { message: 'Not Found' };
      }

      // Cache in Redis for 5 minutes (fire and forget)
      if (container.redis?.redis) {
        container.redis.redis.setex(cacheKey, 300, JSON.stringify(guildWithPona));
      }

      set.status = HttpStatusCode.Ok;
      set.headers['Cache-Control'] = 'private, max-age=60'; // Client can cache for 60s
      return { message: 'OK', guilds: guildWithPona };
    } catch (err) {
      console.error('Error in /guilds endpoint:', err);
      set.status = HttpStatusCode.InternalServerError;
      if (await canDebug(headers)) {
        return { error: 'Internal Server Error', debug: err };
      }
      return { error: 'Internal Server Error' };
    }
  },
  {
    headers: t.Object({
      'pona-authorization': t.Optional(t.String()),
    }),
    cookie: t.Cookie({
      type: t.String(),
      key: t.String(),
    }),
  },
);
