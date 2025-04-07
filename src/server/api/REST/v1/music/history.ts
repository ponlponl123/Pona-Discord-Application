import express from 'express';
import { HttpStatusCode } from 'axios';
import { fetchUserByOAuthAccessToken } from '@/utils/oauth';
import { database, redisClient } from '@/index';
import { isNumber } from 'lodash';
import JSONBig from 'json-bigint';

export async function GET(request: express.Request, response: express.Response) {
  try {
    if (!database || !database.connection) {
      return response.status(HttpStatusCode.ServiceUnavailable).json({ error: 'Service Unavailable' });
    }
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
      const value = await redisClient.redis.get(`user:history:track:${user.id}`);
      if ( value ) 
        return response.status(HttpStatusCode.Ok).json({message: 'Ok', tracks: JSONBig.parse(value)});
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
      redisClient?.redis.setex(`user:history:track:${user.id}`, 15, JSONBig.stringify(res));
    return response.status(HttpStatusCode.Ok).json({
      message: 'OK',
      tracks: JSONBig.parse(JSONBig.stringify(res))
    });
  } catch (e) {
    if (process.env.NODE_ENV === "development") {
      return response.status(HttpStatusCode.InternalServerError).json({ error: 'Internal Server Error', debug: e });
    }
    return response.status(HttpStatusCode.InternalServerError).json({ error: 'Internal Server Error' });
  }
}