import { Elysia } from 'elysia';
import { HttpStatusCode } from 'axios';
import { database, redisClient } from '@/index';
import { fetchUserByOAuthAccessToken } from '@/utils/oauth';
import { IsValidChannel } from '@/utils/ytmusic-api/getChannel';
import { getVideo, IsValidVideo } from '@/utils/ytmusic-api/getVideo';

export default new Elysia()
  .get('/favorite', async ({ headers, query, set }) => {
    try {
      const { authorization } = headers;
      const { id } = query;
      if (!authorization) {
        set.status = HttpStatusCode.Unauthorized;
        return { error: 'Unauthorized' };
      }
      if (!id) {
        set.status = HttpStatusCode.BadRequest;
        return { error: 'Missing required parameters' };
      }
      const tokenType = authorization.split(' ')[0];
      const tokenKey = authorization.split(' ')[1];
      const rawVideoIdQuery = String(id);
      const bulk_fetch = rawVideoIdQuery.includes(',')
        ? rawVideoIdQuery.split(',')
        : [rawVideoIdQuery];
      const user: any = await fetchUserByOAuthAccessToken(tokenType, tokenKey);
      if (!user) {
        set.status = HttpStatusCode.Unauthorized;
        return { error: 'Unauthorized' };
      }

      const fetched: { [key: string]: boolean } = {};
      const promises = bulk_fetch.map(async (videoId) => {
        if (!videoId) return;
        if (redisClient?.redis) {
          const value = await redisClient.redis.hget(
            `user:${user.id}:favorite`,
            videoId,
          );
          if (value) {
            fetched[videoId] = value !== '0';
            return;
          }
        }
        if (!database || !database.pool) {
          set.status = HttpStatusCode.ServiceUnavailable;
          return { error: 'Service Unavailable' };
        }
        const fetchDB = await database.query(
          `SELECT cache_lastupdated FROM favorite_track WHERE uid=? AND target=?`,
          [user.id, videoId],
        );
        if (fetchDB.length > 0) {
          if (fetchDB[0].cache_lastupdated > new Date().getTime() - 86400000) {
            const fetchVideo = await getVideo(videoId);
            if (fetchVideo) {
              const channelId =
                fetchVideo.result.v1?.artist.artistId ||
                fetchVideo.result.v2?.artists[0].id;
              await database.query(
                `UPDATE favorite_track SET cache=?, cache_lastupdated=? WHERE uid=? AND target=? AND source=?`,
                [
                  JSON.stringify(fetchVideo.result),
                  new Date().getTime(),
                  user.id,
                  videoId,
                  channelId,
                ],
              );
              if (redisClient?.redis)
                redisClient.redis
                  .multi()
                  .hset(
                    `user:${user.id}:favorite`,
                    videoId,
                    JSON.stringify(fetchVideo.result),
                  )
                  .expire(`user:${user.id}:favorite`, 86400);
            }
          }
          fetched[videoId] = true;
          return;
        }
        if (redisClient?.redis)
          redisClient.redis
            .multi()
            .hset(`user:${user.id}:favorite`, videoId, 0)
            .expire(`user:${user.id}:favorite`, 86400);
        fetched[videoId] = false;
      });

      await Promise.all(promises);

      set.status = HttpStatusCode.Ok;
      return {
        message: 'Ok',
        result: fetched,
      };
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        set.status = HttpStatusCode.InternalServerError;
        return { error: String(error) };
      }
      set.status = HttpStatusCode.InternalServerError;
      return { error: 'Internal Server Error' };
    }
  })
  .post('/favorite', async ({ headers, query, set }) => {
    try {
      if (!database || !database.pool) {
        set.status = HttpStatusCode.ServiceUnavailable;
        return { error: 'Service Unavailable' };
      }
      const { authorization } = headers;
      const { c, id } = query;
      if (!authorization) {
        set.status = HttpStatusCode.Unauthorized;
        return { error: 'Unauthorized' };
      }
      if (!id || !c) {
        set.status = HttpStatusCode.BadRequest;
        return { error: 'Missing required parameters' };
      }
      const tokenType = authorization.split(' ')[0];
      const tokenKey = authorization.split(' ')[1];
      const videoId = String(id);
      const channelId = String(c);
      const user: any = await fetchUserByOAuthAccessToken(tokenType, tokenKey);
      if (!user) {
        set.status = HttpStatusCode.Unauthorized;
        return { error: 'Unauthorized' };
      }
      if (!channelId || !(await IsValidChannel(channelId))) {
        set.status = HttpStatusCode.BadRequest;
        return { error: 'Invalid channelId' };
      }
      const video: any = videoId ? await getVideo(videoId) : null;
      if (!videoId || !video) {
        set.status = HttpStatusCode.BadRequest;
        return { error: 'Invalid videoId' };
      }
      if (video.result.v1?.artist.artistId !== channelId) {
        set.status = HttpStatusCode.BadRequest;
        return {
          error:
            'Cannot authorized this video, please ensure artistId is correct?',
        };
      }
      if (redisClient?.redis)
        redisClient.redis
          .multi()
          .hset(
            `user:${user.id}:favorite`,
            videoId,
            JSON.stringify(video.result),
          )
          .expire(`user:${user.id}:favorite`, 86400);
      database.query(
        `INSERT IGNORE INTO favorite_track (uid, target, source, cache, cache_lastupdated) VALUES (?, ?, ?, ?, ?)`,
        [
          user.id,
          videoId,
          channelId,
          JSON.stringify(video.result),
          new Date().getTime(),
        ],
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
  })
  .delete('/favorite', async ({ headers, query, set }) => {
    try {
      if (!database || !database.pool) {
        set.status = HttpStatusCode.ServiceUnavailable;
        return { error: 'Service Unavailable' };
      }
      const { authorization } = headers;
      const { c, id } = query;
      if (!authorization) {
        set.status = HttpStatusCode.Unauthorized;
        return { error: 'Unauthorized' };
      }
      if (!id || !c) {
        set.status = HttpStatusCode.BadRequest;
        return { error: 'Missing required parameters' };
      }
      const tokenType = authorization.split(' ')[0];
      const tokenKey = authorization.split(' ')[1];
      const videoId = String(id);
      const channelId = String(c);
      const user: any = await fetchUserByOAuthAccessToken(tokenType, tokenKey);
      if (!user) {
        set.status = HttpStatusCode.Unauthorized;
        return { error: 'Unauthorized' };
      }
      if (!channelId || !(await IsValidChannel(channelId))) {
        set.status = HttpStatusCode.BadRequest;
        return { error: 'Invalid channelId' };
      }
      if (!videoId || !(await IsValidVideo(videoId))) {
        set.status = HttpStatusCode.BadRequest;
        return { error: 'Invalid videoId' };
      }
      if (redisClient?.redis)
        redisClient.redis
          .multi()
          .hset(`user:${user.id}:favorite`, channelId, 0)
          .expire(`user:${user.id}:favorite`, 86400);
      database.query(
        `DELETE FROM favorite_track WHERE uid=? AND target=? AND source=?`,
        [user.id, videoId, channelId],
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
  });
