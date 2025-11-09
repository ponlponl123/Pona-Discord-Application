import { Elysia, t } from 'elysia';
import { HttpStatusCode } from 'axios';
import { fetchUserByOAuthAccessToken } from '@/utils/oauth';
import { database, redisClient, ytmusic } from '@/index';

export default new Elysia().get(
  '/fetch',
  async ({ headers, query: queryParams, set }) => {
    try {
      if (!database || !database.pool || !ytmusic.client) {
        set.status = HttpStatusCode.ServiceUnavailable;
        return { error: 'Service Unavailable' };
      }
      const { authorization } = headers;
      const { id, type, q: query } = queryParams;
      if (!id || !type) {
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
      const queryId = String(id);

      switch (type) {
        case 'album': {
          if (redisClient?.redis) {
            const value = await redisClient.redis.get(`yt:album:v1:${queryId}`);
            if (value) {
              set.status = HttpStatusCode.Ok;
              return { message: 'Ok', result: JSON.parse(value) };
            }
          }
          const searchResult = await ytmusic.client
            .getAlbum(queryId)
            .catch(() => {
              redisClient?.redis.setex(`yt:album:v1:${queryId}`, 600, '');
            });
          if (!searchResult) {
            set.status = HttpStatusCode.NotFound;
            return { message: 'Not Found' };
          }
          redisClient?.redis.setex(
            `yt:album:v1:${queryId}`,
            5400,
            JSON.stringify(searchResult),
          );
          set.status = HttpStatusCode.Ok;
          return { message: 'Ok', result: searchResult };
        }
        case 'song': {
          if (redisClient?.redis) {
            const value = await redisClient.redis.get(`yt:song:v1:${queryId}`);
            if (value) {
              set.status = HttpStatusCode.Ok;
              return { message: 'Ok', result: JSON.parse(value) };
            }
          }
          const searchResult = await ytmusic.client
            .getSong(queryId)
            .catch(() => {
              redisClient?.redis.setex(`yt:song:v1:${queryId}`, 600, '');
            });
          if (!searchResult) {
            set.status = HttpStatusCode.NotFound;
            return { message: 'Not Found' };
          }
          redisClient?.redis.setex(
            `yt:song:v1:${queryId}`,
            5400,
            JSON.stringify(searchResult),
          );
          set.status = HttpStatusCode.Ok;
          return { message: 'Ok', result: searchResult };
        }
        case 'video': {
          if (redisClient?.redis) {
            const value = await redisClient.redis.get(`yt:video:v1:${queryId}`);
            if (value) {
              set.status = HttpStatusCode.Ok;
              return { message: 'Ok', result: JSON.parse(value) };
            }
          }
          const searchResult = await ytmusic.client
            .getVideo(queryId)
            .catch(() => {
              redisClient?.redis.setex(`yt:video:v1:${queryId}`, 600, '');
            });
          if (!searchResult) {
            set.status = HttpStatusCode.NotFound;
            return { message: 'Not Found' };
          }
          redisClient?.redis.setex(
            `yt:video:v1:${queryId}`,
            5400,
            JSON.stringify(searchResult),
          );
          set.status = HttpStatusCode.Ok;
          return { message: 'Ok', result: searchResult };
        }
        case 'artist': {
          if (!query) {
            if (redisClient?.redis) {
              const value = await redisClient.redis
                .get(`yt:artist:v1:info:${queryId}`)
                .catch(() => {
                  redisClient?.redis.setex(
                    `yt:artist:v1:info:${queryId}`,
                    600,
                    '',
                  );
                });
              if (value) {
                set.status = HttpStatusCode.Ok;
                return { message: 'Ok', result: JSON.parse(value) };
              }
            }
            const searchResult = await ytmusic.client.getArtist(queryId);
            if (!searchResult) {
              set.status = HttpStatusCode.NotFound;
              return { message: 'Not Found' };
            }
            redisClient?.redis.setex(
              `yt:artist:v1:${queryId}`,
              1800,
              JSON.stringify(searchResult),
            );
            set.status = HttpStatusCode.Ok;
            return { message: 'Ok', result: searchResult };
          } else {
            switch (query) {
              case 'albums': {
                if (redisClient?.redis) {
                  const value = await redisClient.redis.get(
                    `yt:artist:v1:albums:${queryId}`,
                  );
                  if (value) {
                    set.status = HttpStatusCode.Ok;
                    return { message: 'Ok', result: JSON.parse(value) };
                  }
                }
                const searchResult = await ytmusic.client
                  .getArtistAlbums(queryId)
                  .catch(() => {
                    redisClient?.redis.setex(
                      `yt:artist:v1:albums:${queryId}`,
                      600,
                      '',
                    );
                  });
                if (!searchResult) {
                  set.status = HttpStatusCode.NotFound;
                  return { message: 'Not Found' };
                }
                redisClient?.redis.setex(
                  `yt:artist:v1:albums:${queryId}`,
                  1800,
                  JSON.stringify(searchResult),
                );
                set.status = HttpStatusCode.Ok;
                return { message: 'Ok', result: searchResult };
              }
              case 'songs': {
                if (redisClient?.redis) {
                  const value = await redisClient.redis.get(
                    `yt:artist:v1:songs:${queryId}`,
                  );
                  if (value) {
                    set.status = HttpStatusCode.Ok;
                    return { message: 'Ok', result: JSON.parse(value) };
                  }
                }
                const searchResult = await ytmusic.client
                  .getArtistSongs(queryId)
                  .catch(() => {
                    redisClient?.redis.setex(
                      `yt:artist:v1:songs:${queryId}`,
                      600,
                      '',
                    );
                  });
                if (!searchResult) {
                  set.status = HttpStatusCode.NotFound;
                  return { message: 'Not Found' };
                }
                redisClient?.redis.setex(
                  `yt:artist:v1:songs:${queryId}`,
                  1800,
                  JSON.stringify(searchResult),
                );
                set.status = HttpStatusCode.Ok;
                return { message: 'Ok', result: searchResult };
              }
              default: {
                set.status = 400;
                return { error: 'Invalid query' };
              }
            }
          }
        }
        case 'playlist': {
          if (redisClient?.redis) {
            const value = await redisClient.redis.get(
              `yt:playlist:v1:${queryId}`,
            );
            if (value) {
              set.status = HttpStatusCode.Ok;
              return { message: 'Ok', result: JSON.parse(value) };
            }
          }
          const searchResult = await ytmusic.client
            .getPlaylist(queryId)
            .catch(() => {
              redisClient?.redis.setex(`yt:playlist:v1:${queryId}`, 600, '');
            });
          if (!searchResult) {
            set.status = HttpStatusCode.NotFound;
            return { message: 'Not Found' };
          }
          const videos = await ytmusic.client.getPlaylistVideos(queryId);

          // Handle null videoCount by setting it to the actual video count or 0
          const sanitizedResult = {
            ...searchResult,
            videoCount: searchResult.videoCount ?? videos?.length ?? 0,
            videos,
          };

          redisClient?.redis.setex(
            `yt:playlist:v1:${queryId}`,
            1800,
            JSON.stringify(sanitizedResult),
          );
          set.status = HttpStatusCode.Ok;
          return { message: 'Ok', result: sanitizedResult };
        }
        default: {
          set.status = 400;
          return { error: 'Invalid type' };
        }
      }
    } catch (err) {
      console.error(err);
      if (process.env.NODE_ENV === 'development') {
        set.status = HttpStatusCode.InternalServerError;
        return { error: 'Internal Server Error', debug: err };
      }
      set.status = HttpStatusCode.InternalServerError;
      return { error: 'Internal Server Error' };
    }
  },
  {
    query: t.Object({
      id: t.String(),
      type: t.String(),
      q: t.Optional(t.String()),
    }),
  },
);
