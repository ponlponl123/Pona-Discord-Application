import express from 'express';
import { HttpStatusCode } from 'axios';
import { database, redisClient } from '@/index';
import { fetchUserByOAuthAccessToken } from '@/utils/oauth';
import { IsValidChannel } from '@/utils/ytmusic-api/getChannel';
import { getVideo, IsValidVideo } from '@/utils/ytmusic-api/getVideo';

export async function GET(request: express.Request, response: express.Response) {
  try {
    const { authorization } = request.headers;
    const { id } = request.query;
    if (!authorization) 
      return response.status(HttpStatusCode.Unauthorized).json({ error: 'Unauthorized' });
    if (!id)
      return response.status(HttpStatusCode.BadRequest).json({ error: 'Missing required parameters' });
    const tokenType = authorization.split(' ')[0];
    const tokenKey = authorization.split(' ')[1];
    const rawVideoIdQuery = String(id);
    const bulk_fetch = rawVideoIdQuery.includes(',') ? rawVideoIdQuery.split(',') : [rawVideoIdQuery];
    const user = await fetchUserByOAuthAccessToken(tokenType, tokenKey);
    if (!user) 
      return response.status(HttpStatusCode.Unauthorized).json({ error: 'Unauthorized' });

    const fetched: { [key: string]: boolean } = {};
    const promises = bulk_fetch.map(async (videoId) => {
      if (!videoId) return;
      if (redisClient?.redis) {
        const value = await redisClient.redis_ReadOnly.hget(`user:${user.id}:favorite`, videoId);
        if (value) {
          fetched[videoId] = value !== '0';
          return;
        }
      }
      if (!database || !database.pool)
        return response.status(HttpStatusCode.ServiceUnavailable).json({ error: 'Service Unavailable' });
      const fetchDB = await database.pool.query(
        `SELECT cache_lastupdated FROM favorite_track WHERE uid=? AND target=?`,
        [user.id, videoId]
      );
      if (fetchDB.length > 0) {
        if (fetchDB[0].cache_lastupdated > new Date().getTime() - 86400000) {
          const fetchVideo = await getVideo(videoId);
          if (fetchVideo) {
            const channelId = fetchVideo.result.v1?.artist.artistId || fetchVideo.result.v2?.artists[0].id;
            await database.pool.query(
              `UPDATE favorite_track SET cache=?, cache_lastupdated=? WHERE uid=? AND target=? AND source=?`,
              [JSON.stringify(fetchVideo.result), new Date().getTime(), user.id, videoId, channelId]
            );
            if ( redisClient?.redis )
              redisClient.redis.multi().hset(`user:${user.id}:favorite`,videoId,JSON.stringify(fetchVideo.result)).expire(`user:${user.id}:favorite`,86400);
          }
        }
        fetched[videoId] = true;
        return;
      }
      if ( redisClient?.redis )
        redisClient.redis.multi().hset(`user:${user.id}:favorite`,videoId,0).expire(`user:${user.id}:favorite`,86400);
      fetched[videoId] = false;
    });

    await Promise.all(promises);

    return response.status(HttpStatusCode.Ok).json({
      message: 'Ok',
      result: fetched,
    });
  } catch (error) {
    if (process.env.NODE_ENV === 'development') 
      return response.status(HttpStatusCode.InternalServerError).json({ error: String(error) });
    return response.status(HttpStatusCode.InternalServerError).json({ error: 'Internal Server Error' });
  }
}

export async function POST(request: express.Request, response: express.Response) {
  try {
    if ( !database || !database.pool )
      return response.status(HttpStatusCode.ServiceUnavailable).json({ error: 'Service Unavailable' });
    const { authorization } = request.headers;
    const { c, id } = request.query;
    if (!authorization) 
      return response.status(HttpStatusCode.Unauthorized).json({ error: 'Unauthorized' });
    if ( !id || !c )
      return response.status(HttpStatusCode.BadRequest).json({ error: 'Missing required parameters' });
    const tokenType = authorization.split(' ')[0];
    const tokenKey = authorization.split(' ')[1];
    const videoId = String(id);
    const channelId = String(c);
    const user = await fetchUserByOAuthAccessToken(tokenType, tokenKey);
    if (!user) 
      return response.status(HttpStatusCode.Unauthorized).json({ error: 'Unauthorized' });
    if ( !channelId || !(await IsValidChannel(channelId)) )
      return response.status(HttpStatusCode.BadRequest).json({ error: 'Invalid channelId' });
    const video = videoId ? await getVideo(videoId) : null;
    if ( !videoId || !video )
      return response.status(HttpStatusCode.BadRequest).json({ error: 'Invalid videoId' });
    if ( video.result.v1?.artist.artistId !== channelId )
      return response.status(HttpStatusCode.BadRequest).json({ error: 'Cannot authorized this video, please ensure artistId is correct?' });
    if ( redisClient?.redis )
      redisClient.redis.multi().hset(`user:${user.id}:favorite`,videoId,JSON.stringify(video.result)).expire(`user:${user.id}:favorite`,86400);
    database.pool.query(
      `INSERT IGNORE INTO favorite_track (uid, target, source, cache, cache_lastupdated) VALUES (?, ?, ?, ?, ?)`,
      [user.id, videoId, channelId, JSON.stringify(video.result), new Date().getTime()]
    );
    return response.status(HttpStatusCode.Ok).json({ message: 'Ok' });
  } catch (error) {
    if ( process.env.NODE_ENV === 'development' ) return response.status(HttpStatusCode.InternalServerError).json({ error: String(error) });
    return response.status(HttpStatusCode.InternalServerError).json({ error: 'Internal Server Error' });
  }
}

export async function DELETE(request: express.Request, response: express.Response) {
  try {
    if ( !database || !database.pool )
      return response.status(HttpStatusCode.ServiceUnavailable).json({ error: 'Service Unavailable' });
    const { authorization } = request.headers;
    const { c, id } = request.query;
    if (!authorization) 
      return response.status(HttpStatusCode.Unauthorized).json({ error: 'Unauthorized' });
    if ( !id || !c )
      return response.status(HttpStatusCode.BadRequest).json({ error: 'Missing required parameters' });
    const tokenType = authorization.split(' ')[0];
    const tokenKey = authorization.split(' ')[1];
    const videoId = String(id);
    const channelId = String(c);
    const user = await fetchUserByOAuthAccessToken(tokenType, tokenKey);
    if (!user) 
      return response.status(HttpStatusCode.Unauthorized).json({ error: 'Unauthorized' });
    if ( !channelId || !(await IsValidChannel(channelId)) )
      return response.status(HttpStatusCode.BadRequest).json({ error: 'Invalid channelId' });
    if ( !videoId || !(await IsValidVideo(videoId)) )
      return response.status(HttpStatusCode.BadRequest).json({ error: 'Invalid videoId' });
    if ( redisClient?.redis )
      redisClient.redis.multi().hset(`user:${user.id}:favorite`,channelId,0).expire(`user:${user.id}:favorite`,86400);
    database.pool.query(
      `DELETE FROM favorite_track WHERE uid=? AND target=? AND source=?`,
      [user.id, videoId, channelId]
    );
    return response.status(HttpStatusCode.Ok).json({ message: 'Ok' });
  } catch (error) {
    if ( process.env.NODE_ENV === 'development' ) return response.status(HttpStatusCode.InternalServerError).json({ error: String(error) });
    return response.status(HttpStatusCode.InternalServerError).json({ error: 'Internal Server Error' });
  }
}