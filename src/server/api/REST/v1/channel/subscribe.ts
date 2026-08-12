import { Elysia, t } from 'elysia';
import { HttpStatusCode } from '@/types/http';
import { container } from '@/core/container';
import { prisma } from '@/prisma';
import { fetchUserByOAuthAccessToken } from '@/utils/oauth';
import { getChannel, IsValidChannel } from '@/utils/ytmusic-api/getChannel';

async function clearUserSubscribeCache(userId: string) {
  if (!container.redis?.redis) return;
  try {
    const keys = await container.redis.redis.keys(`user:${userId}:subscribe_cache*`);
    if (keys.length > 0) {
      await container.redis.redis.del(...keys);
    }
  } catch (err) {
    console.error('Failed to clear user subscribe cache:', err);
  }
}

async function listSubscriptions(user: any, limit?: string | number) {
  const isAll =
    !limit ||
    limit === 'all' ||
    limit === '0' ||
    Number(limit) === 0;

  const q_limit = isAll ? undefined : Number(limit) > 0 ? Number(limit) : undefined;
  const cacheKey = `user:${user.id}:subscribe_cache:${isAll ? 'all' : q_limit}`;

  if (container.redis?.redis) {
    const value = await container.redis.redis.get(cacheKey);
    if (value) {
      return { message: 'Ok', result: JSON.parse(value) };
    }
  }

  const channels = await prisma.subscribe_artist.findMany({
    where: { uid: user.id },
    orderBy: { time: 'desc' },
    ...(q_limit ? { take: q_limit } : {}),
  });

  if (!channels || channels.length === 0) {
    return { error: 'Not Found' };
  }

  const now = new Date();
  const ONE_DAY_MS = 86400000; // 24 hours in ms

  const subscribed_channels = await Promise.all(
    channels.map(async (channel: any) => {
      const lastUpdated = channel.cache_lastupdated
        ? new Date(channel.cache_lastupdated)
        : new Date(0);
      const needsFetch =
        !channel.cache || now.getTime() - lastUpdated.getTime() > ONE_DAY_MS;

      if (needsFetch) {
        if (channel.cache) {
          getChannel(channel.target, true).then(async (fetchChannel: any) => {
            if (fetchChannel?.result) {
              await prisma.subscribe_artist.update({
                where: { uid_target: { uid: user.id, target: channel.target } },
                data: {
                  cache: JSON.stringify(fetchChannel.result),
                  cache_lastupdated: new Date(),
                },
              });
              await clearUserSubscribeCache(user.id);
            }
          }).catch(() => {});
          return {
            artistId: channel.target,
            info: JSON.parse(channel.cache),
          };
        }

        const fetchChannel: any = await getChannel(channel.target, true);
        if (fetchChannel?.result) {
          await prisma.subscribe_artist.update({
            where: {
              uid_target: { uid: user.id, target: channel.target },
            },
            data: {
              cache: JSON.stringify(fetchChannel.result),
              cache_lastupdated: now,
            },
          });
          return { artistId: channel.target, info: fetchChannel.result };
        }
      }
      return {
        artistId: channel.target,
        info: JSON.parse(channel?.cache || '{}'),
      };
    }),
  );

  if (container.redis?.redis) {
    const multi = container.redis.redis.multi();
    for (const channel of channels) {
      multi.hset(`user:${user.id}:subscribe`, channel.target, 1);
    }
    multi.expire(`user:${user.id}:subscribe`, 86400);
    multi.setex(
      cacheKey,
      300,
      JSON.stringify(subscribed_channels),
    );
    multi.exec();
  }

  return { message: 'Ok', result: subscribed_channels };
}

export default new Elysia()
  .get(
    '/subscribe',
    async ({ headers, query, set }) => {
      try {
        const { authorization } = headers;
        const { c, limit } = query;

        if (!authorization) {
          set.status = HttpStatusCode.Unauthorized;
          return { error: 'Unauthorized' };
        }

        const [tokenType, tokenKey] = authorization.split(' ');
        const user: any = await fetchUserByOAuthAccessToken(tokenType, tokenKey);
        if (!user) {
          set.status = HttpStatusCode.Unauthorized;
          return { error: 'Unauthorized' };
        }

        // If no channel ID provided, return list of subscriptions
        if (!c) {
          const result: any = await listSubscriptions(user, limit);
          if (result.error) {
            set.status = result.error === 'Not Found' ? 404 : 400;
          }
          return result;
        }

        const channelId = String(c);
        if (!(await IsValidChannel(channelId))) {
          set.status = HttpStatusCode.BadRequest;
          return { error: 'Invalid channelId' };
        }

        if (container.redis?.redis) {
          const value = await container.redis.redis.hget(
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

        const subscription = await prisma.subscribe_artist.findUnique({
          where: {
            uid_target: { uid: user.id, target: channelId },
          },
        });

        if (subscription) {
          if (container.redis?.redis) {
            container.redis.redis.hset(`user:${user.id}:subscribe`, channelId, 1);
            container.redis.redis.expire(`user:${user.id}:subscribe`, 86400);
          }
          set.status = HttpStatusCode.Ok;
          return { message: 'Subscribed', state: 1 };
        }

        if (container.redis?.redis) {
          container.redis.redis.hset(`user:${user.id}:subscribe`, channelId, 0);
          container.redis.redis.expire(`user:${user.id}:subscribe`, 86400);
        }
        set.status = HttpStatusCode.Ok;
        return { message: 'Unsubscribed', state: 0 };
      } catch (error) {
        console.error(error);
        set.status = HttpStatusCode.InternalServerError;
        return { error: 'Internal Server Error' };
      }
    },
    {
      headers: t.Object({
        authorization: t.String(),
      }),
      query: t.Object({
        c: t.Optional(t.String()),
        limit: t.Optional(t.String()),
      }),
    },
  )
  .get(
    '/subscribe/:options',
    async ({ headers, params, query, set }) => {
      try {
        const { authorization } = headers;
        const { limit } = query;
        const { options } = params;

        if (!authorization) {
          set.status = HttpStatusCode.Unauthorized;
          return { error: 'Unauthorized' };
        }

        const [tokenType, tokenKey] = authorization.split(' ');
        const user: any = await fetchUserByOAuthAccessToken(tokenType, tokenKey);
        if (!user) {
          set.status = HttpStatusCode.Unauthorized;
          return { error: 'Unauthorized' };
        }

        if (options === 's') {
          const result: any = await listSubscriptions(user, limit);
          if (result.error) {
            set.status = result.error === 'Not Found' ? 404 : 400;
          }
          return result;
        }

        set.status = HttpStatusCode.MethodNotAllowed;
        return { error: 'Method Not Allowed' };
      } catch (error) {
        console.error(error);
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
      query: t.Object({
        limit: t.Optional(t.String()),
      }),
    },
  )
  .post(
    '/subscribe',
    async ({ headers, query, set }) => {
      try {
        const { authorization } = headers;
        const { c } = query;
        if (!authorization) {
          set.status = HttpStatusCode.Unauthorized;
          return { error: 'Unauthorized' };
        }
        if (!c) {
          set.status = HttpStatusCode.BadRequest;
          return { error: 'Missing required parameter: c' };
        }
        const [tokenType, tokenKey] = authorization.split(' ');
        const user: any = await fetchUserByOAuthAccessToken(tokenType, tokenKey);
        if (!user) {
          set.status = HttpStatusCode.Unauthorized;
          return { error: 'Unauthorized' };
        }
        const channelId = String(c);
        if (!(await IsValidChannel(channelId))) {
          set.status = HttpStatusCode.BadRequest;
          return { error: 'Invalid channelId' };
        }

        if (container.redis?.redis) {
          container.redis.redis.hset(`user:${user.id}:subscribe`, channelId, 1);
          container.redis.redis.expire(`user:${user.id}:subscribe`, 86400);
          await clearUserSubscribeCache(user.id);
        }

        await prisma.subscribe_artist.upsert({
          where: {
            uid_target: { uid: user.id, target: channelId },
          },
          update: { time: new Date() },
          create: { uid: user.id, target: channelId, time: new Date() },
        });

        set.status = HttpStatusCode.Ok;
        return { message: 'Ok' };
      } catch (error) {
        console.error(error);
        set.status = HttpStatusCode.InternalServerError;
        return { error: 'Internal Server Error' };
      }
    },
    {
      headers: t.Object({
        authorization: t.String(),
      }),
      query: t.Object({
        c: t.Optional(t.String()),
      }),
    },
  )
  .delete(
    '/subscribe',
    async ({ headers, query, set }) => {
      try {
        const { authorization } = headers;
        const { c } = query;
        if (!authorization) {
          set.status = HttpStatusCode.Unauthorized;
          return { error: 'Unauthorized' };
        }
        if (!c) {
          set.status = HttpStatusCode.BadRequest;
          return { error: 'Missing required parameter: c' };
        }
        const [tokenType, tokenKey] = authorization.split(' ');
        const user: any = await fetchUserByOAuthAccessToken(tokenType, tokenKey);
        if (!user) {
          set.status = HttpStatusCode.Unauthorized;
          return { error: 'Unauthorized' };
        }
        const channelId = String(c);
        if (!(await IsValidChannel(channelId))) {
          set.status = HttpStatusCode.BadRequest;
          return { error: 'Invalid channelId' };
        }

        if (container.redis?.redis) {
          container.redis.redis.hset(`user:${user.id}:subscribe`, channelId, 0);
          container.redis.redis.expire(`user:${user.id}:subscribe`, 86400);
          await clearUserSubscribeCache(user.id);
        }

        await prisma.subscribe_artist.deleteMany({
          where: { uid: user.id, target: channelId },
        });

        set.status = HttpStatusCode.Ok;
        return { message: 'Ok' };
      } catch (error) {
        console.error(error);
        set.status = HttpStatusCode.InternalServerError;
        return { error: 'Internal Server Error' };
      }
    },
    {
      headers: t.Object({
        authorization: t.String(),
      }),
      query: t.Object({
        c: t.Optional(t.String()),
      }),
    },
  );
