import express from 'express';
import { HttpStatusCode } from 'axios';
import { fetchUserByOAuthAccessToken } from '@/utils/oauth';
import { database, redisClient } from '@/index';
import { isNumber } from 'lodash';
import JSONBig from 'json-bigint';

export const path = "/:query?";

export async function GET(request: express.Request, response: express.Response) {
  try {
    const { query } = request.params;
    if ( !query )
    {
      const { authorization } = request.headers;
      const { l } = request.query;
      if (!authorization) {
        return response.status(HttpStatusCode.Unauthorized).json({ error: 'Unauthorized' });
      }
      const tokenType = authorization.split(' ')[0];
      const tokenKey = authorization.split(' ')[1];
      const user = await fetchUserByOAuthAccessToken(tokenType, tokenKey);
      if (!user) {
        return response.status(HttpStatusCode.Unauthorized).json({ error: 'Unauthorized' });
      }
      const limit = Number(l) || 14;
      if (limit < 1 || limit > 100 || !isNumber(limit)) {
        return response.status(HttpStatusCode.BadRequest).json({ error: 'Invalid limit' });
      }
      if ( redisClient?.redis && limit === 14)
      {
        const value = await redisClient.redis.get(`user:${user.id}:history:track`);
        if ( value ) 
          return response.status(HttpStatusCode.Ok).json({message: 'Ok', tracks: JSONBig.parse(value)});
      }
      if (!database || !database.connection) {
        return response.status(HttpStatusCode.ServiceUnavailable).json({ error: 'Service Unavailable' });
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
      const res = await database.connection.query(sql_query, [user.id, limit]);
      if ( !res || res.length === 0 ) {
        return response.status(HttpStatusCode.NotFound).json({ error: 'Not Found' });
      }
      if ( redisClient?.redis && limit === 14 )
        redisClient?.redis.setex(`user:${user.id}:history:track`, 15, JSONBig.stringify(res));
      return response.status(HttpStatusCode.Ok).json({
        message: 'OK',
        tracks: JSONBig.parse(JSONBig.stringify(res))
      });
    } else {
      switch ( query ) {
        case 'search':
          const { authorization } = request.headers;
          if (!authorization) {
            return response.status(HttpStatusCode.Unauthorized).json({ error: 'Unauthorized' });
          }
          const tokenType = authorization.split(' ')[0];
          const tokenKey = authorization.split(' ')[1];
          const user = await fetchUserByOAuthAccessToken(tokenType, tokenKey);
          if (!user) {
            return response.status(HttpStatusCode.Unauthorized).json({ error: 'Unauthorized' });
          }
          if ( redisClient?.redis )
          {
            const keyType = await redisClient.redis.type(`user:${user.id}:history:search`);
            if ( keyType === 'SET' )
            {
              const value = await redisClient.redis.smembers(`user:${user.id}:history:search`);
              if ( value && value.length > 0 ) 
                return response.status(HttpStatusCode.Ok).json({message: 'Ok', results: value});
            }
            else if ( keyType === 'LIST' )
            {
              const value = await redisClient.redis.lrange(`user:${user.id}:history:search`, 0, 7);
              if ( value && value.length > 0 ) 
                return response.status(HttpStatusCode.Ok).json({message: 'Ok', results: value});
            }
          }
          if ( !database || !database.connection )
            return response.status(HttpStatusCode.ServiceUnavailable).json({ error: 'Service Unavailable' });
          const search_history = await database.connection.query(
            `SELECT text FROM (
              SELECT id, text,
                ROW_NUMBER() OVER (PARTITION BY text ORDER BY id DESC) AS row_num
              FROM search_history
              WHERE uid = ?
            ) AS subquery
            WHERE row_num = 1
            ORDER BY id DESC
            LIMIT 8;`,
            [user.id]
          );
          if ( !search_history || search_history.length === 0 )
            return response.status(HttpStatusCode.NotFound).json({ error: 'Not Found' });
          const parsed_to_array = search_history.map((item: { text: string }) => item.text);
          if ( redisClient?.redis )
            await redisClient.redis.multi()
              .sadd(`user:${user.id}:history:search`, ...parsed_to_array)
              .expire(`user:${user.id}:history:search`, 600)
              .exec();
          return response.status(HttpStatusCode.Ok).json({
            message: 'OK',
            results: parsed_to_array
          });
        default:
          return response.status(HttpStatusCode.MethodNotAllowed).json({ error: 'Method Not Allowed' });
      }
    }
  } catch (e) {
    if (process.env.NODE_ENV === "development") {
      return response.status(HttpStatusCode.InternalServerError).json({ error: 'Internal Server Error', debug: e });
    }
    return response.status(HttpStatusCode.InternalServerError).json({ error: 'Internal Server Error' });
  }
}