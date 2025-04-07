import express from 'express';
import { HttpStatusCode } from 'axios';
import { fetchUserByOAuthAccessToken } from '@/utils/oauth';
import YTMusicAPI from '@/utils/ytmusic-api/request';
import { database, redisClient, ytmusic } from '@/index';

export const path = '/:fetch?';

export async function GET(request: express.Request, response: express.Response) {
  try {
    if ( !database || !database.connection || !ytmusic.client ) return response.status(HttpStatusCode.ServiceUnavailable).json({error: 'Service Unavailable'});
    const { authorization } = request.headers;
    const { fetch } = request.params;
    const { id, type, query, params } = request.query;
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
            let api_request = `search?query=${encodeURIComponent(`${queryId}: ${t.toString()} - ${a.toString()}`)}`;
            api_request += '&limit=1';
            if ( type === 'song' )
                api_request += '&filter=songs';
            else if ( type === 'video' )
                api_request += '&filter=videos';
            else return response.status(HttpStatusCode.MethodNotAllowed).json({error: 'Method Not Allowed'});
            const searchResult = await YTMusicAPI('GET', api_request.toString()).catch(() => {
                redisClient?.redis.setex(`yt:av:${queryId}:${type}`, 60, '');
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
                        if ( !params ) return response.status(400).json({ error: "Invalid params" });
                        if ( redisClient?.redis )
                        {
                          const value = await redisClient.redis.get(`yt:user:${queryId}:videos`);
                          if ( value ) 
                            return response.status(HttpStatusCode.Ok).json({message: 'Ok', result: JSON.parse(value)});
                        }
                        const searchResult = await YTMusicAPI('GET', `user/${encodeURIComponent(queryId)}?params=${encodeURIComponent(params.toString())}`).catch(() => {
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
            if ( redisClient?.redis )
            {
              const value = await redisClient.redis.get(`yt:artist:v2:${queryId}`);
              if ( value ) 
                return response.status(HttpStatusCode.Ok).json({message: 'Ok', result: JSON.parse(value)});
            }
            const searchResult = await YTMusicAPI('GET', `artist/${encodeURIComponent(queryId)}`).catch(() => {
                redisClient?.redis.setex(`yt:artist:v2:${queryId}`, 600, '');
            });
            if ( !searchResult ) return response.status(HttpStatusCode.NotFound).json({message: 'Not Found'});
            redisClient?.redis.setex(`yt:artist:v2:${queryId}`, 1800, JSON.stringify(searchResult.data.result));
            return response.status(HttpStatusCode.Ok).json({message: 'Ok', result: searchResult.data.result});
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
  } catch (err) {
    if ( process.env.NODE_ENV === "development" ) return response.status(HttpStatusCode.InternalServerError).json({error: 'Internal Server Error', debug: err});
    return response.status(HttpStatusCode.InternalServerError).json({error: 'Internal Server Error'});
  }
}