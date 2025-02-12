import express from 'express';
import { HttpStatusCode } from 'axios';
import { fetchUserByOAuthAccessToken } from '@/utils/oauth';
import { database, ytmusic } from '@/index';

export async function GET(request: express.Request, response: express.Response) {
  try {
    if ( !database || !database.connection ) return response.status(HttpStatusCode.ServiceUnavailable).json({error: 'Service Unavailable'});
    const { authorization } = request.headers;
    const { q, is_suggestion } = request.query;
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
      const searchResult = await ytmusic.client.search(String(q));
      return response.status(HttpStatusCode.Ok).json({message: 'Ok', result: searchResult});
    }
  } catch (err) {
    if ( process.env.NODE_ENV === "development" ) return response.status(HttpStatusCode.InternalServerError).json({error: 'Internal Server Error', debug: err});
    return response.status(HttpStatusCode.InternalServerError).json({error: 'Internal Server Error'});
  }
}