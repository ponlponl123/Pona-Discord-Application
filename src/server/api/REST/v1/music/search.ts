import express from 'express';
import { HttpStatusCode } from 'axios';
import { fetchUserByOAuthAccessToken } from '@/utils/oauth';
import YTMusicAPI from '@/utils/ytmusic-api/request';
import { database, redisClient, ytmusic } from '@/index';

export async function GET(request: express.Request, response: express.Response) {
  try {
    const { authorization } = request.headers;
    const { q, is_suggestion, filter } = request.query;
    if ( !q ) return response.status(400).json({ error: "Missing required parameters" });
    if ( !authorization ) return response.status(HttpStatusCode.Unauthorized).json({error: 'Unauthorized'});
    const tokenType = authorization.split(' ')[0];
    const tokenKey = authorization.split(' ')[1];
    const user = await fetchUserByOAuthAccessToken(tokenType, tokenKey);
    if ( !user ) return response.status(HttpStatusCode.Unauthorized).json({error: 'Unauthorized'});
    
    if ( is_suggestion === "true" ) {
      if ( redisClient?.redis )
      {
        const value = await redisClient.redis_ReadOnly.get(`yt:search:suggestions:${String(q)}`);
        if ( value ) 
          return response.status(HttpStatusCode.Ok).json({message: 'Ok', searchSuggestions: JSON.parse(value)});
      }
      const searchSuggestions = await ytmusic.client.getSearchSuggestions(String(q));
      redisClient?.redis.setex(`yt:search:suggestions:${String(q)}`, 1800, JSON.stringify(searchSuggestions));
      return response.status(HttpStatusCode.Ok).json({message: 'Ok', searchSuggestions: searchSuggestions});
    } else {
      if ( database && database.connection )
        database.connection.query(
          `INSERT INTO search_history (uid, text) VALUES (?, ?)`,
          [user.id, String(q)]
        );
      if ( redisClient?.redis )
      {
        redisClient.redis.multi()
          .lrem(`user:${user.id}:history:search`, 0, String(q))
          .lpush(`user:${user.id}:history:search`, String(q))
          .ltrim(`user:${user.id}:history:search`, 0, 7)
          .expire(`user:${user.id}:history:search`, 600)
          .exec();
        const value = await redisClient.redis_ReadOnly.get(`yt:search:query:${filter || 'all'}:${String(q)}`);
        if ( value ) 
          return response.status(HttpStatusCode.Ok).json({message: 'Ok', result: JSON.parse(value)});
      }
      let URL = `search?query=${encodeURIComponent(String(q))}`;
      URL += filter ? `&filter=${filter}` : "";
      const searchResult = await YTMusicAPI('GET', URL.toString());
      if ( !searchResult ) return response.status(HttpStatusCode.ServiceUnavailable).json({message: 'Service Unavailable'});
      redisClient?.redis.setex(`yt:search:query:${filter || 'all'}:${String(q)}`, 300, JSON.stringify(searchResult.data.result));
      return response.status(HttpStatusCode.Ok).json({message: 'Ok', result: searchResult.data.result});
    }
  } catch (err: any) {
    if ( err?.status === 404 ) return response.status(HttpStatusCode.NotFound).json({message: 'Not Found', result: []});
    if ( process.env.NODE_ENV === "development" ) return response.status(HttpStatusCode.InternalServerError).json({error: 'Internal Server Error', debug: err});
    return response.status(HttpStatusCode.InternalServerError).json({error: 'Internal Server Error'});
  }
}