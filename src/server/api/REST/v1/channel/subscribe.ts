import { Elysia, t } from 'elysia';
import { HttpStatusCode } from 'axios';
import { database, redisClient } from '@/index';
import { fetchUserByOAuthAccessToken } from '@/utils/oauth';
import { getChannel, IsValidChannel } from '@/utils/ytmusic-api/getChannel';

export default new Elysia()
  .get(
    '/subscribe',
    async ({ headers, query, set }) => {
      try {
        if (!database || !database.pool) {
          set.status = HttpStatusCode.ServiceUnavailable;
          return { error: 'Service Unavailable' };
        }
        const { authorization } = headers;
        const { c } = query;
        if (!authorization) {
          set.status = HttpStatusCode.Unauthorized;
          return { error: 'Unauthorized' };
        }
        const tokenType = authorization.split(' ')[0];
        const tokenKey = authorization.split(' ')[1];
        const channelId = String(c);
        const user: any = await fetchUserByOAuthAccessToken(
          tokenType,
          tokenKey,
        );
        if (!user) {
          set.status = HttpStatusCode.Unauthorized;
          return { error: 'Unauthorized' };
        }
        if (!channelId || !(await IsValidChannel(channelId))) {
          set.status = HttpStatusCode.BadRequest;
          return { error: 'Invalid channelId' };
        }
        if (redisClient?.redis) {
          const value = await redisClient.redis.hget(
            `user:${user.id}:subscribe`,
            channelId,
          );
          if (value && Number(value)) {
            set.status = HttpStatusCode.Ok;
            return {
              message: value === '1' ? 'Subscribed' : 'Unsubscribed',
              state: Number(value),
            };
          }
        }
        const value = await database.query(
          `SELECT uid, target FROM subscribe_artist WHERE uid=? AND target=?`,
          [user.id, channelId],
        );
        if (value && value.length > 0) {
          if (redisClient?.redis)
            (redisClient.redis.hset(`user:${user.id}:subscribe`, channelId, 1),
              redisClient.redis.expire(`user:${user.id}:subscribe`, 86400));
          set.status = HttpStatusCode.Ok;
          return { message: 'Subscribed', state: 1 };
        }
        if (redisClient?.redis)
          (redisClient.redis.hset(`user:${user.id}:subscribe`, channelId, 0),
            redisClient.redis.expire(`user:${user.id}:subscribe`, 86400));
        set.status = HttpStatusCode.Ok;
        return { message: 'Unsubscribed', state: 0 };
      } catch (error) {
        console.error(error);
        if (process.env.NODE_ENV === 'development') {
          set.status = HttpStatusCode.InternalServerError;
          return { error: String(error) };
        }
        set.status = HttpStatusCode.InternalServerError;
        return { error: 'Internal Server Error' };
      }
    },
    {
      headers: t.Object({
        authorization: t.String(),
      }),
      query: t.Object({
        c: t.String(),
      }),
    },
  )
  .get(
    '/subscribe/:options',
    async ({ headers, params, query, set }) => {
      try {
        if (!database || !database.pool) {
          set.status = HttpStatusCode.ServiceUnavailable;
          return { error: 'Service Unavailable' };
        }
        const { authorization } = headers;
        const { c, limit } = query;
        const { options } = params;
        if (!authorization) {
          set.status = HttpStatusCode.Unauthorized;
          return { error: 'Unauthorized' };
        }
        const tokenType = authorization.split(' ')[0];
        const tokenKey = authorization.split(' ')[1];
        const channelId = String(c);
        const user: any = await fetchUserByOAuthAccessToken(
          tokenType,
          tokenKey,
        );
        if (!user) {
          set.status = HttpStatusCode.Unauthorized;
          return { error: 'Unauthorized' };
        }
        if (!options) {
          if (!channelId || !(await IsValidChannel(channelId))) {
            set.status = HttpStatusCode.BadRequest;
            return { error: 'Invalid channelId' };
          }
          if (redisClient?.redis) {
            const value = await redisClient.redis.hget(
              `user:${user.id}:subscribe`,
              channelId,
            );
            if (value && Number(value)) {
              set.status = HttpStatusCode.Ok;
              return {
                message: value === '1' ? 'Subscribed' : 'Unsubscribed',
                state: Number(value),
              };
            }
          }
          const value = await database.query(
            `SELECT uid, target FROM subscribe_artist WHERE uid=? AND target=?`,
            [user.id, channelId],
          );
          if (value && value.length > 0) {
            if (redisClient?.redis)
              (redisClient.redis.hset(
                `user:${user.id}:subscribe`,
                channelId,
                1,
              ),
                redisClient.redis.expire(`user:${user.id}:subscribe`, 86400));
            set.status = HttpStatusCode.Ok;
            return { message: 'Subscribed', state: 1 };
          }
          if (redisClient?.redis)
            (redisClient.redis.hset(`user:${user.id}:subscribe`, channelId, 0),
              redisClient.redis.expire(`user:${user.id}:subscribe`, 86400));
          set.status = HttpStatusCode.Ok;
          return { message: 'Unsubscribed', state: 0 };
        } else {
          switch (options) {
            case 's':
              if (limit && !Number(limit)) {
                set.status = HttpStatusCode.BadRequest;
                return {
                  error:
                    'limit parameter must be a number and not greater than 100',
                };
              }
              let q_limit = Number(limit) || 14;
              if (redisClient?.redis) {
                const value = await redisClient.redis.get(
                  `user:${user.id}:subscribe_cache`,
                );
                if (value) {
                  set.status = HttpStatusCode.Ok;
                  return { message: 'Ok', result: JSON.parse(value) };
                }
              }
              const channels = await database.query(
                `SELECT target, cache, cache_lastupdated FROM subscribe_artist WHERE uid=? LIMIT ?`,
                [user.id, q_limit],
              );
              if (channels && channels.length > 0) {
                const now = new Date().getTime();
                const nowFormatted = new Date()
                  .toISOString()
                  .slice(0, 19)
                  .replace('T', ' ');

                // Process all channels in parallel
                const subscribed_channels = await Promise.all(
                  channels.map(async (channel: any) => {
                    // Check if cache is stale (older than 24h)
                    const needsFetch =
                      !channel.cache ||
                      channel.cache_lastupdated < now - 86400000;

                    if (needsFetch) {
                      const fetchChannel: any = await getChannel(
                        channel.target,
                      );
                      if (fetchChannel?.result) {
                        await database.query(
                          `UPDATE subscribe_artist SET cache=?, cache_lastupdated=? WHERE uid=? AND target=?`,
                          [
                            JSON.stringify(fetchChannel.result),
                            nowFormatted,
                            user.id,
                            channel.target,
                          ],
                        );
                        return {
                          artistId: channel.target,
                          info: fetchChannel.result,
                        };
                      }
                    }
                    return {
                      artistId: channel.target,
                      info: JSON.parse(channel?.cache),
                    };
                  }),
                );

                // Batch Redis operations
                if (redisClient?.redis) {
                  const multi = redisClient.redis.multi();
                  for (const channel of channels) {
                    multi.hset(`user:${user.id}:subscribe`, channel.target, 1);
                  }
                  multi.expire(`user:${user.id}:subscribe`, 86400);
                  multi.setex(
                    `user:${user.id}:subscribe_cache`,
                    30,
                    JSON.stringify(subscribed_channels),
                  );
                  multi.exec(); // Fire and forget
                }

                set.status = HttpStatusCode.Ok;
                return { message: 'Ok', result: subscribed_channels };
              }
              set.status = HttpStatusCode.NotFound;
              return { error: 'Not Found' };
            default:
              set.status = HttpStatusCode.MethodNotAllowed;
              return { error: 'Method Not Allowed' };
          }
        }
      } catch (error) {
        console.error(error);
        if (process.env.NODE_ENV === 'development') {
          set.status = HttpStatusCode.InternalServerError;
          return { error: String(error) };
        }
        set.status = HttpStatusCode.InternalServerError;
        return { error: 'Internal Server Error' };
      }
    },
    {
      headers: t.Object({
        authorization: t.String(),
      }),
      params: t.Object({
        options: t.String(),
      }),
    },
  )
  .post(
    '/subscribe',
    async ({ headers, query, set }) => {
      try {
        if (!database || !database.pool) {
          set.status = HttpStatusCode.ServiceUnavailable;
          return { error: 'Service Unavailable' };
        }
        const { authorization } = headers;
        const { c } = query;
        if (!authorization) {
          set.status = HttpStatusCode.Unauthorized;
          return { error: 'Unauthorized' };
        }
        const tokenType = authorization.split(' ')[0];
        const tokenKey = authorization.split(' ')[1];
        const channelId = String(c);
        const user: any = await fetchUserByOAuthAccessToken(
          tokenType,
          tokenKey,
        );
        if (!user) {
          set.status = HttpStatusCode.Unauthorized;
          return { error: 'Unauthorized' };
        }
        if (!channelId || !(await IsValidChannel(channelId))) {
          set.status = HttpStatusCode.BadRequest;
          return { error: 'Invalid channelId' };
        }
        if (redisClient?.redis)
          (redisClient.redis.hset(`user:${user.id}:subscribe`, channelId, 1),
            redisClient.redis.expire(`user:${user.id}:subscribe`, 86400));
        await database.query(
          `INSERT IGNORE INTO subscribe_artist (uid, target) VALUES (?, ?)`,
          [user.id, channelId],
        );
        set.status = HttpStatusCode.Ok;
        return { message: 'Ok' };
      } catch (error) {
        if (process.env.NODE_ENV === 'development') {
          set.status = HttpStatusCode.InternalServerError;
          return { error: String(error) };
        }
        set.status = HttpStatusCode.InternalServerError;
        return { error: 'Internal Server Error' };
      }
    },
    {
      headers: t.Object({
        authorization: t.String(),
      }),
      query: t.Object({
        c: t.String(),
      }),
    },
  )
  .delete(
    '/subscribe',
    async ({ headers, query, set }) => {
      try {
        if (!database || !database.pool) {
          set.status = HttpStatusCode.ServiceUnavailable;
          return { error: 'Service Unavailable' };
        }
        const { authorization } = headers;
        const { c } = query;
        if (!authorization) {
          set.status = HttpStatusCode.Unauthorized;
          return { error: 'Unauthorized' };
        }
        const tokenType = authorization.split(' ')[0];
        const tokenKey = authorization.split(' ')[1];
        const channelId = String(c);
        const user: any = await fetchUserByOAuthAccessToken(
          tokenType,
          tokenKey,
        );
        if (!user) {
          set.status = HttpStatusCode.Unauthorized;
          return { error: 'Unauthorized' };
        }
        if (!channelId || !(await IsValidChannel(channelId))) {
          set.status = HttpStatusCode.BadRequest;
          return { error: 'Invalid channelId' };
        }
        if (redisClient?.redis)
          (redisClient.redis.hset(`user:${user.id}:subscribe`, channelId, 0),
            redisClient.redis.expire(`user:${user.id}:subscribe`, 86400));
        await database.query(
          `DELETE FROM subscribe_artist WHERE uid=? AND target=?`,
          [user.id, channelId],
        );
        set.status = HttpStatusCode.Ok;
        return { message: 'Ok' };
      } catch (error) {
        console.error(error);
        if (process.env.NODE_ENV === 'development') {
          set.status = HttpStatusCode.InternalServerError;
          return { error: String(error) };
        }
        set.status = HttpStatusCode.InternalServerError;
        return { error: 'Internal Server Error' };
      }
    },
    {
      headers: t.Object({
        authorization: t.String(),
      }),
      query: t.Object({
        c: t.String(),
      }),
    },
  );
