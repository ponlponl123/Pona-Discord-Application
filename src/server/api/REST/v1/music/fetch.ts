import express from 'express';
import { HttpStatusCode } from 'axios';
import { fetchUserByOAuthAccessToken } from '@/utils/oauth';
import { database, redisClient, ytmusic } from '@/index';

export async function GET(request: express.Request, response: express.Response) {
  try {
    if ( !database || !database.pool || !ytmusic.client ) return response.status(HttpStatusCode.ServiceUnavailable).json({error: 'Service Unavailable'});
    const { authorization } = request.headers;
    const { id, type, query } = request.query;
    if ( !id || !type ) return response.status(400).json({ error: "Missing required parameters" });
    if ( !authorization ) return response.status(HttpStatusCode.Unauthorized).json({error: 'Unauthorized'});
    const tokenType = authorization.split(' ')[0];
    const tokenKey = authorization.split(' ')[1];
    const user = await fetchUserByOAuthAccessToken(tokenType, tokenKey);
    if ( !user ) return response.status(HttpStatusCode.Unauthorized).json({error: 'Unauthorized'});
    const queryId = String(id);

    switch ( type ) {
      case "album": {
        if ( redisClient?.redis)
        {
          const value = await redisClient.redis_ReadOnly.get(`yt:album:v1:${queryId}`);
          if ( value ) 
            return response.status(HttpStatusCode.Ok).json({message: 'Ok', result: JSON.parse(value)});
        }
        const searchResult = await ytmusic.client.getAlbum(queryId).catch(() => {
          redisClient?.redis.setex(`yt:album:v1:${queryId}`, 600, '');
        });
        if ( !searchResult ) return response.status(HttpStatusCode.NotFound).json({message: 'Not Found'});
        redisClient?.redis.setex(`yt:album:v1:${queryId}`, 5400, JSON.stringify(searchResult));
        return response.status(HttpStatusCode.Ok).json({message: 'Ok', result: searchResult});
      }
      case "song": {
        if ( redisClient?.redis)
        {
          const value = await redisClient.redis_ReadOnly.get(`yt:song:v1:${queryId}`);
          if ( value ) 
            return response.status(HttpStatusCode.Ok).json({message: 'Ok', result: JSON.parse(value)});
        }
        const searchResult = await ytmusic.client.getSong(queryId).catch(() => {
          redisClient?.redis.setex(`yt:song:v1:${queryId}`, 600, '');
        });
        if ( !searchResult ) return response.status(HttpStatusCode.NotFound).json({message: 'Not Found'});
        redisClient?.redis.setex(`yt:song:v1:${queryId}`, 5400, JSON.stringify(searchResult));
        return response.status(HttpStatusCode.Ok).json({message: 'Ok', result: searchResult});
      }
      case "video": {
        if ( redisClient?.redis)
        {
          const value = await redisClient.redis_ReadOnly.get(`yt:video:v1:${queryId}`);
          if ( value ) 
            return response.status(HttpStatusCode.Ok).json({message: 'Ok', result: JSON.parse(value)});
        }
        const searchResult = await ytmusic.client.getVideo(queryId).catch(() => {
          redisClient?.redis.setex(`yt:video:v1:${queryId}`, 600, '');
        });
        if ( !searchResult ) return response.status(HttpStatusCode.NotFound).json({message: 'Not Found'});
        redisClient?.redis.setex(`yt:video:v1:${queryId}`, 5400, JSON.stringify(searchResult));
        return response.status(HttpStatusCode.Ok).json({message: 'Ok', result: searchResult});
      }
      case "artist": {
        if ( !query ) {
          if ( redisClient?.redis)
          {
            const value = await redisClient.redis_ReadOnly.get(`yt:artist:v1:info:${queryId}`).catch(() => {
              redisClient?.redis.setex(`yt:artist:v1:info:${queryId}`, 600, '');
            });
            if ( value ) 
              return response.status(HttpStatusCode.Ok).json({message: 'Ok', result: JSON.parse(value)});
          }
          const searchResult = await ytmusic.client.getArtist(queryId);
          if ( !searchResult ) return response.status(HttpStatusCode.NotFound).json({message: 'Not Found'});
          redisClient?.redis.setex(`yt:artist:v1:${queryId}`, 1800, JSON.stringify(searchResult));
          return response.status(HttpStatusCode.Ok).json({message: 'Ok', result: searchResult});
        }
        else
        {
          switch ( query ) {
            case "albums": {
              if ( redisClient?.redis)
              {
                const value = await redisClient.redis_ReadOnly.get(`yt:artist:v1:albums:${queryId}`);
                if ( value ) 
                  return response.status(HttpStatusCode.Ok).json({message: 'Ok', result: JSON.parse(value)});
              }
              const searchResult = await ytmusic.client.getArtistAlbums(queryId).catch(() => {
                redisClient?.redis.setex(`yt:artist:v1:albums:${queryId}`, 600, '');
              });
              if ( !searchResult ) return response.status(HttpStatusCode.NotFound).json({message: 'Not Found'});
              redisClient?.redis.setex(`yt:artist:v1:albums:${queryId}`, 1800, JSON.stringify(searchResult));
              return response.status(HttpStatusCode.Ok).json({message: 'Ok', result: searchResult});
            }
            case "songs": {
              if ( redisClient?.redis)
              {
                const value = await redisClient.redis_ReadOnly.get(`yt:artist:v1:songs:${queryId}`);
                if ( value ) 
                  return response.status(HttpStatusCode.Ok).json({message: 'Ok', result: JSON.parse(value)});
              }
              const searchResult = await ytmusic.client.getArtistSongs(queryId).catch(() => {
                redisClient?.redis.setex(`yt:artist:v1:songs:${queryId}`, 600, '');
              });
              if ( !searchResult ) return response.status(HttpStatusCode.NotFound).json({message: 'Not Found'});
              redisClient?.redis.setex(`yt:artist:v1:songs:${queryId}`, 1800, JSON.stringify(searchResult));
              return response.status(HttpStatusCode.Ok).json({message: 'Ok', result: searchResult});
            }
            default: {
              return response.status(400).json({ error: 'Invalid query' });
            }
          }
        }
      }
      case "playlist": {
        if ( redisClient?.redis)
        {
          const value = await redisClient.redis_ReadOnly.get(`yt:playlist:v1:${queryId}`);
          if ( value ) 
            return response.status(HttpStatusCode.Ok).json({message: 'Ok', result: JSON.parse(value)});
        }
        const searchResult = await ytmusic.client.getPlaylist(queryId).catch(() => {
          redisClient?.redis.setex(`yt:playlist:v1:${queryId}`, 600, '');
        });
        if ( !searchResult ) return response.status(HttpStatusCode.NotFound).json({message: 'Not Found'});
        const videos = await ytmusic.client.getPlaylistVideos(queryId);
        redisClient?.redis.setex(`yt:playlist:v1:${queryId}`, 1800, JSON.stringify({...searchResult, videos}));
        return response.status(HttpStatusCode.Ok).json({message: 'Ok', result: {...searchResult, videos}});
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