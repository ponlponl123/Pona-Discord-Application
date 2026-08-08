import { Elysia, t } from 'elysia';
import { HttpStatusCode } from '@/types/http';
import { fetchUserByOAuthAccessToken } from '@/utils/oauth';
import YTMusicAPI from '@/utils/ytmusic-api/request';
import { container } from '@/core/container';
import { prisma } from '@/prisma';

export default new Elysia().get(
  '/search',
  async ({ headers, query, set }) => {
    try {
      const { authorization } = headers;
      const { q, is_suggestion, filter } = query;
      if (!q) {
        set.status = 400;
        return { error: 'Missing required parameters' };
      }
      if (!authorization) {
        set.status = HttpStatusCode.Unauthorized;
        return { error: 'Unauthorized' };
      }
      const tokenType = authorization.split(' ')[0];
      const tokenKey = authorization.split(' ')[1];
      const user: any = await fetchUserByOAuthAccessToken(tokenType, tokenKey);
      if (!user) {
        set.status = HttpStatusCode.Unauthorized;
        return { error: 'Unauthorized' };
      }

      if (is_suggestion === 'true') {
        if (container.redis?.redis) {
          const value = await container.redis.redis.get(
            `yt:search:suggestions:${String(q)}`,
          );
          if (value) {
            set.status = HttpStatusCode.Ok;
            return { message: 'Ok', searchSuggestions: JSON.parse(value) };
          }
        }
        const searchSuggestions = await container.ytmusic.client.getSearchSuggestions(
          String(q),
        );
        container.redis?.redis.setex(
          `yt:search:suggestions:${String(q)}`,
          1800,
          JSON.stringify(searchSuggestions),
        );
        set.status = HttpStatusCode.Ok;
        return { message: 'Ok', searchSuggestions: searchSuggestions };
      } else {
        await prisma.search_history.create({
          data: {
            uid: user.id,
            text: String(q),
            time: new Date(),
          },
        });
        
        if (container.redis?.redis) {
          const rawKeyType = await container.redis.redis.type(`user:${user.id}:history:search`);
          if (rawKeyType.toLowerCase() !== 'none' && rawKeyType.toLowerCase() !== 'list') {
            await container.redis.redis.del(`user:${user.id}:history:search`);
          }
          await container.redis.redis
            .multi()
            .lrem(`user:${user.id}:history:search`, 0, String(q))
            .lpush(`user:${user.id}:history:search`, String(q))
            .ltrim(`user:${user.id}:history:search`, 0, 7)
            .expire(`user:${user.id}:history:search`, 600)
            .exec();
          const value = await container.redis.redis.get(
            `yt:search:query:${filter || 'all'}:${String(q)}`,
          );
          if (value) {
            set.status = HttpStatusCode.Ok;
            return { message: 'Ok', result: JSON.parse(value) };
          }
        }
        let URL = `search?query=${encodeURIComponent(String(q))}`;
        URL += filter ? `&filter=${filter}` : '';
        const searchResult: any = await YTMusicAPI('GET', URL.toString(), undefined, undefined, user.id);
        if (!searchResult) {
          set.status = HttpStatusCode.ServiceUnavailable;
          return { message: 'Service Unavailable' };
        }
        container.redis?.redis.setex(
          `yt:search:query:${filter || 'all'}:${String(q)}`,
          300,
          JSON.stringify(searchResult.data.result),
        );
        set.status = HttpStatusCode.Ok;
        return { message: 'Ok', result: searchResult.data.result };
      }
    } catch (err: any) {
      console.error(err);
      if (err?.status === 404) {
        set.status = HttpStatusCode.NotFound;
        return { message: 'Not Found', result: [] };
      }
      if (process.env.NODE_ENV === 'development') {
        set.status = HttpStatusCode.InternalServerError;
        return { error: 'Internal Server Error', debug: err };
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
      q: t.String(),
      is_suggestion: t.Optional(t.String()),
      filter: t.Optional(t.String()),
    }),
  },
);
