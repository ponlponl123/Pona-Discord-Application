import { Elysia, t } from 'elysia';
import { HttpStatusCode } from '@/types/http';
import { container } from '@/core/container';
import { prisma } from '@/prisma';
import { fetchUserByOAuthAccessToken } from '@/utils/oauth';
import { IsValidChannel } from '@/utils/ytmusic-api/getChannel';
import { getVideo, IsValidVideo } from '@/utils/ytmusic-api/getVideo';

export default new Elysia()
  .get(
    '/favorite',
    async ({ headers, query, set }) => {
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
        const user: any = await fetchUserByOAuthAccessToken(
          tokenType,
          tokenKey,
        );
        if (!user) {
          set.status = HttpStatusCode.Unauthorized;
          return { error: 'Unauthorized' };
        }

        const fetched: { [key: string]: boolean } = {};
        const promises = bulk_fetch.map(async (videoId) => {
          if (!videoId) return;
          if (container.redis?.redis) {
            const value = await container.redis.redis.hget(
              `user:${user.id}:favorite`,
              videoId,
            );
            if (value) {
              fetched[videoId] = value !== '0';
              return;
            }
          }
          
          const fetchDB = await prisma.favorite_track.findFirst({
            where: {
              uid: user.id,
              target: videoId,
            },
            select: {
              cache_lastupdated: true,
            },
          });

          if (fetchDB) {
            const now = new Date();
            const lastUpdated = fetchDB.cache_lastupdated || new Date(0);
            if (
              lastUpdated.getTime() >
              now.getTime() - 86400000
            ) {
              const fetchVideo = await getVideo(videoId);
              if (fetchVideo) {
                const channelId =
                  (fetchVideo.result as any).v1?.artist.artistId ||
                  (fetchVideo.result as any).v2?.artists[0].id;
                
                await prisma.favorite_track.updateMany({
                  where: {
                    uid: user.id,
                    target: videoId,
                    source: channelId,
                  },
                  data: {
                    cache: JSON.stringify(fetchVideo.result),
                    cache_lastupdated: now,
                  },
                });

                if (container.redis?.redis)
                  container.redis.redis
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
          if (container.redis?.redis)
            container.redis.redis
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
        id: t.String(),
      }),
    },
  )
  .post(
    '/favorite',
    async ({ headers, query, set }) => {
      try {
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
        if (container.redis?.redis)
          container.redis.redis
            .multi()
            .hset(
              `user:${user.id}:favorite`,
              videoId,
              JSON.stringify(video.result),
            )
            .expire(`user:${user.id}:favorite`, 86400);

        await prisma.favorite_track.upsert({
          where: {
            uid_target: {
              uid: user.id,
              target: videoId,
            },
          },
          update: {
            source: channelId,
            cache: JSON.stringify(video.result),
            cache_lastupdated: new Date(),
          },
          create: {
            uid: user.id,
            target: videoId,
            source: channelId,
            cache: JSON.stringify(video.result),
            cache_lastupdated: new Date(),
          },
        });

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
        id: t.String(),
      }),
    },
  )
  .delete(
    '/favorite',
    async ({ headers, query, set }) => {
      try {
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
        if (!videoId || !(await IsValidVideo(videoId))) {
          set.status = HttpStatusCode.BadRequest;
          return { error: 'Invalid videoId' };
        }
        if (container.redis?.redis)
          container.redis.redis
            .multi()
            .hset(`user:${user.id}:favorite`, channelId, 0)
            .expire(`user:${user.id}:favorite`, 86400);

        await prisma.favorite_track.deleteMany({
          where: {
            uid: user.id,
            target: videoId,
            source: channelId,
          },
        });

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
        id: t.String(),
      }),
    },
  );

