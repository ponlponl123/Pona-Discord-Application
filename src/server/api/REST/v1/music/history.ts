import { Elysia, t } from 'elysia';
import { HttpStatusCode } from 'axios';
import { fetchUserByOAuthAccessToken } from '@/utils/oauth';
import { container } from '@/core/container';
import { prisma } from '@/prisma';
import JSONBig from 'json-bigint';

interface TrackHistoryResult {
  id: bigint;
  track: string;
}

export default new Elysia()
  .get(
    '/history',
    async ({ headers, query, set }) => {
      try {
        const { authorization } = headers;
        if (!authorization) {
          set.status = HttpStatusCode.Unauthorized;
          return { error: 'Unauthorized' };
        }

        const limit = Number(query['l']) || 14;
        if (limit < 1 || limit > 100 || Number.isNaN(limit)) {
          set.status = HttpStatusCode.BadRequest;
          return { error: 'Invalid limit' };
        }

        const [tokenType, tokenKey] = authorization.split(' ');
        const user: any = await fetchUserByOAuthAccessToken(
          tokenType,
          tokenKey,
        );
        if (!user) {
          set.status = HttpStatusCode.Unauthorized;
          return { error: 'Unauthorized' };
        }

        const cacheKey = `user:${user.id}:history:track:${limit}`;
        if (container.redis?.redis) {
          const cached = await container.redis.redis.get(cacheKey);
          if (cached) {
            set.status = HttpStatusCode.Ok;
            return { message: 'Ok', tracks: JSONBig.parse(cached) };
          }
        }

        // We use raw SQL here because Prisma Fluent API does not support Window Functions (ROW_NUMBER)
        // required for de-duplicating track history efficiently at the database level.
        const res = await prisma.$queryRawUnsafe<TrackHistoryResult[]>(
          `SELECT id, track
           FROM (
             SELECT id, track,
               JSON_UNQUOTE(JSON_EXTRACT(track, '$.uri')) AS uri,
               ROW_NUMBER() OVER (PARTITION BY JSON_UNQUOTE(JSON_EXTRACT(track, '$.uri')) ORDER BY id DESC) AS row_num
             FROM player_track_history
             WHERE requestby = ?
           ) AS subquery
           WHERE row_num = 1
           ORDER BY id DESC
           LIMIT ?`,
          user.id, limit,
        );

        if (!res || res.length === 0) {
          set.status = HttpStatusCode.NotFound;
          return { error: 'Not Found' };
        }

        const tracks = JSONBig.parse(JSONBig.stringify(res));

        if (container.redis?.redis) {
          container.redis.redis.setex(cacheKey, 15, JSONBig.stringify(tracks));
        }

        set.status = HttpStatusCode.Ok;
        return { message: 'OK', tracks };
      } catch (e) {
        console.error(e);
        set.status = HttpStatusCode.InternalServerError;
        return { error: 'Internal Server Error' };
      }
    },
    {
      headers: t.Object({
        authorization: t.String(),
      }),
      query: t.Object({
        l: t.Optional(t.Number()),
      }),
    },
  )
  .get(
    '/history/:query',
    async ({ headers, params, set }) => {
      try {
        const { query: queryParam } = params;
        if (queryParam !== 'search') {
          set.status = HttpStatusCode.MethodNotAllowed;
          return { error: 'Method Not Allowed' };
        }

        const { authorization } = headers;
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

        if (container.redis?.redis) {
          const keyType = await container.redis.redis.type(`user:${user.id}:history:search`);
          const value = keyType === 'SET' 
            ? await container.redis.redis.smembers(`user:${user.id}:history:search`)
            : await container.redis.redis.lrange(`user:${user.id}:history:search`, 0, 7);
          
          if (value && value.length > 0) {
            set.status = HttpStatusCode.Ok;
            return { message: 'Ok', results: value };
          }
        }
        
        // Refactored to use Fluent API where possible, but still needs a raw subquery for deduplication
        // to match the specific 8-item unique logic efficiently.
        const search_history = await prisma.$queryRawUnsafe<{text: string}[]>(
          `SELECT text FROM (
            SELECT text, MAX(id) as max_id
            FROM search_history
            WHERE uid = ?
            GROUP BY text
          ) AS subquery
          ORDER BY max_id DESC
          LIMIT 8;`,
          user.id,
        );

        if (!search_history || search_history.length === 0) {
          set.status = HttpStatusCode.NotFound;
          return { error: 'Not Found' };
        }

        const parsed_to_array = search_history.map(item => item.text);
        
        if (container.redis?.redis) {
          await container.redis.redis
            .multi()
            .sadd(`user:${user.id}:history:search`, ...parsed_to_array)
            .expire(`user:${user.id}:history:search`, 600)
            .exec();
        }

        set.status = HttpStatusCode.Ok;
        return { message: 'OK', results: parsed_to_array };
      } catch (e) {
        console.error(e);
        set.status = HttpStatusCode.InternalServerError;
        return { error: 'Internal Server Error' };
      }
    },
    {
      headers: t.Object({
        authorization: t.String(),
      }),
    },
  );

