import { Elysia } from 'elysia';
import { HttpStatusCode } from 'axios';
import { fetchUserByOAuthAccessToken } from '@/utils/oauth';
import YTMusicAPI from '@/utils/ytmusic-api/request';
import { database, redisClient, ytmusic } from '@/index';

export default new Elysia().get(
  'fetch/:fetch',
  async ({ headers, params, query: queryParams, set }) => {
    try {
      if (!database || !database.pool || !ytmusic.client) {
        set.status = HttpStatusCode.ServiceUnavailable;
        return { error: 'Service Unavailable' };
      }
      const { authorization } = headers;
      const { fetch } = params;
      const { id, type, q: query } = queryParams;
      if (!id || !fetch) {
        set.status = 400;
        return { error: 'Missing required parameters' };
      }
      if (!authorization) {
        set.status = HttpStatusCode.Unauthorized;
        return { error: 'Unauthorized' };
      }
      const tokenType = authorization.split(' ')[0];
      const tokenKey = authorization.split(' ')[1];
      const user = await fetchUserByOAuthAccessToken(tokenType, tokenKey);
      if (!user) {
        set.status = HttpStatusCode.Unauthorized;
        return { error: 'Unauthorized' };
      }
      const queryId = String(id);

      switch (fetch) {
        case 'av': {
          const { t, a } = queryParams; // Title and Artist
          if (!t || !a) {
            set.status = 400;
            return { error: 'Missing required parameters' };
          }
          if (redisClient?.redis)
            if (type === 'song') {
              const value = await redisClient.redis.get(
                `yt:av:${queryId}:song`,
              );
              if (value) {
                set.status = HttpStatusCode.Ok;
                return { message: 'Ok', result: JSON.parse(value) };
              }
            } else if (type === 'video') {
              const value = await redisClient.redis.get(
                `yt:av:${queryId}:video`,
              );
              if (value) {
                set.status = HttpStatusCode.Ok;
                return { message: 'Ok', result: JSON.parse(value) };
              }
            }
          let api_request = `search?query=${encodeURIComponent(
            `"${t.toString()}" ${a.toString()}`,
          )}`;
          api_request += '&limit=1';
          if (type === 'song') api_request += '&filter=songs';
          else if (type === 'video') api_request += '&filter=videos';
          else {
            set.status = HttpStatusCode.MethodNotAllowed;
            return { error: 'Method Not Allowed' };
          }
          const searchResult = await YTMusicAPI(
            'GET',
            api_request.toString(),
          ).catch(() => {
            redisClient?.redis.setex(`yt:av:${queryId}:${type}`, 300, '');
          });
          if (!searchResult || searchResult.data.result.length === 0) {
            set.status = HttpStatusCode.NotFound;
            return { message: 'Not Found' };
          }
          const result = searchResult.data.result[0];
          if (
            result.resultType === 'song' ||
            // && result.album.name === t.toString()
            // && (result.artists as Array<ArtistBasic>).some(artist => artist.name === a)
            result.resultType === 'video'
            // && (result.title as String).includes(t.toString())
            // && (result.artists as Array<ArtistBasic>).some(artist => artist.name === a)
          ) {
            redisClient?.redis.setex(
              `yt:av:${queryId}:${type}`,
              1800,
              JSON.stringify(result),
            );
            set.status = HttpStatusCode.Ok;
            return { message: 'Ok', result };
          }
          set.status = HttpStatusCode.NotFound;
          return { message: 'Not Found', result };
        }
        case 'related': {
          if (redisClient?.redis) {
            const watch_playlist = await redisClient.redis.get(
              `yt:watch_playlist:${queryId}`,
            );
            const related = await redisClient.redis.get(
              `yt:related:${queryId}`,
            );
            if (related) {
              set.status = HttpStatusCode.Ok;
              return {
                message: 'Ok',
                result: {
                  watch_playlist: watch_playlist
                    ? JSON.parse(watch_playlist)
                    : null,
                  related: related ? JSON.parse(related) : null,
                },
              };
            }
          }
          const getSongWatchPlaylist = await YTMusicAPI(
            'GET',
            `watch/playlist/${queryId}`,
          ).catch(() => {
            redisClient?.redis.setex(`yt:watch_playlist:${queryId}`, 600, '');
          });
          const getSongRelated = await YTMusicAPI(
            'GET',
            `browse/song_related/${queryId}`,
          ).catch(() => {
            redisClient?.redis.setex(`yt:related:${queryId}`, 600, '');
          });
          if (!getSongRelated && !getSongWatchPlaylist) {
            set.status = HttpStatusCode.NotFound;
            return { message: 'Not Found', var: 'SongRelated' };
          }
          if (redisClient?.redis) {
            if (getSongWatchPlaylist && getSongWatchPlaylist?.data?.result)
              redisClient.redis.setex(
                `yt:watch_playlist:${queryId}`,
                43200,
                JSON.stringify(getSongWatchPlaylist?.data.result),
              );
            if (getSongRelated && getSongRelated?.data?.related_content)
              redisClient.redis.setex(
                `yt:related:${queryId}`,
                43200,
                JSON.stringify(getSongRelated?.data.related_content),
              );
          }
          set.status = HttpStatusCode.Ok;
          return {
            message: 'Ok',
            result: {
              watch_playlist: getSongWatchPlaylist
                ? getSongWatchPlaylist.data.result
                : null,
              related: getSongRelated
                ? getSongRelated.data.related_content
                : null,
            },
          };
        }
        case 'channel': {
          if (!query) {
            if (redisClient?.redis) {
              let redis_artist_detail_v1 = await redisClient.redis.get(
                `yt:artist:v1:${queryId}`,
              );
              let redis_artist_detail_v2 = await redisClient.redis.get(
                `yt:artist:v2:${queryId}:info`,
              );
              let redis_user_detail = await redisClient.redis.get(
                `yt:user:${queryId}:info`,
              );
              if (
                redis_artist_detail_v1 ||
                redis_artist_detail_v2 ||
                redis_user_detail
              ) {
                if (!redis_artist_detail_v1 && redis_artist_detail_v1 !== '') {
                  const fetch = await ytmusic.client
                    .getArtist(queryId)
                    .catch(() => {
                      redisClient?.redis.setex(
                        `yt:artist:v1:${queryId}`,
                        600,
                        '',
                      );
                    });
                  if (fetch) {
                    redis_artist_detail_v1 = JSON.stringify(fetch);
                    redisClient?.redis.setex(
                      `yt:artist:v1:${queryId}`,
                      1800,
                      redis_artist_detail_v1,
                    );
                  }
                }
                if (!redis_artist_detail_v2 && redis_artist_detail_v2 !== '') {
                  const fetch = await YTMusicAPI(
                    'GET',
                    `browse/artist/${encodeURIComponent(queryId)}`,
                  ).catch(() => {
                    redisClient?.redis.setex(
                      `yt:artist:v2:${queryId}:info`,
                      600,
                      '',
                    );
                  });
                  if (fetch) {
                    redis_artist_detail_v2 = JSON.stringify(fetch.data.result);
                    redisClient?.redis.setex(
                      `yt:artist:v2:${queryId}:info`,
                      1800,
                      redis_artist_detail_v2,
                    );
                  }
                }
                if (!redis_user_detail && redis_user_detail !== '') {
                  const fetch = await YTMusicAPI(
                    'GET',
                    `browse/user/${encodeURIComponent(queryId)}`,
                  ).catch(() => {
                    redisClient?.redis.setex(
                      `yt:user:${queryId}:info`,
                      600,
                      '',
                    );
                  });
                  if (fetch) {
                    redis_user_detail = JSON.stringify(fetch.data.result);
                    redisClient?.redis.setex(
                      `yt:user:${queryId}:info`,
                      1800,
                      redis_user_detail,
                    );
                  }
                }
                const safeRedisArtistDetailV1 =
                  redis_artist_detail_v1 && redis_artist_detail_v1 !== ''
                    ? JSON.parse(redis_artist_detail_v1)
                    : null;
                const safeRedisArtistDetailV2 =
                  redis_artist_detail_v2 && redis_artist_detail_v2 !== ''
                    ? JSON.parse(redis_artist_detail_v2)
                    : null;
                const safeRedisUsrDetail =
                  redis_user_detail && redis_user_detail !== ''
                    ? JSON.parse(redis_user_detail)
                    : null;
                set.status = HttpStatusCode.Ok;
                return {
                  message: 'Ok',
                  result: {
                    v1: safeRedisArtistDetailV1,
                    v2: safeRedisArtistDetailV2,
                    user: safeRedisUsrDetail,
                  },
                };
              }
            }

            const artist_detail_v1 = await ytmusic.client
              .getArtist(queryId)
              .catch(() => {
                redisClient?.redis.setex(`yt:artist:v1:${queryId}`, 600, '');
              });
            const usr_detail = await YTMusicAPI(
              'GET',
              `browse/user/${encodeURIComponent(queryId)}`,
            ).catch(() => {
              redisClient?.redis.setex(`yt:user:${queryId}:info`, 600, '');
            });
            const artist_detail_v2 = await YTMusicAPI(
              'GET',
              `browse/artist/${encodeURIComponent(queryId)}`,
            ).catch(() => {
              redisClient?.redis.setex(`yt:artist:v2:${queryId}:info`, 600, '');
            });

            // Extract only the necessary data to avoid circular references
            const safeArtistDetailV1 = artist_detail_v1
              ? { ...artist_detail_v1 }
              : null;
            const safeArtistDetailV2 = artist_detail_v2
              ? { ...artist_detail_v2.data.result }
              : null;
            const safeUsrDetail = usr_detail
              ? { ...usr_detail.data.result }
              : null;

            if (safeArtistDetailV1)
              redisClient?.redis.setex(
                `yt:artist:v1:${queryId}`,
                1800,
                JSON.stringify(safeArtistDetailV1),
              );
            if (safeArtistDetailV2)
              redisClient?.redis.setex(
                `yt:artist:v2:${queryId}:info`,
                1800,
                JSON.stringify(safeArtistDetailV2),
              );
            if (safeUsrDetail)
              redisClient?.redis.setex(
                `yt:user:${queryId}:info`,
                1800,
                JSON.stringify(safeUsrDetail),
              );

            set.status = HttpStatusCode.Ok;
            return {
              message: 'Ok',
              result: {
                v1: safeArtistDetailV1,
                v2: safeArtistDetailV2,
                user: safeUsrDetail,
              },
            };
          } else {
            switch (query) {
              case 'videos': {
                if (redisClient?.redis) {
                  const artist_videos = await redisClient.redis.get(
                    `yt:artist:v2:${queryId}:videos`,
                  );
                  if (artist_videos) {
                    set.status = HttpStatusCode.Ok;
                    return { message: 'Ok', result: JSON.parse(artist_videos) };
                  }
                  const user_videos = await redisClient.redis.get(
                    `yt:user:${queryId}:videos`,
                  );
                  if (user_videos) {
                    set.status = HttpStatusCode.Ok;
                    return { message: 'Ok', result: JSON.parse(user_videos) };
                  }
                }
                const artist_Result = await YTMusicAPI(
                  'GET',
                  `browse/artist/${encodeURIComponent(queryId)}/videos`,
                ).catch(() => {
                  redisClient?.redis.setex(
                    `yt:artist:v2:${queryId}:videos`,
                    600,
                    '',
                  );
                });
                if (artist_Result) {
                  redisClient?.redis.setex(
                    `yt:artist:v2:${queryId}:videos`,
                    900,
                    JSON.stringify(artist_Result.data.result),
                  );
                  set.status = HttpStatusCode.Ok;
                  return { message: 'Ok', result: artist_Result.data.result };
                }
                const user_Result = await YTMusicAPI(
                  'GET',
                  `browse/user/${encodeURIComponent(queryId)}/videos`,
                ).catch(() => {
                  redisClient?.redis.setex(
                    `yt:user:${queryId}:videos`,
                    600,
                    '',
                  );
                });
                if (!user_Result) {
                  set.status = HttpStatusCode.NotFound;
                  return { message: 'Not Found' };
                }
                redisClient?.redis.setex(
                  `yt:user:${queryId}:videos`,
                  900,
                  JSON.stringify(user_Result.data.result),
                );
                set.status = HttpStatusCode.Ok;
                return { message: 'Ok', result: user_Result.data.result };
              }
              default: {
                set.status = 400;
                return { error: 'Invalid query' };
              }
            }
          }
        }
        case 'user': {
          if (!query) {
            if (redisClient?.redis) {
              const value = await redisClient.redis.get(
                `yt:user:${queryId}:info`,
              );
              if (value) {
                set.status = HttpStatusCode.Ok;
                return { message: 'Ok', result: JSON.parse(value) };
              }
            }
            const searchResult = await YTMusicAPI(
              'GET',
              `browse/user/${encodeURIComponent(queryId)}`,
            ).catch(() => {
              redisClient?.redis.setex(`yt:user:${queryId}:info`, 600, '');
            });
            if (!searchResult) {
              set.status = HttpStatusCode.NotFound;
              return { message: 'Not Found' };
            }
            redisClient?.redis.setex(
              `yt:user:${queryId}:info`,
              1800,
              JSON.stringify(searchResult.data.result),
            );
            set.status = HttpStatusCode.Ok;
            return { message: 'Ok', result: searchResult.data.result };
          } else {
            switch (query) {
              case 'videos': {
                if (redisClient?.redis) {
                  const value = await redisClient.redis.get(
                    `yt:user:${queryId}:videos`,
                  );
                  if (value) {
                    set.status = HttpStatusCode.Ok;
                    return { message: 'Ok', result: JSON.parse(value) };
                  }
                }
                const searchResult = await YTMusicAPI(
                  'GET',
                  `browse/user/${encodeURIComponent(queryId)}/videos`,
                ).catch(() => {
                  redisClient?.redis.setex(
                    `yt:user:${queryId}:videos`,
                    600,
                    '',
                  );
                });
                if (!searchResult) {
                  set.status = HttpStatusCode.NotFound;
                  return { message: 'Not Found' };
                }
                redisClient?.redis.setex(
                  `yt:user:${queryId}:videos`,
                  900,
                  JSON.stringify(searchResult.data.result),
                );
                set.status = HttpStatusCode.Ok;
                return { message: 'Ok', result: searchResult.data.result };
              }
              default: {
                set.status = 400;
                return { error: 'Invalid query' };
              }
            }
          }
        }
        case 'album': {
          if (redisClient?.redis) {
            const value = await redisClient.redis.get(`yt:album:v2:${queryId}`);
            if (value) {
              set.status = HttpStatusCode.Ok;
              return { message: 'Ok', result: JSON.parse(value) };
            }
          }
          const searchResult = await YTMusicAPI(
            'GET',
            `browse/album/${encodeURIComponent(queryId)}`,
          ).catch(() => {
            redisClient?.redis.setex(`yt:album:v2:${queryId}`, 600, '');
          });
          if (!searchResult) {
            set.status = HttpStatusCode.NotFound;
            return { message: 'Not Found' };
          }
          redisClient?.redis.setex(
            `yt:album:v2:${queryId}`,
            1800,
            JSON.stringify(searchResult.data.result),
          );
          set.status = HttpStatusCode.Ok;
          return { message: 'Ok', result: searchResult.data.result };
        }
        case 'artist': {
          if (!query) {
            if (redisClient?.redis) {
              const value = await redisClient.redis.get(
                `yt:artist:v2:${queryId}:info`,
              );
              if (value) {
                set.status = HttpStatusCode.Ok;
                return { message: 'Ok', result: JSON.parse(value) };
              }
            }
            const searchResult = await YTMusicAPI(
              'GET',
              `browse/artist/${encodeURIComponent(queryId)}`,
            ).catch(() => {
              redisClient?.redis.setex(`yt:artist:v2:${queryId}:info`, 600, '');
            });
            if (!searchResult) {
              set.status = HttpStatusCode.NotFound;
              return { message: 'Not Found' };
            }
            redisClient?.redis.setex(
              `yt:artist:v2:${queryId}:info`,
              1800,
              JSON.stringify(searchResult.data.result),
            );
            set.status = HttpStatusCode.Ok;
            return { message: 'Ok', result: searchResult.data.result };
          } else {
            switch (query) {
              case 'videos': {
                if (redisClient?.redis) {
                  const value = await redisClient.redis.get(
                    `yt:artist:v2:${queryId}:videos`,
                  );
                  if (value) {
                    set.status = HttpStatusCode.Ok;
                    return { message: 'Ok', result: JSON.parse(value) };
                  }
                }
                const searchResult = await YTMusicAPI(
                  'GET',
                  `browse/artist/${encodeURIComponent(queryId)}/videos`,
                ).catch(() => {
                  redisClient?.redis.setex(
                    `yt:artist:v2:${queryId}:videos`,
                    600,
                    '',
                  );
                });
                if (!searchResult) {
                  set.status = HttpStatusCode.NotFound;
                  return { message: 'Not Found' };
                }
                redisClient?.redis.setex(
                  `yt:artist:v2:${queryId}:videos`,
                  900,
                  JSON.stringify(searchResult.data.result),
                );
                set.status = HttpStatusCode.Ok;
                return { message: 'Ok', result: searchResult.data.result };
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
              `yt:playlist:v2:${queryId}`,
            );
            if (value) {
              set.status = HttpStatusCode.Ok;
              return { message: 'Ok', result: JSON.parse(value) };
            }
          }
          const searchResult = await YTMusicAPI(
            'GET',
            `playlists/${encodeURIComponent(queryId)}`,
          ).catch(() => {
            redisClient?.redis.setex(`yt:playlist:v2:${queryId}`, 600, '');
          });
          if (!searchResult) {
            set.status = HttpStatusCode.NotFound;
            return { message: 'Not Found' };
          }
          redisClient?.redis.setex(
            `yt:playlist:v2:${queryId}`,
            1800,
            JSON.stringify(searchResult.data.result),
          );
          set.status = HttpStatusCode.Ok;
          return { message: 'Ok', result: searchResult.data.result };
        }
        default: {
          set.status = 400;
          return { error: 'Invalid type' };
        }
      }
    } catch (err: any) {
      if (process.env.NODE_ENV === 'development') {
        set.status = HttpStatusCode.InternalServerError;
        return { error: 'Internal Server Error', debug: String(err) };
      }
      set.status = HttpStatusCode.InternalServerError;
      return { error: 'Internal Server Error' };
    }
  },
);
