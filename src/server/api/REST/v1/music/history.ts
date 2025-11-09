import { Elysia, t } from 'elysia';
import { HttpStatusCode } from 'axios';
import { fetchUserByOAuthAccessToken } from '@/utils/oauth';
import { database, redisClient } from '@/index';
import { isNumber } from 'lodash';
import JSONBig from 'json-bigint';

export default new Elysia()
  .get(
    '/history',
    async ({ headers, query, set }) => {
      try {
        const { authorization } = headers;
        const { l } = query;
        if (!authorization) {
          set.status = HttpStatusCode.Unauthorized;
          return { error: 'Unauthorized' };
        }
        const tokenType = authorization.split(' ')[0];
        const tokenKey = authorization.split(' ')[1];
        const user: any = await fetchUserByOAuthAccessToken(
          tokenType,
          tokenKey,
        );
        if (!user) {
          set.status = HttpStatusCode.Unauthorized;
          return { error: 'Unauthorized' };
        }
        const limit = Number(l) || 14;
        if (limit < 1 || limit > 100 || !isNumber(limit)) {
          set.status = HttpStatusCode.BadRequest;
          return { error: 'Invalid limit' };
        }
        if (redisClient?.redis && limit === 14) {
          const value = await redisClient.redis.get(
            `user:${user.id}:history:track`,
          );
          if (value) {
            set.status = HttpStatusCode.Ok;
            return { message: 'Ok', tracks: JSONBig.parse(value) };
          }
        }
        if (!database || !database.pool) {
          set.status = HttpStatusCode.ServiceUnavailable;
          return { error: 'Service Unavailable' };
        }
        const sql_query = `SELECT id, track
        FROM (
          SELECT id, track,
            JSON_UNQUOTE(JSON_EXTRACT(track, '$.uri')) AS uri,
            ROW_NUMBER() OVER (PARTITION BY JSON_UNQUOTE(JSON_EXTRACT(track, '$.uri')) ORDER BY id DESC) AS row_num
          FROM player_track_history
          WHERE requestby = ?
        ) AS subquery
        WHERE row_num = 1
        ORDER BY id DESC
        LIMIT ?;`;
        const res = await database.pool.query(sql_query, [user.id, limit]);
        if (!res || res.length === 0) {
          set.status = HttpStatusCode.NotFound;
          return { error: 'Not Found' };
        }
        if (redisClient?.redis && limit === 14)
          redisClient?.redis.setex(
            `user:${user.id}:history:track`,
            15,
            JSONBig.stringify(res),
          );
        set.status = HttpStatusCode.Ok;
        return {
          message: 'OK',
          tracks: JSONBig.parse(JSONBig.stringify(res)),
        };
      } catch (e) {
        console.error(e);
        if (process.env.NODE_ENV === 'development') {
          set.status = HttpStatusCode.InternalServerError;
          return { error: 'Internal Server Error', debug: e };
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
        l: t.Optional(t.Number()),
      }),
    },
  )
  .get(
    '/history/:query',
    async ({ headers, params, set }) => {
      try {
        const { query: queryParam } = params;
        switch (queryParam) {
          case 'search':
            const { authorization } = headers;
            if (!authorization) {
              set.status = HttpStatusCode.Unauthorized;
              return { error: 'Unauthorized' };
            }
            const tokenType = authorization.split(' ')[0];
            const tokenKey = authorization.split(' ')[1];
            const user: any = await fetchUserByOAuthAccessToken(
              tokenType,
              tokenKey,
            );
            if (!user) {
              set.status = HttpStatusCode.Unauthorized;
              return { error: 'Unauthorized' };
            }
            if (redisClient?.redis) {
              const keyType = await redisClient.redis.type(
                `user:${user.id}:history:search`,
              );
              if (keyType === 'SET') {
                const value = await redisClient.redis.smembers(
                  `user:${user.id}:history:search`,
                );
                if (value && value.length > 0) {
                  set.status = HttpStatusCode.Ok;
                  return { message: 'Ok', results: value };
                }
              } else if (keyType === 'LIST') {
                const value = await redisClient.redis.lrange(
                  `user:${user.id}:history:search`,
                  0,
                  7,
                );
                if (value && value.length > 0) {
                  set.status = HttpStatusCode.Ok;
                  return { message: 'Ok', results: value };
                }
              }
            }
            if (!database || !database.pool) {
              set.status = HttpStatusCode.ServiceUnavailable;
              return { error: 'Service Unavailable' };
            }
            const search_history = await database.pool.query(
              `SELECT text FROM (
              SELECT id, text,
                ROW_NUMBER() OVER (PARTITION BY text ORDER BY id DESC) AS row_num
              FROM search_history
              WHERE uid = ?
            ) AS subquery
            WHERE row_num = 1
            ORDER BY id DESC
            LIMIT 8;`,
              [user.id],
            );
            if (!search_history || search_history.length === 0) {
              set.status = HttpStatusCode.NotFound;
              return { error: 'Not Found' };
            }
            const parsed_to_array = search_history.map(
              (item: { text: string }) => item.text,
            );
            if (redisClient?.redis)
              await redisClient.redis
                .multi()
                .sadd(`user:${user.id}:history:search`, ...parsed_to_array)
                .expire(`user:${user.id}:history:search`, 600)
                .exec();
            set.status = HttpStatusCode.Ok;
            return {
              message: 'OK',
              results: parsed_to_array,
            };
          default:
            set.status = HttpStatusCode.MethodNotAllowed;
            return { error: 'Method Not Allowed' };
        }
      } catch (e) {
        console.error(e);
        if (process.env.NODE_ENV === 'development') {
          set.status = HttpStatusCode.InternalServerError;
          return { error: 'Internal Server Error', debug: e };
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
        query: t.String(),
      }),
    },
  );
