import express from 'express';
import { HttpStatusCode } from 'axios';
import { fetchUserByOAuthAccessToken } from '@/utils/oauth';
import YTMusicAPI from '@/utils/ytmusic-api/request';
import { database, redisClient, ytmusic } from '@/index';

export const path = '/:fetch?';

export async function GET(request: express.Request, response: express.Response) {
  try {
    if ( !database || !database.pool || !ytmusic.client ) return response.status(HttpStatusCode.ServiceUnavailable).json({error: 'Service Unavailable'});
    const { authorization } = request.headers;
    const { fetch } = request.params;
    const { id, type, query } = request.query;
    if ( !id || !fetch ) return response.status(400).json({ error: "Missing required parameters" });
    if ( !authorization ) return response.status(HttpStatusCode.Unauthorized).json({error: 'Unauthorized'});
    const tokenType = authorization.split(' ')[0];
    const tokenKey = authorization.split(' ')[1];
    const user = await fetchUserByOAuthAccessToken(tokenType, tokenKey);
    if ( !user ) return response.status(HttpStatusCode.Unauthorized).json({error: 'Unauthorized'});
    const queryId = String(id);

    switch ( fetch ) {
        case "av": {
            const { t, a } = request.query; // Title and Artist
            if ( !t || !a ) return response.status(400).json({ error: "Missing required parameters" });
            if ( redisClient?.redis )
                if ( type === 'song' )
                {
                    const value = await redisClient.redis.get(`yt:av:${queryId}:song`);
                    if ( value ) 
                    return response.status(HttpStatusCode.Ok).json({message: 'Ok', result: JSON.parse(value)});
                }
                else if ( type === 'video' )
                {
                    const value = await redisClient.redis.get(`yt:av:${queryId}:video`);
                    if ( value ) 
                    return response.status(HttpStatusCode.Ok).json({message: 'Ok', result: JSON.parse(value)});
                }
            let api_request = `search?query=${encodeURIComponent(`"${t.toString()}" ${a.toString()}`)}`;
            api_request += '&limit=1';
            if ( type === 'song' )
                api_request += '&filter=songs';
            else if ( type === 'video' )
                api_request += '&filter=videos';
            else return response.status(HttpStatusCode.MethodNotAllowed).json({error: 'Method Not Allowed'});
            const searchResult = await YTMusicAPI('GET', api_request.toString()).catch(() => {
                redisClient?.redis.setex(`yt:av:${queryId}:${type}`, 300, '');
            });;
            if ( !searchResult || searchResult.data.result.length === 0 ) return response.status(HttpStatusCode.NotFound).json({message: 'Not Found'});
            const result = searchResult.data.result[0];
            if (
                (
                    result.resultType === 'song'
                    // && result.album.name === t.toString()
                    // && (result.artists as Array<ArtistBasic>).some(artist => artist.name === a)
                ) ||
                (
                    result.resultType === 'video'
                    // && (result.title as String).includes(t.toString())
                    // && (result.artists as Array<ArtistBasic>).some(artist => artist.name === a)
                )
            ) {
                redisClient?.redis.setex(`yt:av:${queryId}:${type}`, 1800, JSON.stringify(result));
                return response.status(HttpStatusCode.Ok).json({message: 'Ok', result});
            }
            return response.status(HttpStatusCode.NotFound).json({message: 'Not Found', result});
        }
        case "related": {
            if ( redisClient?.redis )
            {
                const watch_playlist = await redisClient.redis.get(`yt:watch_playlist:${queryId}`);
                const related = await redisClient.redis.get(`yt:related:${queryId}`);
                if ( related ) 
                return response.status(HttpStatusCode.Ok).json({message: 'Ok', result: {
                    watch_playlist: watch_playlist?JSON.parse(watch_playlist):null,
                    related: related?JSON.parse(related):null
                }});
            }
            const getSongRelated = await YTMusicAPI('GET', `song_related/${queryId}`).catch(() => {
                redisClient?.redis.setex(`yt:related:${queryId}`, 600, '');
            });
            if ( !getSongRelated ) return response.status(HttpStatusCode.NotFound).json({message: 'Not Found', var: 'SongRelated'});
            if ( redisClient?.redis )
            {
                if(getSongRelated.data?.result?.playlist) redisClient.redis.setex(`yt:watch_playlist:${queryId}`, 43200, JSON.stringify(getSongRelated.data.result.playlist));
                if(getSongRelated.data?.result?.related) redisClient.redis.setex(`yt:related:${queryId}`, 43200, JSON.stringify(getSongRelated.data.result.related));
            }
            return response.status(HttpStatusCode.Ok).json({
                message: 'Ok',
                result: {
                    watch_playlist: getSongRelated?getSongRelated.data.result.playlist:null,
                    related: getSongRelated?getSongRelated.data.result.related:null
                }
            });
        }
        case "channel": {
            if ( !query )
            {
                if ( redisClient?.redis )
                {
                    let redis_artist_detail_v1 = await redisClient.redis.get(`yt:artist:v1:${queryId}`);
                    let redis_artist_detail_v2 = await redisClient.redis.get(`yt:artist:v2:${queryId}:info`);
                    let redis_user_detail = await redisClient.redis.get(`yt:user:${queryId}:info`);
                    if ( redis_artist_detail_v1 || redis_artist_detail_v2 || redis_user_detail )
                    {
                        if ( !redis_artist_detail_v1&&redis_artist_detail_v1!=='' )
                        {
                            const fetch = await ytmusic.client.getArtist(queryId).catch(()=>{
                                redisClient?.redis.setex(`yt:artist:v1:${queryId}`, 600, '');
                            });
                            if ( fetch )
                            {
                                redis_artist_detail_v1 = JSON.stringify(fetch);
                                redisClient?.redis.setex(`yt:artist:v1:${queryId}`, 1800, redis_artist_detail_v1);
                            }
                        }
                        if ( !redis_artist_detail_v2&&redis_artist_detail_v2!=='' )
                        {
                            const fetch = await YTMusicAPI('GET', `artist/${encodeURIComponent(queryId)}`).catch(()=>{
                                redisClient?.redis.setex(`yt:artist:v2:${queryId}:info`, 600, '');
                            });
                            if ( fetch )
                            {
                                redis_artist_detail_v2 = JSON.stringify(fetch.data.result);
                                redisClient?.redis.setex(`yt:artist:v2:${queryId}:info`, 1800, redis_artist_detail_v2);
                            }
                        }
                        if ( !redis_user_detail&&redis_user_detail!=='' )
                        {
                            const fetch = await YTMusicAPI('GET', `user/${encodeURIComponent(queryId)}`).catch(()=>{
                                redisClient?.redis.setex(`yt:user:${queryId}:info`, 600, '');
                            });
                            if ( fetch )
                            {
                                redis_user_detail = JSON.stringify(fetch.data.result);
                                redisClient?.redis.setex(`yt:user:${queryId}:info`, 1800, redis_user_detail);
                            }
                        }
                        const safeRedisArtistDetailV1 = redis_artist_detail_v1&&redis_artist_detail_v1!=='' ? JSON.parse(redis_artist_detail_v1) : null;
                        const safeRedisArtistDetailV2 = redis_artist_detail_v2&&redis_artist_detail_v2!=='' ? JSON.parse(redis_artist_detail_v2) : null;
                        const safeRedisUsrDetail = redis_user_detail&&redis_user_detail!=='' ? JSON.parse(redis_user_detail) : null;
                        return response.status(HttpStatusCode.Ok).json({
                            message: 'Ok',
                            result: {
                                v1: safeRedisArtistDetailV1,
                                v2: safeRedisArtistDetailV2,
                                user: safeRedisUsrDetail,
                            },
                        });
                    }
                }
    
                const artist_detail_v1 = await ytmusic.client.getArtist(queryId).catch(() => {
                    redisClient?.redis.setex(`yt:artist:v1:${queryId}`, 600, '');
                });
                const usr_detail = await YTMusicAPI('GET', `user/${encodeURIComponent(queryId)}`).catch(() => {
                    redisClient?.redis.setex(`yt:user:${queryId}:info`, 600, '');
                });
                const artist_detail_v2 = await YTMusicAPI('GET', `artist/${encodeURIComponent(queryId)}`).catch(() => {
                    redisClient?.redis.setex(`yt:artist:v2:${queryId}:info`, 600, '');
                });
    
                // Extract only the necessary data to avoid circular references
                const safeArtistDetailV1 = artist_detail_v1 ? { ...artist_detail_v1 } : null;
                const safeArtistDetailV2 = artist_detail_v2 ? { ...artist_detail_v2.data.result } : null;
                const safeUsrDetail = usr_detail ? { ...usr_detail.data.result } : null;
    
                if (safeArtistDetailV1) redisClient?.redis.setex(`yt:artist:v1:${queryId}`, 1800, JSON.stringify(safeArtistDetailV1));
                if (safeArtistDetailV2) redisClient?.redis.setex(`yt:artist:v2:${queryId}:info`, 1800, JSON.stringify(safeArtistDetailV2));
                if (safeUsrDetail) redisClient?.redis.setex(`yt:user:${queryId}:info`, 1800, JSON.stringify(safeUsrDetail));
    
                return response.status(HttpStatusCode.Ok).json({
                    message: 'Ok',
                    result: {
                        v1: safeArtistDetailV1,
                        v2: safeArtistDetailV2,
                        user: safeUsrDetail,
                    },
                });
            }
            else
            {
                switch ( query )
                {
                    case "videos": {
                        if ( redisClient?.redis )
                        {
                          const artist_videos = await redisClient.redis.get(`yt:artist:v2:${queryId}:videos`);
                          if ( artist_videos ) 
                            return response.status(HttpStatusCode.Ok).json({message: 'Ok', result: JSON.parse(artist_videos)});
                          const user_videos = await redisClient.redis.get(`yt:user:${queryId}:videos`);
                          if ( user_videos ) 
                            return response.status(HttpStatusCode.Ok).json({message: 'Ok', result: JSON.parse(user_videos)});
                        }
                        const artist_Result = await YTMusicAPI('GET', `artist_videos/${encodeURIComponent(queryId)}`).catch(() => {
                            redisClient?.redis.setex(`yt:artist:v2:${queryId}:videos`, 600, '');
                        });
                        if ( artist_Result )
                        {
                            redisClient?.redis.setex(`yt:artist:v2:${queryId}:videos`, 900, JSON.stringify(artist_Result.data.result));
                            return response.status(HttpStatusCode.Ok).json({message: 'Ok', result: artist_Result.data.result});
                        }
                        const user_Result = await YTMusicAPI('GET', `user_videos/${encodeURIComponent(queryId)}`).catch(() => {
                            redisClient?.redis.setex(`yt:user:${queryId}:videos`, 600, '');
                        });
                        if ( !user_Result ) return response.status(HttpStatusCode.NotFound).json({message: 'Not Found'});
                        redisClient?.redis.setex(`yt:user:${queryId}:videos`, 900, JSON.stringify(user_Result.data.result));
                        return response.status(HttpStatusCode.Ok).json({message: 'Ok', result: user_Result.data.result});
                    }
                    default: {
                        return response.status(400).json({ error: "Invalid query" });
                    }
                }
            }
        }
        case "user": {
            if ( !query )
            {
                if ( redisClient?.redis )
                {
                  const value = await redisClient.redis.get(`yt:user:${queryId}:info`);
                  if ( value ) 
                    return response.status(HttpStatusCode.Ok).json({message: 'Ok', result: JSON.parse(value)});
                }
                const searchResult = await YTMusicAPI('GET', `user/${encodeURIComponent(queryId)}`).catch(() => {
                    redisClient?.redis.setex(`yt:user:${queryId}:info`, 600, '');
                });
                if ( !searchResult ) return response.status(HttpStatusCode.NotFound).json({message: 'Not Found'});
                redisClient?.redis.setex(`yt:user:${queryId}:info`, 1800, JSON.stringify(searchResult.data.result));
                return response.status(HttpStatusCode.Ok).json({message: 'Ok', result: searchResult.data.result});
            }
            else
            {
                switch ( query )
                {
                    case "videos": {
                        if ( redisClient?.redis )
                        {
                          const value = await redisClient.redis.get(`yt:user:${queryId}:videos`);
                          if ( value ) 
                            return response.status(HttpStatusCode.Ok).json({message: 'Ok', result: JSON.parse(value)});
                        }
                        const searchResult = await YTMusicAPI('GET', `user_videos/${encodeURIComponent(queryId)}`).catch(() => {
                            redisClient?.redis.setex(`yt:user:${queryId}:videos`, 600, '');
                        });
                        if ( !searchResult ) return response.status(HttpStatusCode.NotFound).json({message: 'Not Found'});
                        redisClient?.redis.setex(`yt:user:${queryId}:videos`, 900, JSON.stringify(searchResult.data.result));
                        return response.status(HttpStatusCode.Ok).json({message: 'Ok', result: searchResult.data.result});
                    }
                    default: {
                        return response.status(400).json({ error: "Invalid query" });
                    }
                }
            }
        }
        case "album": {
            if ( redisClient?.redis )
            {
              const value = await redisClient.redis.get(`yt:album:v2:${queryId}`);
              if ( value ) 
                return response.status(HttpStatusCode.Ok).json({message: 'Ok', result: JSON.parse(value)});
            }
            const searchResult = await YTMusicAPI('GET', `album/${encodeURIComponent(queryId)}`).catch(() => {
                redisClient?.redis.setex(`yt:album:v2:${queryId}`, 600, '');
            });
            if ( !searchResult ) return response.status(HttpStatusCode.NotFound).json({message: 'Not Found'});
            redisClient?.redis.setex(`yt:album:v2:${queryId}`, 1800, JSON.stringify(searchResult.data.result));
            return response.status(HttpStatusCode.Ok).json({message: 'Ok', result: searchResult.data.result});
        }
        case "artist": {
            if ( !query )
            {
                if ( redisClient?.redis )
                {
                  const value = await redisClient.redis.get(`yt:artist:v2:${queryId}:info`);
                  if ( value ) 
                    return response.status(HttpStatusCode.Ok).json({message: 'Ok', result: JSON.parse(value)});
                }
                const searchResult = await YTMusicAPI('GET', `artist/${encodeURIComponent(queryId)}`).catch(() => {
                    redisClient?.redis.setex(`yt:artist:v2:${queryId}:info`, 600, '');
                });
                if ( !searchResult ) return response.status(HttpStatusCode.NotFound).json({message: 'Not Found'});
                redisClient?.redis.setex(`yt:artist:v2:${queryId}:info`, 1800, JSON.stringify(searchResult.data.result));
                return response.status(HttpStatusCode.Ok).json({message: 'Ok', result: searchResult.data.result});
            }
            else
            {
                switch ( query )
                {
                    case "videos": {
                        if ( redisClient?.redis )
                        {
                          const value = await redisClient.redis.get(`yt:artist:v2:${queryId}:videos`);
                          if ( value ) 
                            return response.status(HttpStatusCode.Ok).json({message: 'Ok', result: JSON.parse(value)});
                        }
                        const searchResult = await YTMusicAPI('GET', `artist_videos/${encodeURIComponent(queryId)}`).catch(() => {
                            redisClient?.redis.setex(`yt:artist:v2:${queryId}:videos`, 600, '');
                        });
                        if ( !searchResult ) return response.status(HttpStatusCode.NotFound).json({message: 'Not Found'});
                        redisClient?.redis.setex(`yt:artist:v2:${queryId}:videos`, 900, JSON.stringify(searchResult.data.result));
                        return response.status(HttpStatusCode.Ok).json({message: 'Ok', result: searchResult.data.result});
                    }
                    default: {
                        return response.status(400).json({ error: "Invalid query" });
                    }
                }
            }
        }
        case "playlist": {
            if ( redisClient?.redis )
            {
              const value = await redisClient.redis.get(`yt:playlist:v2:${queryId}`);
              if ( value ) 
                return response.status(HttpStatusCode.Ok).json({message: 'Ok', result: JSON.parse(value)});
            }
            const searchResult = await YTMusicAPI('GET', `playlist/${encodeURIComponent(queryId)}`).catch(() => {
                redisClient?.redis.setex(`yt:playlist:v2:${queryId}`, 600, '');
            });
            if ( !searchResult ) return response.status(HttpStatusCode.NotFound).json({message: 'Not Found'});
            redisClient?.redis.setex(`yt:playlist:v2:${queryId}`, 1800, JSON.stringify(searchResult.data.result));
            return response.status(HttpStatusCode.Ok).json({message: 'Ok', result: searchResult.data.result});
        }
        default: {
            return response.status(400).json({ error: 'Invalid type' });
        }
    }
  } catch (err: any) {
    if ( process.env.NODE_ENV === "development" ) return response.status(HttpStatusCode.InternalServerError).json({error: 'Internal Server Error', debug: String(err) });
    return response.status(HttpStatusCode.InternalServerError).json({error: 'Internal Server Error'});
  }
}