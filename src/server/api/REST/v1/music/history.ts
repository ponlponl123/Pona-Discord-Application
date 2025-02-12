import express from 'express';
import { HttpStatusCode } from 'axios';
import { fetchUserByOAuthAccessToken } from '@/utils/oauth';
import { database } from '@/index';
import { isNumber } from 'lodash';

export async function GET(request: express.Request, response: express.Response) {
  try {
    if ( !database || !database.connection ) return response.status(HttpStatusCode.ServiceUnavailable).json({error: 'Service Unavailable'});
    const { authorization } = request.headers;
    const { l } = request.query;
    if ( !authorization ) return response.status(HttpStatusCode.Unauthorized).json({error: 'Unauthorized'});
    const tokenType = authorization.split(' ')[0];
    const tokenKey = authorization.split(' ')[1];
    const user = await fetchUserByOAuthAccessToken(tokenType, tokenKey);
    if ( !user ) return response.status(HttpStatusCode.Unauthorized).json({error: 'Unauthorized'});
    const limit = Number(l) || 14;
    if ( limit < 1 || limit > 100 || !isNumber(limit) ) return response.status(HttpStatusCode.BadRequest).json({error: 'Invalid limit'});
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
      LIMIT ?;`
    const [rows] = await database.connection.query(sql_query, [user.id, limit]);
    return response.status(HttpStatusCode.Ok).json({
      message: 'OK',
      tracks: rows
    });
  } catch (e) {
    if ( process.env.NODE_ENV === "development" ) return response.status(HttpStatusCode.InternalServerError).json({error: 'Internal Server Error', debug: e});
    return response.status(HttpStatusCode.InternalServerError).json({error: 'Internal Server Error'});
  }
}