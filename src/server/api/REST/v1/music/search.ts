import express from 'express';
import { HttpStatusCode } from 'axios';
import { fetchUserByOAuthAccessToken } from '@/utils/oauth';
import YTMusicAPI from '@/utils/ytmusic-api/request';
import { ytmusic } from '@/index';

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
      const searchSuggestions = await ytmusic.client.getSearchSuggestions(String(q));
      return response.status(HttpStatusCode.Ok).json({message: 'Ok', searchSuggestions: searchSuggestions});
    } else {
      let URL = `search/${encodeURIComponent(String(q))}`;
      URL += filter ? `?filter=${filter}` : "";
      const searchResult = await YTMusicAPI('GET', URL.toString());
      if ( !searchResult ) return response.status(HttpStatusCode.ServiceUnavailable).json({message: 'Service Unavailable'});
      return response.status(HttpStatusCode.Ok).json({message: 'Ok', result: searchResult.data.result});
    }
  } catch (err) {
    if ( process.env.NODE_ENV === "development" ) return response.status(HttpStatusCode.InternalServerError).json({error: 'Internal Server Error', debug: err});
    return response.status(HttpStatusCode.InternalServerError).json({error: 'Internal Server Error'});
  }
}